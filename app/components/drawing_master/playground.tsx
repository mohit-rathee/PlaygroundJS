import React, { useEffect, useRef } from 'react';
import DrawingBoard from './drawingBoard'
import { DrawingState as DrawingBoardClass } from './utils/DrawingPanel';



export default function Playground() {
    const canvasContainerRef = useRef<HTMLDivElement | null>(null);
    const drawingBoardClass = useRef<DrawingBoardClass | null>(null)
    useEffect(() => {
        if (canvasContainerRef.current) { 
            const canvasContainer = canvasContainerRef.current
            drawingBoardClass.current = new DrawingBoardClass(canvasContainer)
        }
        else {
            throw Error("can't create canvas container")
        }
    }, [])


    return (
        <div className='w-full h-full flex-col bg-gray-200 gap-2 flex items-center justify-start'>
            <DrawingBoard
                canvasContainerRef={canvasContainerRef}
                DrawingBoardClassRef={drawingBoardClass}
            />
        </div>
    )
}
