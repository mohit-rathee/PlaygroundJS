export const LAYER_THRESHOLD = 100

export const IS_DEBUG_MODE = false

export const COLOR_MAP_GAP = IS_DEBUG_MODE?100000:1

export const IS_DRAW_DOTS = IS_DEBUG_MODE?true:false

export const RDP_NORMAL = 2;

export const RDP_CATMULLROM = 2;

export const MIN_DISTANCE_BTW_PTS= 10;


export const CATMULL_ROM_PRECISION = 0.01

export const REFINE_THRESHOLD = 10

export const DELTA_TIME = 20

export const initialStrokePointer: StrokePointer = {
    layer: 1,
    stroke_id: 0
}

export const initialLayer: Layer = {
    strokes: [],
    length: 0
}

export const initialDrawingState: DrawingVerse = [initialLayer]

