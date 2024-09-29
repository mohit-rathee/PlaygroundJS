import { DrawingClass } from "../lib/DrawingClass";
import React from "react";
import { CanvasClass } from "../lib/CanvasClass";

export class EventClass {
    public canvasClass: CanvasClass;
    public drawing: React.RefObject<DrawingClass>;
    public deConstructor: () => void;
    public Constructor: () => void;

    constructor(
        canvasClass: CanvasClass,
        drawingClass: React.RefObject<DrawingClass>,
    ) {
        this.canvasClass = canvasClass
        this.drawing = drawingClass
        this.deConstructor = () => { }
        this.Constructor = () => { }
    }
    setOnTop(bool: boolean) {
        requestAnimationFrame(() => {
            if (bool) {
                this.canvasClass.pCanvas.style.zIndex = '100'
            } else {
                this.canvasClass.pCanvas.style.zIndex = '0'
            }
        })
    }
}
