import { DrawingClass } from "../lib/DrawingClass";
import React from "react";
import { CanvasClass } from "../lib/CanvasClass";
import { ToolRefs } from "../types";

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
    Constructor(){}
    deConstructor(){}
    setOnTop(bool: boolean) {
        requestAnimationFrame(() => {
            if (bool) {
                this.canvasClass.pCanvas.style.zIndex = '100'
            } else {
                this.canvasClass.pCanvas.style.zIndex = '0'
            }
        })
    }

    createNewStroke(type: 'FreeForm' | 'CatmullRom'): FreeForm | CatmullRom;
    createNewStroke(type: 'Polygon'): Polygon;
    createNewStroke(type: 'Rectangle' | 'Circle'): Rectangle | Circle;

    createNewStroke(type: Type): Stroke {
        let baseStroke: BaseStroke = {
            uid: NaN,
            lineColor: this.lineColorRef.current,
            lineWidth: this.lineWidthRef.current,
            fillColor: this.fillColorRef.current,
            isFill: this.isFillRef.current,
            cornerP: { x: 0, y: 0 },
            centerP: { x: 0, y: 0 },
        };
        console.log('isFill', this.isFillRef.current)
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
                    width: 0,
                    height: 0
                }
            default: {
                throw new Error("Type not found")
            }
        }
    }

}
