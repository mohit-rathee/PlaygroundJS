type Dimensions = { 'width': number, 'height': number }

interface point {
    x: number;
    y: number;
}

type Type = "FreeForm" | "CatmullRom" | "Polygon" | "Rectangle" | "Circle";

type Stroke = FreeForm | CatmullRom | Polygon | Rectangle | Circle

interface BaseStroke {
    uid: number;
    lineColor: string;
    lineWidth: number;
    fillColor: string;
    isFill: boolean;
    cornerP: point;
    centerP: point;
}

interface FreeForm extends BaseStroke {
    type: "FreeForm"
    points: point[];
}
interface CatmullRom extends BaseStroke {
    type: "CatmullRom"
    points: point[];
}
interface Polygon extends BaseStroke {
    type: "Polygon"
    points: point[];
}
interface Rectangle extends BaseStroke {
    type: "Rectangle"
    width: number;
    height: number;
}
interface Circle extends BaseStroke {
    type: "Circle"
    radius: number;
}


interface Layer {
    strokes: Stroke[];
    length: number;
}

interface StrokePointer {
    layer: number; // current layer index
    stroke_id: number; // no of strokes to draw
}

type DrawingVerse = Layer[];

interface boardprop {
    undo: () => void;
    redo: () => void;
    save: () => void;
    strokepointer: Strokepointer;
    layerLength: Number;
}
interface canvasprop {
    canvasRef: React.RefObject<HTMLCanvasElement[]>;
    addStroke: (stroke: Stroke) => void;
    layerCount: number;
    undo: () => void;
    redo: () => void;
    save: () => void;
}

type canvas_ref = React.RefObject<HTMLCanvasElement[]>;
