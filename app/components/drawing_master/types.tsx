import { CanvasClass } from "./lib/CanvasClass";
import { DrawingClass } from "./lib/DrawingClass";

export interface ToolRefs {
    mainCanvasClass: CanvasClass;
    drawingClass: React.MutableRefObject<DrawingClass | null>;
    lineColor: React.MutableRefObject<string>;
    fillColor: React.MutableRefObject<string>;
    lineWidth: React.MutableRefObject<number>;
    isFill: React.MutableRefObject<boolean>;
}
