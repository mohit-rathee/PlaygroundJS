import { EventClass } from "./eventClass";
import { distanceBtwPoints } from "../utils/magic_functions";
import { MIN_DISTANCE_BTW_PTS } from "../utils/initials";
import { ToolRequirements } from "../components/drawingBoard";

export class DrawShapeEventClass extends EventClass {
    private stroke: Rectangle | Circle | null;
    private pointA: point
    private pointB: point
    private shape: "Rectangle" | "Circle";



    constructor(
        args:ToolRequirements,
        shape: "Rectangle" | "Circle"
    ) {
        super(args)

        this.stroke = null
        this.pointA = { x: 0, y: 0 }
        this.pointB = { x: 0, y: 0 }
        this.shape = shape


        //constructor
        console.log('adding drawShapeEvent')
        this.canvasClass.pCanvas.addEventListener('mousedown', this.startShapeEvent)
        //deConstructor
        this.deConstructor = () => {
            console.log('removing drawPolygonEvent')
            this.canvasClass.pCanvas.removeEventListener('mousedown', this.startShapeEvent)
            this.canvasClass.pCanvas.removeEventListener('mousedown', this.drawShapeEvent)
            this.canvasClass.pCanvas.removeEventListener('mousemove', this.drawOutlineEvent)
        }
    }

    startShapeEvent = (e: MouseEvent) => {
        if (!this.drawing.current) return
        this.setOnTop(true)
        const pos = {
            x: e.clientX,
            y: e.clientY,
        };

        this.stroke = this.createNewStroke(this.shape)
        this.pointA = pos
        this.pointB = pos

        this.canvasClass.clearCanvas()
        this.canvasClass.drawStroke(this.getStroke())

        // this.canvasClass.pCanvas.removeEventListener('mousedown', this.startShapeEvent)
        this.canvasClass.pCanvas.addEventListener('mousemove', this.drawOutlineEvent)
        this.canvasClass.pCanvas.addEventListener('mouseup', this.drawShapeEvent)

    }
    drawShapeEvent = (e: MouseEvent) => {
        if (!this.drawing.current) return
        if (!this.stroke) return
        const pos = {
            x: e.clientX,
            y: e.clientY,
        };
        this.pointB = pos
        this.canvasClass.clearCanvas()
        this.drawing.current.addStroke(this.getStroke())
        this.canvasClass.pCanvas.removeEventListener('mousemove', this.drawOutlineEvent)
        this.canvasClass.pCanvas.removeEventListener('mouseup', this.drawShapeEvent)
        this.canvasClass.pCanvas.addEventListener('mousedown', this.startShapeEvent)
        this.setOnTop(false)
        return
    }


    drawOutlineEvent = (event: MouseEvent) => {
        if (!this.stroke) throw new Error('stroke is null')
        const pos = {
            x: event.clientX,
            y: event.clientY,
        };

        this.pointB = pos;

        this.canvasClass.clearCanvas()
        this.canvasClass.drawStroke(this.getStroke())
    }


    getStroke(): Stroke {
        if (!this.stroke) throw new Error('stroke is null')
        const ptA = this.pointA
        const ptB = this.pointB
        this.stroke.centerP = { x: (ptA.x + ptB.x) / 2, y: (ptA.y + ptB.y) / 2 }
        this.stroke.cornerP = ptA
        switch (this.stroke.type) {
            case "Rectangle": {
/*top-left */   const pt1 = { x: ptA.x - this.stroke.centerP.x, y: ptA.y - this.stroke.centerP.y }
/*top-right */  const pt3 = { x: ptB.x - this.stroke.centerP.x, y: ptB.y - this.stroke.centerP.y }
/*bottom-left */const pt2 = { x: pt3.x, y: pt1.y };
/*bottom-right*/const pt4 = { x: pt1.x, y: pt3.y };
                this.stroke.points = [pt1, pt2, pt3, pt4, pt1]//order matters
                return this.stroke
            }
            case "Circle": {
                this.stroke.radius = Math.max(
                    distanceBtwPoints(ptA, ptB) / 2,
                    MIN_DISTANCE_BTW_PTS
                )
                console.log(this.stroke.centerP)
                return this.stroke
            } default: { throw new Error('Shape is wrong') }

        }
    }
}
