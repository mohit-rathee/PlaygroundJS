import { EventClass } from "./eventClass";
import { distanceBtwPoints } from "../utils/magic_functions";
import { MIN_DISTANCE_BTW_PTS } from "../utils/initials";
import { ToolRefs } from "../types";

export class DrawPolygonEventClass extends EventClass {
    private stroke: Polygon | null;
    private minX: number;
    private minY: number;
    private maxX: number;
    private maxY: number;

    constructor(
        toolRef: ToolRefs,
    ) {
        super(toolRef)

        this.stroke = null
        this.minX = Infinity
        this.minY = Infinity
        this.maxX = -Infinity
        this.maxY = -Infinity

        //constructor
        console.log('adding drawPolygonEvent')
        this.canvasClass.pCanvas.addEventListener('mousedown', this.startPolygonEvent)
    }

    //deConstructor
    deConstructor() {
        console.log('removing drawPolygonEvent')
        this.canvasClass.pCanvas.removeEventListener('mousedown', this.startPolygonEvent)
        this.canvasClass.pCanvas.removeEventListener('mousedown', this.drawPolygonEvent)
        this.canvasClass.pCanvas.removeEventListener('mousemove', this.drawOutlineEvent)
    }

    startPolygonEvent = (e: MouseEvent) => {
        if (!this.drawing.current) return
        this.setOnTop(true)
        const pos = {
            x: e.clientX,
            y: e.clientY,
        };

        this.stroke = this.createNewStroke("Polygon")
        this.stroke.type = "Polygon"
        this.stroke.points = [pos]
        this.minX = pos.x
        this.minY = pos.y
        this.maxX = pos.x
        this.maxY = pos.y

        this.canvasClass.clearCanvas()

        this.canvasClass.pCanvas.removeEventListener('mousedown', this.startPolygonEvent)
        this.canvasClass.pCanvas.addEventListener('mousedown', this.drawPolygonEvent)
        this.canvasClass.pCanvas.addEventListener('mousemove', this.drawOutlineEvent)

    }
    drawPolygonEvent = (e: MouseEvent) => {
        if (!this.drawing.current) return
        if (!this.stroke) return
        const pos = {
            x: e.clientX,
            y: e.clientY,
        };

        this.canvasClass.clearCanvas()

        const lastP = this.stroke.points.slice(-1)[0]
        const distance = distanceBtwPoints(pos, lastP)
        if (distance < MIN_DISTANCE_BTW_PTS) {
            console.log('polygon completed')
            this.drawing.current.addStroke(this.getStroke())
            this.canvasClass.pCanvas.removeEventListener('mousemove', this.drawOutlineEvent)
            this.canvasClass.pCanvas.removeEventListener('mousedown', this.drawPolygonEvent)
            this.canvasClass.pCanvas.addEventListener('mousedown', this.startPolygonEvent)
            this.setOnTop(false)
            return
        }

        this.canvasClass.drawStroke(this.stroke)

        this.canvasClass.prepareContext(this.stroke)
        this.canvasClass.pContext.moveTo(lastP.x, lastP.y);
        this.canvasClass.rContext.moveTo(lastP.x, lastP.y);

        this.canvasClass.pContext.lineTo(pos.x, pos.y);
        // this.canvasClass.rContext.lineTo(pos.x, pos.y);


        this.stroke.points.push(pos)
        this.updateMinMax(pos)
    }

    drawOutlineEvent = (event: MouseEvent) => {
        if (!this.stroke) throw new Error('stroke is null')
        const pos = {
            x: event.clientX,
            y: event.clientY,
        };


        this.canvasClass.clearCanvas()
        this.canvasClass.prepareContext(this.stroke)
        this.canvasClass.drawStroke(this.stroke)

        const lastP = this.stroke.points.slice(-1)[0]
        this.canvasClass.pContext.moveTo(lastP.x, lastP.y);
        this.canvasClass.rContext.moveTo(lastP.x, lastP.y);
        this.canvasClass.pContext.lineTo(pos.x, pos.y);
        this.canvasClass.rContext.lineTo(pos.x, pos.y);

        this.canvasClass.pContext.stroke()
        this.canvasClass.rContext.stroke()
    }

    updateMinMax(p: point) {
        // update min & max points
        if (p.x < this.minX) { this.minX = p.x }
        else if (p.x > this.maxX) { this.maxX = p.x }
        if (p.y < this.minY) { this.minY = p.y }
        else if (p.y > this.maxY) { this.maxY = p.y }
    }

    getStroke(): Stroke {
        if (!this.stroke) throw new Error('stroke is null')
        const centerX = (this.minX + this.maxX) / 2
        const centerY = (this.minY + this.maxY) / 2
        this.stroke.cornerP = { 'x': this.minX - centerX, 'y': this.minY - centerY }
        this.stroke.centerP = { 'x': centerX, 'y': centerY }
        const newPoints = this.stroke.points.map(point => ({
            'x': point.x - centerX,
            'y': point.y - centerY,
        }))
        this.stroke.points = newPoints

        return this.stroke
    }
}
