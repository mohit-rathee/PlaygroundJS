interface point {
    x: number;
    y: number;
}
interface Stroke {
    id: Number;
    layer: number;
    coordinates: point[];
    color: String;
    width: number;
    // style
    // width ...etc
};
interface Layer {
    strokes: Stroke[];
    length: number;
}

interface StrokePointer {
    layer: number; // current layer index
    stroke_id: number; // no of strokes to draw
}
type Drawing = Layer[];

interface boardProp {
    undo: () => void;
    redo: () => void;
    save: () => void;
    strokePointer: StrokePointer;
    layerLength: Number;
}
interface canvasProp {
    canvasRef: React.RefObject<HTMLCanvasElement[]>;
    addStroke: (stroke: Stroke) => void;
    layerCount: number;
    undo: () => void;
    redo: () => void;
    save: () => void;
}
type canvas_ref = React.RefObject<HTMLCanvasElement[]>;
