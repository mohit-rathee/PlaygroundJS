export const LAYER_THRESHOLD = 100

export const IS_DEBUG_MODE = false

let color_map_gap = 1;

let is_draw_dots = false

if(IS_DEBUG_MODE){
     color_map_gap = 100000
     is_draw_dots = true

}
export const COLOR_MAP_GAP = color_map_gap

export const IS_DRAW_DOTS = is_draw_dots

export const RDP_NORMAL = 3;

export const RDP_CATMULLROM = 6;

export const MIN_DISTANCE_BTW_PTS= 10;


export const CATMULL_ROM_PRECISION = 0.01

export const REFINE_THRESHOLD = 20

export const DELTA_TIME = 20



export const COLOR_CHOISES = [
    'darkred',
    'darkblue',
    'gray',
    'darkgreen',
    'purple',
    'teal',
];
export const initialStrokePointer: StrokePointer = {
    layer: 1,
    stroke_id: 0
}

export const initialLayer: Layer = {
    strokes: [],
    length: 0
}

export const initialDrawingState: Drawing = [initialLayer]

