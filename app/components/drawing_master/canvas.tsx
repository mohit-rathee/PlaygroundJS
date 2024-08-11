"use client";
import React, { useEffect, useRef, useState } from "react";
import SidePallete from "./side_pallete";

function Canvas({ layerLength, strokePointer, canvasRef, canvasContainerRef, add, undo, redo, save }: any) {
    // const [currentStroke,setCurrentStroke] = useState<point[]>([])
    const currentStroke = useRef<point[]>([])

    const [color, setColor] = useState<String>('gray')
    const [lineWidth, setLineWidth] = useState<Number>(5);

    const colorRef = useRef<String>('gray')
    const lineWidthRef = useRef<Number>(5)
    const mainCanvasRef = useRef<HTMLCanvasElement>(null)

    //function handleMouseMove
    const draw = (event: MouseEvent) => {
        if (!mainCanvasRef.current) return;
        const canvas = mainCanvasRef.current
        const newPoint = {
            x: event.clientX,
            y: event.clientY,
        };
        const context = canvas.getContext('2d')
        context?.lineTo(newPoint.x, newPoint.y);
        context?.stroke();
        // OPTIMISATION: only give good points, don't repeat last point
        currentStroke.current.push(newPoint)
        // setCurrentStroke(prev=>[...prev,newPoint])
    }

    // handleMouseDown
    const startDrawing = (event: MouseEvent) => {
        if (!mainCanvasRef.current) return;
        const canvas = mainCanvasRef.current
        canvas.style.zIndex = '100'
        const startingPoint = {
            x: event.clientX,
            y: event.clientY,
        };
        currentStroke.current = [startingPoint]
        // setCurrentStroke([startingPoint])
        const context = canvas.getContext('2d')
        if (!context) return;
        context.beginPath()
        context.moveTo(startingPoint.x, startingPoint.y);
        context.strokeStyle = colorRef.current.toString();
        context.lineWidth = lineWidthRef.current.valueOf()
        canvas.addEventListener('mousemove', draw)
        canvas.addEventListener('mouseup', stopDrawing)
    }

    // handleMouseUp
    const stopDrawing = () => {
        if (!mainCanvasRef.current) return;
        const canvas = mainCanvasRef.current
        canvas.style.zIndex = '0'
        const context = canvas.getContext('2d')
        context?.closePath();
        const newStroke: Stroke = {
            color: color,
            width: lineWidth,
            coordinates: structuredClone(currentStroke.current),
            // to be calculated by add function
            id: NaN,
            layer: NaN
        }
        const imageData = mainCanvasRef.current.toDataURL()
        console.log(newStroke)
        add(newStroke,imageData);
        // clear mainCanvas
        context?.clearRect(0, 0, canvas.width, canvas.height)
        canvas.removeEventListener('mousemove', draw)
        canvas.removeEventListener('mouseup', stopDrawing)
    }

    useEffect(() => {
        // add event listeners every time
        console.log('adding event listeners on mainCanvasRef')
        if (!mainCanvasRef.current) return;
        const canvas = mainCanvasRef.current
        canvas.addEventListener('mousedown', startDrawing)
        return () => {
            canvas.removeEventListener('mousedown', startDrawing)
        }
    })
    useEffect(() => {
        colorRef.current = color
        lineWidthRef.current = lineWidth
    }, [color, lineWidth])

    return (
        <div className="w-full p-2 h-full px-2 flex gap-5 bg-gray-500">
            <SidePallete
                onColorSelect={setColor}
                setLineWidth={setLineWidth}
                lineWidth={lineWidth}
                undo={undo}
                redo={redo}
                save={save}
                strokePointer={strokePointer}
                layerLength={layerLength}
            />
            <LayerStack
                canvasRef={canvasRef}
                canvasContainerRef={canvasContainerRef}
                mainCanvasRef={mainCanvasRef}
            />
        </div>
    )
}

const LayerStack = React.memo(({ canvasRef, canvasContainerRef, mainCanvasRef }: any) => {
    console.error('ReRendering')
    const layers_canvas = [0]
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
            <div ref={canvasContainerRef}>
            {layers_canvas.map((index: number) => {
                return (
                    <canvas className='fixed top-0 left-0 w-screen h-screen'
                        ref={(el) => { canvasRef.current[index] = el }}
                        key={index}
                        width={dimensions.width}
                        height={dimensions.height}
                        style={{
                            background: 'transparent',
                        }}
                    />)
            })}
            </div>
            <canvas className='fixed top-0 left-0 w-screen h-screen'
                ref={mainCanvasRef}
                width={dimensions.width}
                height={dimensions.height}
                //TODO make it react to resizes
                style={{
                    background: 'transparent',
                }}
            />
        </div>
    )
})


export default Canvas
