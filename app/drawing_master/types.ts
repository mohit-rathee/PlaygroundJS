import { DrawPencilEventClass } from "./events/pencilEvents";
import { DrawPolygonEventClass } from "./events/polygonEvents";
import { SelectEventClass } from "./events/selectEvents";
import { DrawShapeEventClass } from "./events/shapeEvents";
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

export interface DrawPencilEventType {
    event: "drawPencil";
    eventClass: DrawPencilEventClass
}
export interface DrawPolygonEventType {
    event: "drawPolygon";
    eventClass: DrawPolygonEventClass
}
export interface DrawShapesEventType {
    event: "drawShapes";
    eventClass: DrawShapeEventClass
}
export interface SelectEventType {
    event: "select";
    eventClass: SelectEventClass
}
export type EventClassType = SelectEventType | DrawPencilEventType | DrawPolygonEventType | DrawShapesEventType
