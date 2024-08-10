import React, { useState, useRef, useEffect } from 'react';
import Canvas from './canvas'
const THRESHOLD_VALUE = 200

const initialStrokePointer: stroke_pointer = {
    layer: 0,
    stroke_id: 0
}

export default function Playground() {
    const canvasRef = useRef<HTMLCanvasElement[]>([]);
    const [strokePointer, setStrokePointer] = useState<stroke_pointer>(initialStrokePointer)
    const drawingState = useRef<DrawingState>([])
    const layerLength = useRef(0)

    function undo() {
    }
    function redo() {
    }
    function save() {
    }

    function add(stroke: Stroke) { // take image data as well
        console.log('add')
        console.log('current layer lenght',layerLength.current)
        console.log('stroke length',stroke.coordinates.length)
        const newLength = (layerLength.current + stroke.coordinates.length)
        const strokeList = drawingState.current

        // in undo state, it will override
        strokeList.length = strokePointer.stroke_id

        if (newLength >= THRESHOLD_VALUE) {
            console.log('adding new layer')
            console.log('setting length to ', stroke.coordinates.length)
            const len = stroke.coordinates.length
            // setLayerLength(len)
            layerLength.current=len
            const newLayer = strokePointer.layer + 1
            strokeList.push({
                ...stroke,
                id: strokePointer.stroke_id,
                layer: newLayer
            })
            setStrokePointer({
                layer: newLayer,
                stroke_id: strokePointer.stroke_id + 1
            })
        } else {
            const len= layerLength.current + stroke.coordinates.length
            console.log('setting length to ',len)
            layerLength.current=len
            // setLayerLength(len)
            const newLayer = strokePointer.layer
            strokeList.push({
                ...stroke,
                id: strokePointer.stroke_id,
                layer: newLayer
            })
            setStrokePointer({
                layer: newLayer,
                stroke_id: strokePointer.stroke_id + 1
            })
        }
    }
    useEffect(()=>{
    console.log('layerLength:',layerLength.current)
    console.log(drawingState)

    })
    return (
        <div className='w-full h-full flex-col bg-gray-200 gap-2 flex items-center justify-start'>
            <Canvas
                layerLength={layerLength.current}
                strokePointer={strokePointer}
                layerCount={strokePointer.layer}
                canvasRef={canvasRef}
                addStroke={add}
                undo={undo}
                redo={redo}
                save={save}
            />
        </div>
    )
}
