import React, { useRef, useState } from 'react';
import Canvas from './canvas'
import { redrawLayer, draw_by_image, draw_by_points } from './drawing_utils';
const THRESHOLD_VALUE = 200

const initialStrokePointer: stroke_pointer = {
    layer: 1,
    stroke_id: 0
}
const initialLayer: Layer = { strokes: [], length: 0 }
const initialDrawingState: DrawingState = [initialLayer]

export default function Playground() {
    const canvasRef = useRef<HTMLCanvasElement[]>([]);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const strokePointerRef = useRef<stroke_pointer>(initialStrokePointer)
    const drawingState = useRef<DrawingState>(initialDrawingState)
    const layerLength = useRef(0)
    const [state, updateState] = useState<number>(0)

    function undo() {
        console.log('undo')
        const strokePointer = strokePointerRef.current
        const layerStack = drawingState.current

        const prevStroke = strokePointer.stroke_id - 1;
        if (prevStroke < 0) {
            const currentLayerIndex = strokePointer.layer - 1
            const prevLayerIndex = currentLayerIndex - 1
            // Already at oldest change
            if (prevLayerIndex < 0) {
                console.log('oldest change')
                return
            }
            const prevLayer = layerStack[prevLayerIndex]
            const lastStroke = prevLayer.strokes[prevLayer.strokes.length - 1]
            const lastStrokeLength = lastStroke.coordinates.length
            // layer length for 2nd last stroke
            layerLength.current = prevLayer.length - lastStrokeLength
            strokePointer.layer = prevLayerIndex + 1
            strokePointer.stroke_id = prevLayer.strokes.length - 1
        } else {
            // undo current layer
            strokePointer.stroke_id = prevStroke
            const layer = layerStack[strokePointer.layer - 1]
            const currentStrokeLength = layer.strokes[prevStroke].coordinates.length
            layerLength.current = layerLength.current - currentStrokeLength
        }
        // redraw
        const layer_no = strokePointer.layer - 1
        const stroke_id = strokePointer.stroke_id
        const layerData = layerStack[layer_no]
        redrawLayer(canvasRef, layer_no, 0, stroke_id, layerData)
        // debug
        updateState(state + 1)
        console.log('layerLength:', layerLength.current)
        console.log('drawingState', layerStack)
        console.log('strokePointer', strokePointer)
        return
    }
    function redo() {
        console.log('redo')
        const strokePointer = strokePointerRef.current
        const layerStack = drawingState.current

        const nextStroke = strokePointer.stroke_id + 1
        const maxStroke = layerStack[strokePointer.layer-1].strokes.length
        // redo next layer
        if (nextStroke > maxStroke) {
            const maxLayer = layerStack.length
            const nextLayer = strokePointer.layer + 1
            // Already at newest change
            if ( nextLayer > maxLayer) {
                console.log('newest change')
                return
            }
            strokePointer.layer = nextLayer
            strokePointer.stroke_id = 1
            layerLength.current = layerStack[nextLayer-1].strokes[0].coordinates.length
        } else {
            // redo current layer
            strokePointer.stroke_id = nextStroke
            const nextStrokeLength = layerStack[strokePointer.layer-1].strokes[nextStroke-1].coordinates.length
            layerLength.current = layerLength.current + nextStrokeLength
        }

        // draw latest stroke
        const canvas_no = strokePointer.layer - 1
        const stroke = layerStack[canvas_no].strokes[strokePointer.stroke_id-1]
        draw_by_points(canvasRef,canvas_no,stroke)

        //debug
        updateState(state+1)
        console.log('layerLength:', layerLength.current)
        console.log('drawingState', layerStack)
        console.log('strokePointer', strokePointer)
    }
    function save() {
    }

    function add(stroke: Stroke, imgData: string) {
        console.log('add')
        const layerStack = drawingState.current
        const strokePointer = strokePointerRef.current
        const newLength = (layerLength.current + stroke.coordinates.length)
        // Override layer in undo state

        if (strokePointer.stroke_id != 0 && newLength >= THRESHOLD_VALUE) {
            // Override last layer strokes
            layerStack.length = strokePointer.layer
            layerStack[strokePointer.layer - 1].strokes.length = strokePointer.stroke_id


            // SET STROKE POINTER
            strokePointer.layer = strokePointer.layer + 1
            strokePointer.stroke_id = 1
            // later help to derive unique color
            // for color mapping for this layer

            // PUSH NEXT LAYER
            const nextLayer: Layer = {
                length: stroke.coordinates.length,
                strokes: [stroke]
            }
            layerStack.push(nextLayer)

            // SET LAYER LENGTH
            layerLength.current = stroke.coordinates.length

            // Add
            if (canvasRef.current.length < strokePointer.layer) {
                const newCanvas = document.createElement('canvas')
                newCanvas.className = 'fixed top-0 left-0 w-screen h-screen';
                newCanvas.width = window.innerWidth;
                newCanvas.height = window.innerHeight;
                newCanvas.style.background = 'transparent';
                canvasContainerRef.current?.appendChild(newCanvas)
                canvasRef.current.push(newCanvas)
            }
            const canvas_no = strokePointer.layer - 1
            draw_by_image(canvasRef, canvas_no, imgData)
        } else {
            //OVERRIDE
            layerStack.length = strokePointer.layer
            layerStack[layerStack.length - 1].strokes.length = strokePointer.stroke_id

            // SET STROKE POINTER
            strokePointer.stroke_id = strokePointer.stroke_id + 1

            // PUSH
            layerStack[layerStack.length - 1].strokes.push(stroke)
            layerStack[layerStack.length - 1].length = newLength

            // SET LAYER LENGTH
            layerLength.current = newLength

            // Add
            const canvas_no = strokePointer.layer - 1
            draw_by_image(canvasRef, canvas_no, imgData)
        }
        console.log('layerLength:', layerLength.current)
        console.log('drawingState', layerStack)
        console.log('strokePointer', strokePointer)
    }
    return (
        <div className='w-full h-full flex-col bg-gray-200 gap-2 flex items-center justify-start'>
            <Canvas
                layerLength={layerLength}
                strokePointer={strokePointerRef}
                canvasRef={canvasRef}
                canvasContainerRef={canvasContainerRef}
                add={add}
                undo={undo}
                redo={redo}
                save={save}
            />
        </div>
    )
}
