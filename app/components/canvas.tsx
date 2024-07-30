"use client";
import React, { useRef, useState, useEffect } from "react";

function Canvas({ canvasRef, addStroke, lastLayerIndex }: canvasProp) {
    const [isDrawing, setIsDrawing] = useState<boolean>(false)
    const [currentStroke, setCurrentStroke] = useState<pointer[]>([])



    // handleMouseDown
    const startDrawing = (event: React.MouseEvent) => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current[canvasRef.current.length - 1]
        const rect = canvas?.getBoundingClientRect() || { left: 0, top: 0 };
        const startingPoint = {
            x: Number((event.clientX - rect.left).toFixed(2)),
            y: Number((event.clientY - rect.top).toFixed(2)),
        };
        setIsDrawing(true)
        setCurrentStroke([startingPoint])
        const context = canvas.getContext('2d')
        context?.beginPath()
        context?.moveTo(startingPoint.x, startingPoint.y);
    }

    //function handleMouseMove
    const draw = (event: React.MouseEvent) => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current[canvasRef.current.length - 1]
        const rect = canvas.getBoundingClientRect() || { left: 0, top: 0 };
        const newPoint = {
            x: Number((event.clientX - rect.left).toFixed(2)),
            y: Number((event.clientY - rect.top).toFixed(2)),
        };
        if (isDrawing) {
            const context = canvas.getContext('2d')
            context?.lineTo(newPoint.x, newPoint.y);
            context?.stroke();
            setCurrentStroke((currentStroke) => [...currentStroke, newPoint])
        }
    }

    // handleMouseUp
    const stopDrawing = (event: React.MouseEvent) => {
        if (!canvasRef.current) return;
        setIsDrawing(false)
        const canvas = canvasRef.current[canvasRef.current.length - 1]
        const rect = canvas.getBoundingClientRect() || { left: 0, top: 0 };
        const stopingPoint = {
            x: Number((event.clientX - rect.left).toFixed(2)),
            y: Number((event.clientY - rect.top).toFixed(2)),
        };
        const context = canvas.getContext('2d')
        context?.moveTo(stopingPoint.x, stopingPoint.y)
        context?.stroke()
        context?.closePath();
        const newStroke: Stroke = {
            coordinates: [...currentStroke, stopingPoint],
        }
        addStroke(newStroke);
    }
    return (
        <LayerStack
            startDrawing={startDrawing}
            draw={draw}
            stopDrawing={stopDrawing}
            canvasRef={canvasRef}
            lastLayerIndex={lastLayerIndex}
        />
    )
}

const LayerStack = ({ startDrawing, draw, stopDrawing, canvasRef, lastLayerIndex }: any) => {
    const layers_canvas = Array.from(
        { length: lastLayerIndex + 1 },
        (_, index) => index
    );
    return (
        <div className="relative w-4/5 bg-white rounded-sm border-2 border-red-300" >
            {layers_canvas.map((index: number) => {
                if (index != lastLayerIndex) {
                    return (
                        <canvas className='absolute rounded-sm border-2 border-red-300'
                            ref={(el) => { canvasRef.current[index] = el }}
                            key={index}
                            width={947}
                            height={550}
                            style={{
                                background: 'transparent',
                            }}
                        />)
                } else {
                    return (
                        <canvas className='relative rounded-sm border-2 border-red-300'
                            ref={(el) => { canvasRef.current[lastLayerIndex] = el }}
                            key={lastLayerIndex}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            //TODO make it react to resizes
                            width={947}
                            height={550}
                            style={{
                                background: 'transparent',
                            }}
                        />)
                }
            })}
        </div>
    )
}

export default Canvas
