interface pointer {
    x: number;
    y: number;
}
interface Stroke {
    coordinates: pointer[];
    color: String;
    width: Number
    // style
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
    save: () => void;
    strokePointer: stroke_pointer;
    layerLength: Number;
}
interface canvasProp {
    canvasRef: React.RefObject<HTMLCanvasElement[]>;
    addStroke: (stroke: Stroke) => void;
    lastLayerIndex: number;
    undo: ()=>void;
    redo: ()=>void;
    save: ()=>void;
}
