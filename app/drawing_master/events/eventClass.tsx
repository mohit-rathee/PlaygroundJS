import { DrawingClass } from "../lib/DrawingClass";
import React from "react";
import { CanvasClass } from "../lib/CanvasClass";
import { ToolRefs } from "../types";
import { Pencil } from "../lib/Strokes/Pencil";
import { Shapes } from "../lib/Strokes/Shapes";

export class EventClass {
    // public event: "select"|"drawPencil"|"drawPolygon"|"drawShapes"
    public canvasClass: CanvasClass;
    public drawing: React.RefObject<DrawingClass>;
    public lineColorRef: React.MutableRefObject<string>;
    public fillColorRef: React.MutableRefObject<string>;
    public isFillRef: React.MutableRefObject<boolean>;
    public lineWidthRef: React.MutableRefObject<number>;

    constructor(
        toolRefs: ToolRefs,
        // event: "select"|"drawPencil"|"drawPolygon"|"drawShapes"
    ) {
        this.canvasClass = toolRefs.mainCanvasClass
        this.drawing = toolRefs.drawingClass
        // this.event = event
        this.lineColorRef = toolRefs.lineColor
        this.lineWidthRef = toolRefs.lineWidth
        this.fillColorRef = toolRefs.fillColor
        this.isFillRef = toolRefs.isFill
    }
    Constructor() { }
    deConstructor() { }
    setOnTop(bool: boolean) {
        requestAnimationFrame(() => {
            if (bool) {
                this.canvasClass.pCanvas.style.zIndex = '100'
            } else {
                this.canvasClass.pCanvas.style.zIndex = '0'
            }
        })
    }

    createNewStroke(type: 'FreeForm' | 'CatmullRom' | 'Polygon'): Pencil
    createNewStroke(type: 'Rectangle' | 'Circle'): Shapes

    createNewStroke(type: Type) {
        let baseStroke: BaseType = {
            uid: NaN,
            lineColor: this.lineColorRef.current,
            lineWidth: this.lineWidthRef.current,
            fillColor: this.fillColorRef.current,
            isFill: this.isFillRef.current,
            cornerP: { x: 0, y: 0 },
            centerP: { x: 0, y: 0 },
        };
        console.log('isFill', this.isFillRef.current)
        if (
            type == "FreeForm" ||
            type == "CatmullRom" ||
            type == "Polygon"
        ) {
            return new Pencil(baseStroke, type, [])
        }
        else if (
            type == "Circle" ||
            type == "Rectangle"
        ) {
            return new Shapes(baseStroke, type)
        }
        else {
            throw new Error("Type not found")
        }
    }
}

