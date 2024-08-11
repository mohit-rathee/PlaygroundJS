interface point {
    x: number;
    y: number;
}
interface Stroke {
    id: Number;
    layer: Number;
    coordinates: point[];
    color: String;
    width: Number;
    // style
    // width ...etc
};

interface Layer {
    strokes: Stroke[];
    length: number;
}

interface stroke_pointer {
    layer: number; // current layer index
    stroke_id: number; // no of strokes to draw
}
type DrawingState = Layer[];

interface boardProp {
    undo: () => void;
    redo: () => void;
    save: () => void;
    strokePointer: stroke_pointer;
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
