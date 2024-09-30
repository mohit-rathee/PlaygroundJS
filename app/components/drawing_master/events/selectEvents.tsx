import { DrawingClass } from "../lib/DrawingClass";
import React from "react";
import { EventClass } from "./eventClass";
import { CanvasClass } from "../lib/CanvasClass";


export class SelectEventClass extends EventClass {
    private selectPos: point;
    public stroke: Stroke | null;
    public strokeInfo: {
        layer: number,
        stroke_id: number,
    }

    constructor(
        canvasClass: CanvasClass,
        drawingClass: React.RefObject<DrawingClass>,
    ) {
        super(canvasClass, drawingClass)
        this.selectPos = { x: 0, y: 0 }
        this.stroke = null
        this.strokeInfo = {
            layer: 0,
            stroke_id: 0,
        }
        //constructor
        console.log('adding SelectEventClass')
        this.canvasClass.pCanvas.addEventListener('mousedown', this.selectEvent)
        //deConstructor
        this.deConstructor = () => {
            console.log('removing SelectEventClass')
            this.canvasClass.pCanvas.removeEventListener('mousedown', this.selectEvent)
            this.canvasClass.pCanvas.removeEventListener('mousemove', this.dragEvent)
            this.canvasClass.pCanvas.removeEventListener('mousedown', this.placeEvent)
        }
    }

    selectEvent = (e: MouseEvent) => {
        this.canvasClass?.clearCanvas()
        const pos: point = { x: e.clientX, y: e.clientY }
        const selectedStroke = this.drawing.current?.select(pos)
        if (selectedStroke) {
            this.stroke = selectedStroke.stroke
            this.strokeInfo.layer = selectedStroke.layer
            this.strokeInfo.stroke_id = selectedStroke.stroke_id
            this.selectPos = {
                x: pos.x,
                y: pos.y,
            }
            console.log('selected at', this.selectPos)
            this.dragEvent(e)
            this.canvasClass?.pCanvas.addEventListener('mousemove', this.dragEvent)
            this.canvasClass?.pCanvas.addEventListener('mousedown', this.placeEvent)
            this.canvasClass?.pCanvas.removeEventListener('mousedown', this.selectEvent)
        }
    }

    dragEvent = (e: MouseEvent) => {
        const pos: point = { 'x': e.clientX, 'y': e.clientY }
        if (!this.stroke) throw new Error('stroke is null')

        const newCenterP = this.getNewCenterP(pos)
        this.stroke.centerP = newCenterP
        this.canvasClass.clearCanvas()
        this.canvasClass.drawStroke(this.stroke)
    }

    placeEvent = (e: MouseEvent) => {
        const pos: point = { 'x': e.clientX, 'y': e.clientY }
        const layer = this.strokeInfo.layer
        const stroke_id = this.strokeInfo.stroke_id
        const newCenterP = this.getNewCenterP(pos)
        console.log('placed at', newCenterP)
        this.drawing.current?.placeStrokeAt(layer, stroke_id, newCenterP)
        this.canvasClass?.clearCanvas()
        this.canvasClass?.pCanvas.removeEventListener('mousemove', this.dragEvent)
        this.canvasClass?.pCanvas.removeEventListener('mousedown', this.placeEvent)
        this.canvasClass?.pCanvas.addEventListener('mousedown', this.selectEvent)
    }

    getNewCenterP(p: point): point {
        if (!this.stroke) throw new Error('stroke is null')
        const centerP = this.stroke.centerP
        const gap = { x: p.x - this.selectPos.x, y: p.y - this.selectPos.y }
        this.selectPos = p
        return { x: centerP.x + gap.x, y: centerP.y + gap.y }
    }

    // drawGizmo(pMin: point, pMax: point) {
    //     const ctx = this.context
    //     ctx.save()
    //     ctx.setLineDash([5, 5])
    //
    //     // Draw the rectangle
    //     ctx.beginPath()
    //     const width = pMax.x - pMin.x + 20
    //     const height = pMax.y - pMin.y + 20
    //     ctx.rect(pMin.x - 10, pMin.y - 10, width, height)
    //     ctx.strokeStyle = 'black'
    //     ctx.lineWidth = 2
    //     ctx.stroke()
    //     ctx.restore()
    // }

}