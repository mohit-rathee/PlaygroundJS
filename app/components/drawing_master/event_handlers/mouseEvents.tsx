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
        selected: string
    ) {
        this.canvas = canvas
        this.mainCanvas = canvasClass
        this.drawing = drawingClass
        this.mode = selected
        this.timer = Date.now()
        switch (this.mode) {
            case 'draw':
                canvas.addEventListener('mousedown', this.startEvent)
                console.log('added startDrawing EventListener')
                break
            case 'select':
                canvas.addEventListener('mousedown', this.selectEvent)
                console.log('added select EventListener')
                break
        }


        // return () => {
        //     canvas.removeEventListener('mousedown', startDrawing)
        //     canvas.removeEventListener('mousedown', selectDrawing)
        // }
    }
    // handleMouseDown
    startEvent = (e: MouseEvent) => {
        console.log('start drawing')
        this.mainCanvas.setOnTop(true)
        const startingPoint = {
            x: e.clientX,
            y: e.clientY,
        };
        this.mainCanvas.clearCanvas()
        this.mainCanvas.start(startingPoint)
        this.mainCanvas.pCanvas.addEventListener('mousemove', this.drawEvent)
        this.mainCanvas.pCanvas.addEventListener('mouseup', this.stopEvent)
        this.timer = Date.now()
    }

    //function handleMouseMove
    drawEvent = (event: MouseEvent) => {
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
    stopEvent = () => {
        console.log('stop drawing')
        this.mainCanvas.setOnTop(false)
        this.mainCanvas.useRDP()
        const newStroke = this.mainCanvas.getStroke()
        newStroke.image = this.mainCanvas.getImageData()
        this.mainCanvas.clearCanvas()
        // const ctx = this.canvas.getContext('2d')
        // ctx?.clearRect(0,0,this.canvas.width,this.canvas.height)
        // TODO take a fuction from outside to do so
        this.drawing.current?.addStroke(newStroke)
        this.mainCanvas.pCanvas.removeEventListener('mousemove', this.drawEvent)
        this.mainCanvas.pCanvas.removeEventListener('mouseup', this.stopEvent)
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
        console.log('newCenterP', newCenterP)
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
        console.log('stroke:', stroke)
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
