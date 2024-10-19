import { EventClass } from "./eventClass";
import { distanceBtwPoints } from "../utils/magic_functions";
import { MIN_DISTANCE_BTW_PTS } from "../utils/initials";
import { ToolRefs } from "../types";
import { Shapes } from "../lib/Strokes/Shapes";

export class DrawShapeEventClass extends EventClass {
    private stroke: Shapes | null;
    private pointA: point
    private pointB: point
    private shape: "Rectangle" | "Circle";



    constructor(
        toolRef: ToolRefs,
        shape: "Rectangle" | "Circle"
    ) {
        super(toolRef)

        this.stroke = null
        this.pointA = { x: 0, y: 0 }
        this.pointB = { x: 0, y: 0 }
        this.shape = shape


        //constructor
        console.log('adding drawShapeEvent for', shape)
        this.canvasClass.pCanvas.addEventListener('mousedown', this.startShapeEvent)
    }

    //deConstructor
    deConstructor() {
        console.log('removing drawPolygonEvent')
        this.canvasClass.pCanvas.removeEventListener('mousedown', this.startShapeEvent)
        this.canvasClass.pCanvas.removeEventListener('mousedown', this.drawShapeEvent)
        this.canvasClass.pCanvas.removeEventListener('mousemove', this.drawOutlineEvent)
    }
    startShapeEvent = (e: MouseEvent) => {
        if (!this.drawing.current) return
        this.setOnTop(true)
        const pos = {
            x: e.clientX,
            y: e.clientY,
        };

        this.stroke = this.createNewStroke(this.shape)
        console.log(this.stroke.data.type)
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


    getStroke(): Shapes {
        if (!this.stroke) throw new Error('stroke is null')
        const ptA = this.pointA
        const ptB = this.pointB
        const center = { x: (ptA.x + ptB.x) / 2, y: (ptA.y + ptB.y) / 2 }
        this.stroke.centerP = center

        switch (this.stroke.data.type) {
            case "Rectangle": {
                const minP = { x: Math.min(ptA.x, ptB.x), y: Math.min(ptA.y, ptB.y) }
                //translating
                minP.x -= center.x
                minP.y -= center.y

                this.stroke.cornerP = minP
                this.stroke.data.width = Math.max(Math.abs(ptA.x - ptB.x),
                    MIN_DISTANCE_BTW_PTS)
                this.stroke.data.height = Math.max(Math.abs(ptA.y - ptB.y),
                    MIN_DISTANCE_BTW_PTS)
                return this.stroke
            }
            case "Circle": {
                const radius = Math.max(
                    distanceBtwPoints(ptA, ptB) / 2,
                    MIN_DISTANCE_BTW_PTS
                )
                this.stroke.cornerP = { x: -radius.toFixed(2), y: -radius.toFixed(2) }
                this.stroke.data.radius = radius
                return this.stroke
            } default: { throw new Error('Shape is wrong') }

        }
    }
}
