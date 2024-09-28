import { MainCanvasClass } from "../lib/MainCanvasClass";
import { DrawingClass } from "../lib/DrawingClass";
import React from "react";

const DELTA_TIME = 20
export class EventHandlerClass {
    public canvas: HTMLCanvasElement;
    public mainCanvas: MainCanvasClass;
    public drawing: React.RefObject<DrawingClass>;
    public mode: string;
    private timer: number;

    constructor(
        canvas: HTMLCanvasElement,
        canvasClass: MainCanvasClass,
        drawingClass: React.RefObject<DrawingClass>,
        // selected: string
    ) {
        this.canvas = canvas
        this.mainCanvas = canvasClass
        this.drawing = drawingClass
        this.mode = ''
        this.timer = Date.now()
        this.setMode('drawPencil')

    }
    setMode(mode: string) {
        console.log(this.mode)
        console.log(mode)
        if(this.mode == mode)return
        this.mode = mode
        switch (mode) {
            case 'drawPencil':
                this.canvas.addEventListener('mousedown', this.startPencilEvent)
                this.canvas.removeEventListener('mousedown', this.selectEvent)
                console.log('added startDrawing EventListener')
                break
            case 'select':
                this.canvas.addEventListener('mousedown', this.selectEvent)
                this.canvas.removeEventListener('mousedown', this.startPencilEvent)
                console.log('added select EventListener')
                break
        }
    }
    // handleMouseDown
    startPencilEvent = (e: MouseEvent) => {
        this.mainCanvas.setOnTop(true)
        const startingPoint = {
            x: e.clientX,
            y: e.clientY,
        };
        this.mainCanvas.clearCanvas()
        this.mainCanvas.start(startingPoint)
        this.mainCanvas.pCanvas.addEventListener('mousemove', this.drawPencilEvent)
        this.mainCanvas.pCanvas.addEventListener('mouseup', this.stopPencilEvent)
        this.timer = Date.now()
    }

    //function handleMouseMove
    drawPencilEvent = (event: MouseEvent) => {
        const now = Date.now()
        const threshold = this.timer + DELTA_TIME
        if (now < threshold) return
        const newPoint = {
            x: event.clientX,
            y: event.clientY,
        };
        if (this.mainCanvas.isThresholdTouched()) {
            this.mainCanvas.draw(newPoint)
            this.mainCanvas.useRDP()
            this.mainCanvas.redrawCurrentDrawing()
            this.mainCanvas.resetThreshold()
        } else {
            this.mainCanvas.draw(newPoint)
        }
        this.timer = now
    }

    // handleMouseUp
    stopPencilEvent = () => {
        this.mainCanvas.setOnTop(false)
        this.mainCanvas.useRDP()
        const newStroke = this.mainCanvas.getStroke()
        newStroke.image = this.mainCanvas.getImageData()
        this.mainCanvas.clearCanvas()
        // const ctx = this.canvas.getContext('2d')
        // ctx?.clearRect(0,0,this.canvas.width,this.canvas.height)
        // TODO take a fuction from outside to do so
        this.drawing.current?.addStroke(newStroke)
        this.mainCanvas.pCanvas.removeEventListener('mousemove', this.drawPencilEvent)
        this.mainCanvas.pCanvas.removeEventListener('mouseup', this.stopPencilEvent)
    }
    dragEvent = (e: MouseEvent) => {
        const pos: point = { 'x': e.clientX, 'y': e.clientY }
        this.mainCanvas.dragSelectedTo(pos)
    }
    placeEvent = (e: MouseEvent) => {
        const pos: point = { 'x': e.clientX, 'y': e.clientY }
        const layer = this.mainCanvas.selectedStrokeData.layer
        const stroke_id = this.mainCanvas.selectedStrokeData?.stroke_id
        const newCenterP = this.mainCanvas.getNewCenterP(pos)
        const imgData = this.mainCanvas.getImageData()
        this.drawing.current?.placeStrokeAt(layer, stroke_id, newCenterP, imgData)
        this.mainCanvas?.clearCanvas()
        this.mainCanvas?.pCanvas.removeEventListener('mousemove', this.dragEvent)
        this.mainCanvas?.pCanvas.removeEventListener('mousedown', this.placeEvent)
        this.mainCanvas?.pCanvas.addEventListener('mousedown', this.selectEvent)
    }
    selectEvent = (event: MouseEvent) => {
        this.mainCanvas?.clearCanvas()
        const point: point = { x: event.clientX, y: event.clientY }
        const stroke = this.drawing.current?.select(point)
        if (stroke) {
            this.mainCanvas?.setSelected(stroke.layer, stroke.stroke_id, stroke.stroke, event)
            // this.canvasClass?.drawSelectedStroke()
            this.dragEvent(event)
            this.mainCanvas?.pCanvas.addEventListener('mousemove', this.dragEvent)
            this.mainCanvas?.pCanvas.addEventListener('mousedown', this.placeEvent)
            this.mainCanvas?.pCanvas.removeEventListener('mousedown', this.selectEvent)
        }
    }
}
