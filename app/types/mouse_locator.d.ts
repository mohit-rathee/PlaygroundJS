interface point {
    x: number;
    y: number;
}
interface Pencil {
    points: point[];
    style: string;
}
interface Stroke {
    uid: number;
    type: string;
    data: Pencil;
    image: string;
    color: string;
    lineWidth: number;
    maxP:point;
    minP:point;
    centerP:point;
    // style
    // width ...etc
};
interface Layer {
    strokes: Stroke[];
    length: number;
}
type Dimensions = {'width':number,'height':number}

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
