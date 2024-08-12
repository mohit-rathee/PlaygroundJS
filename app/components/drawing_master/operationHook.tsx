import React from "react";
import { redrawLayer, hideLayer, showLayer, clearLayer, draw_by_image, draw_by_points } from './drawing_utils';
import { THRESHOLD_VALUE } from "./initials";

export default function useOperations(
    canvasRef: React.RefObject<HTMLCanvasElement[]>,
    canvasContainerRef: React.RefObject<HTMLDivElement>,
    strokePointerRef: React.RefObject<stroke_pointer>,
    drawingState: React.RefObject<DrawingState>,
) {
    function add(stroke: Stroke, imgData: string) {
        if (
            !canvasRef.current ||
            !canvasContainerRef.current ||
            !strokePointerRef.current ||
            !drawingState.current
        ) return;

        console.log('add')
        const strokePointer = strokePointerRef.current
        const layerStack = drawingState.current
        const layerLength = layerStack[strokePointer.layer - 1].length


        const newLength = (layerLength + stroke.coordinates.length)
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
            console.log('layerLength:', stroke.coordinates.length)

            // Add
            if (canvasRef.current.length < strokePointer.layer) {
                const newCanvas = document.createElement('canvas')
                newCanvas.className = 'fixed top-0 left-0 w-screen h-screen';
                newCanvas.width = window.innerWidth;
                newCanvas.height = window.innerHeight;
                newCanvas.style.background = 'transparent';
                canvasContainerRef.current?.appendChild(newCanvas)
                canvasRef.current.push(newCanvas)
            }else{
                // const canvas_no = strokePointer.layer - 1
                clearLayer(canvasRef,strokePointer.layer - 1)
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

            const canvas_no = strokePointer.layer - 1

            if(strokePointer.stroke_id == 1){
                clearLayer(canvasRef,canvas_no)
            }

            // Add
            draw_by_image(canvasRef, canvas_no, imgData)
            console.log('layerLength:', newLength)
        }
        console.log('drawingState', layerStack)
        console.log('strokePointer', strokePointer)
    }
    function undo() {
        if (
            !canvasRef.current ||
            !canvasContainerRef.current ||
            !strokePointerRef.current ||
            !drawingState.current
        ) return;

        console.log('undo')
        const strokePointer = strokePointerRef.current
        const layerStack = drawingState.current
        const layerLength = layerStack[strokePointer.layer - 1].length

        const prevStroke = strokePointer.stroke_id - 1;

        const currentLayerIndex = strokePointer.layer - 1
        const prevLayerIndex = currentLayerIndex - 1

        if (prevStroke < 0) {
            // Already at oldest change
            if (prevLayerIndex < 0) {
                console.log('oldest change')
                return
            }
            const prevLayer = layerStack[prevLayerIndex]
            const lastStroke = prevLayer.strokes[prevLayer.strokes.length - 1]
            const lastStrokeLength = lastStroke.coordinates.length

            // layer length upto last 2nd stroke
            prevLayer.length = prevLayer.length - lastStrokeLength

            strokePointer.layer = prevLayerIndex + 1
            strokePointer.stroke_id = prevLayer.strokes.length - 1
            console.log('layerLength:', prevLayer.length)
        } else {
            // undo current layer
            const currentLayer = layerStack[currentLayerIndex]
            strokePointer.stroke_id = prevStroke
            const layer = layerStack[strokePointer.layer - 1]
            const currentStrokeLength = layer.strokes[prevStroke].coordinates.length
            currentLayer.length = layerLength - currentStrokeLength
            console.log('layerLength:', currentLayer.length)
        }
        // redraw
        const layer_no = strokePointer.layer - 1
        const stroke_id = strokePointer.stroke_id
        const layerData = layerStack[layer_no]
        if (stroke_id == 0) {
            hideLayer(canvasRef, layer_no)
        } else {
            redrawLayer(canvasRef, layer_no, 0, stroke_id, layerData)
        }
        // debug
        console.log('drawingState', layerStack)
        console.log('strokePointer', strokePointer)
        return
    }
    function redo() {
        if (
            !canvasRef.current ||
            !canvasContainerRef.current ||
            !strokePointerRef.current ||
            !drawingState.current
        ) return;
        console.log('redo')
        const strokePointer = strokePointerRef.current
        const layerStack = drawingState.current

        const nextStroke = strokePointer.stroke_id + 1
        const maxStroke = layerStack[strokePointer.layer - 1].strokes.length

        const maxLayer = layerStack.length
        const currentLayerIndex = strokePointer.layer - 1
        const nextLayerIndex = currentLayerIndex + 1

        // redo next layer
        if (nextStroke > maxStroke) {
            // Already at newest change
            if (nextLayerIndex == maxLayer) {
                console.log('newest change')
                return
            }
            strokePointer.layer = nextLayerIndex + 1
            strokePointer.stroke_id = 1
            const nextLayer = layerStack[nextLayerIndex]
            // layerlength will be next layers first stroke length
            nextLayer.length = nextLayer.strokes[0].coordinates.length
            console.log('layerLength:', nextLayer.length)
        } else {
            // redo current layer
            strokePointer.stroke_id = nextStroke
            const nextStrokeLength = layerStack[currentLayerIndex].strokes[nextStroke - 1].coordinates.length
            const currentLayer = layerStack[currentLayerIndex]
            // add length of next stroke in layerLength
            const layerLength = layerStack[currentLayerIndex].length
            currentLayer.length = layerLength + nextStrokeLength
            console.log('redo in same layer')
            console.log('layerLength:', currentLayer.length)
        }

        // draw latest stroke
        const canvas_no = strokePointer.layer - 1
        if (strokePointer.stroke_id == 1) {
            showLayer(canvasRef,canvas_no)
        } else {
            const stroke = layerStack[canvas_no].strokes[strokePointer.stroke_id - 1]
            draw_by_points(canvasRef, canvas_no, stroke)
        }
        //debug
        console.log('drawingState', layerStack)
        console.log('strokePointer', strokePointer)
    }
    return { add, undo, redo }
}
