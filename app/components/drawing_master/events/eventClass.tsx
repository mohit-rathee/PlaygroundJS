import { DrawingClass } from "../lib/DrawingClass";
import React from "react";
import { CanvasClass } from "../lib/CanvasClass";

// Function overloads

export class EventClass {
    public canvasClass: CanvasClass;
    public drawing: React.RefObject<DrawingClass>;
    public deConstructor: () => void;
    public Constructor: () => void;
    private colorRef: React.MutableRefObject<string>;
    private lineWidthRef: React.MutableRefObject<number>;

    createNewStroke(type: 'FreeForm' | 'CatmullRom'): FreeForm | CatmullRom;
    createNewStroke(type: 'Polygon'): Polygon;
    createNewStroke(type: 'Rectangle' | 'Circle'): Rectangle | Circle;

    createNewStroke(type: Type): Stroke {
        let baseStroke: BaseStroke = {
            uid: NaN,
            color: this.colorRef.current,
            lineWidth: this.lineWidthRef.current,
            cornerP: { x: 0, y: 0 },
            centerP: { x: 0, y: 0 },
        };
        switch (type) {
            case "FreeForm":
                return {
                    ...baseStroke,
                    type: type,
                    points: [],
                }
            case "CatmullRom":
                return {
                    ...baseStroke,
                    type: type,
                    points: [],
                }
            case "Polygon":
                return {
                    ...baseStroke,
                    type: type,
                    points: []
                }
            case "Circle":
                return {
                    ...baseStroke,
                    type: type,
                    radius: 0
                }
            case "Rectangle":
                return {
                    ...baseStroke,
                    type: type,
                    points: [
                        { x: 0, y: 0 },
                        { x: 0, y: 0 },
                        { x: 0, y: 0 },
                        { x: 0, y: 0 },
                        { x: 0, y: 0 },
                    ]
                }
            default: {
                throw new Error("Type not found")
            }
        }
    }

    constructor(
        canvasClass: CanvasClass,
        drawingClass: React.RefObject<DrawingClass>,
        colorRef: React.MutableRefObject<string>,
        lineWidthRef: React.MutableRefObject<number>,
    ) {
        this.canvasClass = canvasClass
        this.drawing = drawingClass
        this.colorRef = colorRef
        this.lineWidthRef = lineWidthRef
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
