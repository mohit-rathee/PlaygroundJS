import { DrawingClass } from "../lib/DrawingClass";
import React from "react";
import { CanvasClass } from "../lib/CanvasClass";
import { ToolRequirements } from "../components/drawingBoard";

export class EventClass {
    public canvasClass: CanvasClass;
    public drawing: DrawingClass;

    public deConstructor: () => void;
    public Constructor: () => void;

    private lineColorRef: React.MutableRefObject<string>;
    private isFillRef: React.MutableRefObject<boolean>;
    private fillColorRef: React.MutableRefObject<string>;
    private lineWidthRef: React.MutableRefObject<number>;

    constructor(
        args:ToolRequirements
    ) {
        this.canvasClass = args.mainCanvasClass
        this.drawing = args.drawingClass

        this.lineColorRef = args.lineColor
        this.fillColorRef = args.fillColor
        this.lineWidthRef = args.lineWidth
        this.isFillRef = args.isFill

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

    createNewStroke(type: 'FreeForm' | 'CatmullRom'): FreeForm | CatmullRom;
    createNewStroke(type: 'Polygon'): Polygon;
    createNewStroke(type: 'Rectangle' | 'Circle'): Rectangle | Circle;

    createNewStroke(type: Type): Stroke {
        let baseStroke: BaseStroke = {
            uid: NaN,
            isFill: false,
            fillColor: this.lineColorRef.current,
            lineColor: this.lineColorRef.current,
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

}
