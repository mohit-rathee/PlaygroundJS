import { EventClass } from "./eventClass";
import { DELTA_TIME, MIN_DISTANCE_BTW_PTS, RDP_CATMULLROM, RDP_NORMAL, REFINE_THRESHOLD } from "../utils/initials";
import { distanceBtwPoints, ramerDouglasPeucker } from "../utils/magic_functions";
import { ToolRequirements } from "../components/drawingBoard";


export class DrawPencilEventClass extends EventClass {
    public type: "FreeForm" | "CatmullRom";
    public stroke: FreeForm | CatmullRom | null

    private timer: number;
    private threshold: number;

    private minX: number;
    private minY: number;
    private maxX: number;
    private maxY: number;

    constructor(
        args:ToolRequirements,
        type: "FreeForm" | "CatmullRom"
    ) {
        super(args)

        this.type = type
        this.stroke = null
        this.timer = Date.now()
        this.threshold = 0
        this.minX = Infinity
        this.minY = Infinity
        this.maxX = -Infinity
        this.maxY = -Infinity

        //constructor
        console.log('adding drawPencilEvent')
        this.canvasClass.pCanvas.addEventListener('mousedown', this.startPencilEvent)
        //deConstructor
        this.deConstructor = () => {
            console.log('removing drawPencilEvent')
            this.canvasClass.pCanvas.removeEventListener('mousedown', this.startPencilEvent)
            this.canvasClass.pCanvas.removeEventListener('mousemove', this.drawPencilEvent)
            this.canvasClass.pCanvas.removeEventListener('mouseup', this.stopPencilEvent)
        }
    }

    startPencilEvent = (e: MouseEvent) => {
        if (!this.drawing.current) return
        this.setOnTop(true)
        const pos = {
            x: e.clientX,
            y: e.clientY,
        };


        this.timer = Date.now()

        this.stroke = this.createNewStroke(this.type)
        this.stroke.points = [pos]
        this.minX = pos.x
        this.minY = pos.y
        this.maxX = pos.x
        this.maxY = pos.y

        this.canvasClass.clearCanvas()
        this.canvasClass.prepareContext(this.stroke)
        this.canvasClass.pContext.moveTo(pos.x, pos.y);
        this.canvasClass.rContext.moveTo(pos.x, pos.y);

        this.canvasClass.pCanvas.addEventListener('mousemove', this.drawPencilEvent)
        this.canvasClass.pCanvas.addEventListener('mouseup', this.stopPencilEvent)
    }

    drawPencilEvent = (event: MouseEvent) => {
        if (!this.stroke) throw new Error('stroke is null')
        const now = Date.now()
        const timeGap = this.timer + DELTA_TIME
        if (now < timeGap) return
        const pos = {
            x: event.clientX,
            y: event.clientY,
        };

        // Only add the point if the distance is greater than threshold
        const lastPoint = this.stroke.points.slice(-1)[0]
        const distance = distanceBtwPoints(pos, lastPoint)
        if (distance < MIN_DISTANCE_BTW_PTS) return

        this.canvasClass.pContext.lineTo(pos.x, pos.y);
        this.canvasClass.pContext.stroke()
        this.canvasClass.rContext.lineTo(pos.x, pos.y);
        this.canvasClass.rContext.stroke()

        this.stroke.points.push(pos)
        console.log(this.stroke.points)
        this.updateMinMax(pos)


        if (this.threshold > REFINE_THRESHOLD) {
            // TODO update RDP to only work on last section on points
            console.log('threshold hits')
            this.useRDP()
            this.canvasClass.clearCanvas()
            this.canvasClass.drawStroke(this.stroke)
            this.threshold = 0
        } else {
            this.threshold += 1
        }
        this.timer = now
    }

    stopPencilEvent = () => {
        if (!this.stroke) throw new Error('stroke is null')
        this.setOnTop(false)
        this.useRDP()
        const newStroke = this.getStroke()
        // newStroke.image = this.canvasClass.pCanvas.toDataURL("image/jpg")
        this.canvasClass.clearCanvas()
        this.drawing.current?.addStroke(newStroke)

        this.canvasClass.pCanvas.removeEventListener('mousemove', this.drawPencilEvent)
        this.canvasClass.pCanvas.removeEventListener('mouseup', this.stopPencilEvent)
    }
    updateMinMax(p: point) {
        // update min & max points
        if (p.x < this.minX) { this.minX = p.x }
        else if (p.x > this.maxX) { this.maxX = p.x }
        if (p.y < this.minY) { this.minY = p.y }
        else if (p.y > this.maxY) { this.maxY = p.y }
    }
    isThresholdTouched() {
        if (this.threshold > REFINE_THRESHOLD) {
            return true
        } else {
            return false
        }
    }
    useRDP() {
        if (!this.stroke) throw new Error('stroke is null')
        const points = this.stroke.points

        const newPoints = points.slice(-REFINE_THRESHOLD)

        let simplifiedPoints: point[] = [];
        console.log(newPoints.length)
        switch (this.type) {
            case "FreeForm":
                simplifiedPoints = ramerDouglasPeucker(newPoints, RDP_NORMAL)
            case "CatmullRom":
                simplifiedPoints = ramerDouglasPeucker(newPoints, RDP_CATMULLROM)

        }

        this.stroke.points = [
            ...points.slice(0, -20),
            ...simplifiedPoints
        ]
    }

    getStroke(): Stroke {
        if (!this.stroke) throw new Error('stroke is null')
        const centerX = (this.minX + this.maxX) / 2
        const centerY = (this.minY + this.maxY) / 2
        this.stroke.cornerP = { 'x': this.maxX - centerX, 'y': this.maxY - centerY }
        this.stroke.centerP = { 'x': centerX, 'y': centerY }
        const newPoints = this.stroke.points.map(point => ({
            'x': point.x - centerX,
            'y': point.y - centerY,
        }))
        this.stroke.points = newPoints

        return this.stroke
    }
}
