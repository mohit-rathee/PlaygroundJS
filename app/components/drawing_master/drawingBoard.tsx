"use client";
import React, { useEffect, useRef, useState } from "react";
import SidePallete from "./sidePallete";
import { LayerStack, MainCanvas } from "./layerStack";
import { DrawingState } from "./utils/DrawingPanel";

interface DrawingBoardProp {
    canvasContainerRef: React.RefObject<HTMLDivElement>;
    DrawingBoardClassRef: React.RefObject<DrawingState>;
}
function DrawingBoard({ canvasContainerRef, DrawingBoardClassRef }: DrawingBoardProp) {
    const currentStroke = useRef<point[]>([])

    const [color, setColor] = useState<String>('darkred')
    const [lineWidth, setLineWidth] = useState<number>(5);

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
        DrawingBoardClassRef.current?.addStroke(newStroke, imageData);
        // clear mainCanvas
        context?.clearRect(0, 0, canvas.width, canvas.height)
        canvas.removeEventListener('mousemove', draw)
        canvas.removeEventListener('mouseup', stopDrawing)
    }

    useEffect(() => {
        // add event listeners every time
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
        <div className="w-full p-2 h-full px-2 flex gap-5 bg-gray-500">
            {DrawingBoardClassRef.current && <SidePallete
                onColorSelect={setColor}
                setLineWidth={setLineWidth}
                lineWidth={lineWidth}
                // ? is because typescript can't infer above conditional
                undo={()=>DrawingBoardClassRef.current?.undo()}
                redo={()=>DrawingBoardClassRef.current?.redo()}
                save={()=>DrawingBoardClassRef.current?.save()}
            />}
            <LayerStack
                canvasContainerRef={canvasContainerRef}
                dimensions={dimensions}
            />
            <MainCanvas
                mainCanvasRef={mainCanvasRef}
                dimensions={dimensions}
            />
        </div>
    )
}


export default DrawingBoard
