import { MainCanvasClass } from "../lib/MainCanvasClass";
import { DrawingClass } from "../lib/DrawingClass";
import React from "react";
import { EventClass } from "./eventClass";
import { DELTA_TIME, RDP_CATMULLROM, RDP_NORMAL, REDRAW_THRESHOLD } from "../utils/initials";
import { CanvasClass } from "../lib/CanvasClass";
import { ramerDouglasPeucker } from "../utils/magic_functions";


export class DrawPencilEventClass extends EventClass {
    private timer: number;
    private threshold: number;
    public stroke: Stroke | null
    private minX: number;
    private minY: number;
    private maxX: number;
    private maxY: number;

    constructor(
        canvasClass: CanvasClass,
        drawingClass: React.RefObject<DrawingClass>,
    ) {
        super(canvasClass, drawingClass)

        this.timer = Date.now()
        this.threshold = 0
        this.stroke = null
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
        this.canvasClass.clearCanvas()
        this.stroke = this.drawing.current.getNewStroke()
        this.stroke.data.points = [pos]
        this.updateMinMax(pos)
        this.canvasClass.pContext.beginPath()
        this.canvasClass.pContext.moveTo(pos.x, pos.y);
        this.canvasClass.pContext.strokeStyle = this.stroke.color
        this.canvasClass.pContext.lineWidth = this.stroke.lineWidth
        this.canvasClass.pContext.lineCap = 'round'
        this.canvasClass.rContext.beginPath()
        this.canvasClass.rContext.moveTo(pos.x, pos.y);
        this.canvasClass.rContext.strokeStyle = this.stroke.color
        this.canvasClass.rContext.lineWidth = this.stroke.lineWidth
        this.canvasClass.rContext.lineCap = 'round'

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

        this.updateMinMax(pos)
        this.stroke.data.points.push(pos)

        this.canvasClass.pContext.lineTo(pos.x, pos.y);
        this.canvasClass.pContext.stroke()
        this.canvasClass.rContext.lineTo(pos.x, pos.y);
        this.canvasClass.rContext.stroke()


        if (this.threshold > REDRAW_THRESHOLD) {
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
        newStroke.image = this.canvasClass.pCanvas.toDataURL("image/jpg")
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
        if (this.threshold > REDRAW_THRESHOLD) {
            return true
        } else {
            return false
        }
    }
    useRDP() {
        if (!this.stroke) throw new Error('stroke is null')
        const points = this.stroke.data.points
        const style = this.stroke.data.style
        if (style == "CatmullRom") {
            this.stroke.data.points = ramerDouglasPeucker(points, RDP_CATMULLROM)
        } else if (style == "Normal") {
            this.stroke.data.points = ramerDouglasPeucker(points, RDP_NORMAL)
        }
    }
    getStroke(): Stroke {
        if (!this.stroke) throw new Error('stroke is null')
        const centerX = (this.minX + this.maxX) / 2
        const centerY = (this.minY + this.maxY) / 2
        const cornerP = { 'x': this.maxX - centerX, 'y': this.maxY - centerY }
        // const minP = { 'x': this.minX - centerX, 'y': this.minY - centerY }
        const centerP = { 'x': centerX, 'y': centerY }
        const newPoints = this.stroke.data.points.map(point => ({
            'x': point.x - centerX,
            'y': point.y - centerY,
        }))

        const color = this.stroke.color
        const lineWidth = this.stroke.lineWidth
        const style = this.stroke.data.style
        const stroke = {
            uid: NaN,
            type: 'Pencil',
            data: { 'points': newPoints, 'style': style },
            color: color,
            lineWidth: lineWidth,
            cornerP: cornerP,
            centerP: centerP,
            image: ''
        }
        return stroke
    }
}
