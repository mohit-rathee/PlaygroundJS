import React, { useEffect, useRef, useState } from 'react';
import DrawingBoard from './drawingBoard'
import { DrawingClass } from './utils/DrawingClass';



export default function Playground() {
    const canvasContainerRef = useRef<HTMLDivElement | null>(null);
    const refCanvasContainerRef = useRef<HTMLDivElement | null>(null);
    const drawingClass = useRef<DrawingClass | null>(null)
    const [isDebugMode, _setDebugMode] = useState(false);
    const [dimensions, setDimensions] = useState({
        'width': 0,
        'height': 0,
    })

    useEffect(() => {
        console.log(canvasContainerRef.current)
        console.log(refCanvasContainerRef.current)
        if (canvasContainerRef.current && refCanvasContainerRef.current) { 
            const canvasContainer = canvasContainerRef.current
            const refCanvasContainer = refCanvasContainerRef.current
            const dimensions = {
                'width': window.innerWidth,
                'height': window.innerHeight
            }
            if (isDebugMode){
                dimensions.width = dimensions.width/2
            }
            console.log(dimensions)
            setDimensions(dimensions)
            drawingClass.current = new DrawingClass(canvasContainer, refCanvasContainer, dimensions,isDebugMode)
        }
        else {
            throw new Error("can't create canvas container")
        }
    }, [])


    return (
        <div className='w-full h-full flex-col bg-gray-200 gap-2 flex items-center justify-start'>
            <DrawingBoard
                canvasContainerRef={canvasContainerRef}
                refCanvasContainerRef={refCanvasContainerRef}
                DrawingBoardClassRef={drawingClass}
                dimensions = {dimensions}
            />
        </div>
    )
}
