import React, { useRef, useEffect } from 'react';
import Canvas from './canvas'
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

    function undo() {
    }
    function redo() {
    }
    function save() {
    }

    function add(stroke: Stroke, imgData:string) {
        console.log('add')
        const layerStack = drawingState.current
        const strokePointer = strokePointerRef.current
        const newLength = (layerLength.current + stroke.coordinates.length)
        // Override layer in undo state
        layerStack.length = strokePointer.layer

        if (newLength >= THRESHOLD_VALUE) {
            // Override last layer strokes
            layerStack[layerStack.length - 1].strokes.length = strokePointer.stroke_id


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
            console.log("container",canvasContainerRef.current)
            const newCanvas = document.createElement('canvas')
            newCanvas.className = 'fixed top-0 left-0 w-screen h-screen';
            newCanvas.width = window.innerWidth;
            newCanvas.height = window.innerHeight;
            newCanvas.style.background = 'transparent';
            const context = newCanvas.getContext('2d')
            canvasContainerRef.current?.appendChild(newCanvas)
            canvasRef.current.push(newCanvas)
            const img = new Image()
            img.src = imgData
            img.onload = ()=>{
                context?.drawImage(img, 0, 0);
            }
        } else {
            //OVERRIDE
            layerStack[layerStack.length - 1].strokes.length = strokePointer.stroke_id

            // SET STROKE POINTER
            strokePointer.stroke_id = strokePointer.stroke_id + 1

            // PUSH
            layerStack[layerStack.length - 1].strokes.push(stroke)
            layerStack[layerStack.length - 1].length = newLength

            // SET LAYER LENGTH
            layerLength.current = newLength

            // Add
            const canvas = canvasRef.current[canvasRef.current.length-1]
            const context = canvas.getContext('2d')
            const img = new Image()
            img.src = imgData
            img.onload = ()=>{
                context?.drawImage(img, 0, 0);
            }
        }
        console.log('layerLength:', layerLength.current)
        console.log('drawingState', layerStack)
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
