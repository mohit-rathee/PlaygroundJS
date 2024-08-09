"use client";
import React, { useEffect, useState } from "react";
import SidePallete from "./side_pallete";

function Canvas({ canvasRef, addStroke, lastLayerIndex, undo, redo, save }: canvasProp) {
    const [isDrawing, setIsDrawing] = useState<boolean>(false)
    const [currentStroke, setCurrentStroke] = useState<pointer[]>([])
    const [color, setColor] = useState<String>('gray')
    const [lineWidth, setLineWidth] = useState<Number>(5);



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
        if (!context) return;
        context.beginPath()
        context.moveTo(startingPoint.x, startingPoint.y);
        context.strokeStyle = color.toString();
        context.lineWidth = lineWidth.valueOf()
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
            color: color,
            width: lineWidth,
            coordinates: [...currentStroke, stopingPoint],
        }
        addStroke(newStroke);
    }
    return (
        <div className="w-full p-2 h-full px-2 flex gap-5 bg-gray-500">
            <SidePallete
                onColorSelect={setColor}
                setLineWidth={setLineWidth}
                lineWidth={lineWidth}
                undo={undo}
                redo={redo}
                save={save}
            />
            <LayerStack
                startDrawing={startDrawing}
                draw={draw}
                stopDrawing={stopDrawing}
                canvasRef={canvasRef}
                lastLayerIndex={lastLayerIndex}
            />
        </div>
    )
}

const LayerStack = ({ startDrawing, draw, stopDrawing, canvasRef, lastLayerIndex }: any) => {
    const layers_canvas = Array.from(
        { length: lastLayerIndex + 1 },
        (_, index) => index
    );
    const [dimensions, setDimensions] = useState({
        'width': 0,
        'height': 0,
    })
    useEffect(() => {
        // const handleResize = () => {
        // const dimensions = {
        //         width: window.innerWidth,
        //         height: window.innerHeight
        //     }
        //     // TODO redraw all layers again
        //     Array.from(canvasRef.current).forEach((canvas:any) => {
        //         canvas.width = dimensions.width
        //         canvas.height = dimensions.height
        //
        //     })
        //     setDimensions(dimensions);
        //     console.log('dimensions changed')
        // };
        //
        // handleResize(); // Initial size set
        // window.addEventListener('resize', handleResize);
        //
        // return () => window.removeEventListener('resize', handleResize);

        const dimensions = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        setDimensions(dimensions)
    }, []);

    return (
        <div >
            {layers_canvas.map((index: number) => {
                if (index != lastLayerIndex) {
                    return (
                        <canvas className='fixed top-0 z-0 left-0 w-screen h-screen'
                            ref={(el) => { canvasRef.current[index] = el }}
                            key={index}
                            width={dimensions.width}
                            height={dimensions.height}
                            style={{
                                background: 'transparent',
                            }}
                        />)
                } else {
                    return (
                        <canvas className='fixed top-0 z-0 left-0 w-screen h-screen'
                            ref={(el) => { canvasRef.current[lastLayerIndex] = el }}
                            key={lastLayerIndex}
                            width={dimensions.width}
                            height={dimensions.height}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            //TODO make it react to resizes
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
