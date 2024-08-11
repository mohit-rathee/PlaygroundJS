import React, { useRef } from 'react';
import DrawingBoard from './drawingBoard'
import { initialDrawingState, initialStrokePointer } from './initials';
import useOperations from './operationHook';
import { save } from './drawing_utils';



export default function Playground() {
    const canvasRef = useRef<HTMLCanvasElement[]>([]);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const strokePointerRef = useRef<stroke_pointer>(initialStrokePointer)
    const drawingState = useRef<DrawingState>(initialDrawingState)



    const { add, undo, redo } = useOperations(
        canvasRef,
        canvasContainerRef,
        strokePointerRef,
        drawingState
    )
    const currentLayer = drawingState.current[strokePointerRef.current.layer-1]
    return (
        <div className='w-full h-full flex-col bg-gray-200 gap-2 flex items-center justify-start'>
            <DrawingBoard
                layerLength={currentLayer}
                strokePointer={strokePointerRef}
                canvasRef={canvasRef}
                canvasContainerRef={canvasContainerRef}
                add={add}
                undo={undo}
                redo={redo}
                save={()=>save(canvasRef)}
            />
        </div>
    )
}
