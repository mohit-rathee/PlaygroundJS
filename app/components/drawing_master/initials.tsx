export const initialStrokePointer: StrokePointer = {
    layer: 1,
    stroke_id: 0
}

export const initialLayer: Layer = {
    strokes: [],
    length: 0
}

export const initialStroke: Stroke = {
    "uid": NaN,
    "coordinates": [],
    "color": '',
    "lineWidth": NaN,
}

export const initialDrawingState: Drawing = [initialLayer]

export const THRESHOLD_VALUE = 100

export const color_choices = [
    'darkred',
    'darkblue',
    'gray',
    'darkgreen',
    'purple',
    'teal',
];
