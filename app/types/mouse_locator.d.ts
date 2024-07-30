interface pointer {
    x: number;
    y: number;
}
interface Stroke {
    coordinates: pointer[];
    // style
    // color
    // width ...etc
};
interface Layer {
    strokes: Stroke[];
    length: number;
}

interface stroke_pointer {
    layer: number; // current layer index
    stroke: number; // no of strokes to draw
}
type DrawingState = Layer[];

interface boardProp {
    undo: () => void;
    redo: () => void;
}
interface canvasProp {
    canvasRef: React.RefObject<HTMLCanvasElement[]>;
    addStroke: (stroke: Stroke) => void;
    lastLayerIndex: number;
}
