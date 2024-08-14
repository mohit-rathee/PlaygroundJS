"use client";
import React, { useEffect, useRef, useState } from "react";
import SidePallete from "./sidePallete";
import { LayerStack, MainCanvas } from "./layerStack";
import { DrawingClass } from "./utils/DrawingPanel";
import { MainCanvasClass } from "./utils/MainCanvasClass";

interface DrawingBoardProp {
    canvasContainerRef: React.RefObject<HTMLDivElement>;
    refCanvasContainerRef: React.RefObject<HTMLDivElement>;
    DrawingBoardClassRef: React.RefObject<DrawingClass>;
    dimensions: Dimensions
}

const OPTIONS = ['draw', 'select']

function DrawingBoard({ canvasContainerRef, refCanvasContainerRef, DrawingBoardClassRef, dimensions }: DrawingBoardProp) {
    const currentStroke = useRef<point[]>([])

    const [color, setColor] = useState<string>('darkred')
    const [lineWidth, setLineWidth] = useState<number>(5);
    const [selected, setSelected] = useState<string>('draw')

    const colorRef = useRef<string>('gray')
    const lineWidthRef = useRef<number>(5)
    const mainCanvasRef = useRef<HTMLCanvasElement>(null)
    const mainCanvasClass = useRef<MainCanvasClass | null>(null)

    useEffect(() => {
        if (mainCanvasRef.current) {
            const canvas = mainCanvasRef.current
            mainCanvasClass.current = new MainCanvasClass(canvas)
        }
        else {
            throw new Error("can't create main canvas")
        }
    }, [])

    //function handleMouseMove
    const draw = (event: MouseEvent) => {
        const mainCanvas = mainCanvasClass.current
        const newPoint = {
            x: event.clientX,
            y: event.clientY,
        };
        mainCanvas?.draw(newPoint)
        currentStroke.current.push(newPoint)
    }

    // handleMouseDown
    const startDrawing = (event: MouseEvent) => {
        const mainCanvas = mainCanvasClass.current
        const canvas = mainCanvasRef.current
        if(!canvas) return
        canvas.style.zIndex = '100'
        const startingPoint = {
            x: event.clientX,
            y: event.clientY,
        };
        currentStroke.current = [startingPoint]
        mainCanvas?.clear()
        mainCanvas?.start(startingPoint,color,lineWidth)
        canvas.addEventListener('mousemove', draw)
        canvas.addEventListener('mouseup', stopDrawing)
    }

    // handleMouseUp
    const stopDrawing = () => {
        const mainCanvas = mainCanvasClass.current
        if(!mainCanvas)return
        mainCanvas.canvas.style.zIndex = '0'
        const newStroke: Stroke = {
            color: colorRef.current,
            width: lineWidthRef.current,
            coordinates: structuredClone(currentStroke.current),
            // to be calculated by add function
            uid: NaN,
            layer: NaN,
        }
        const imageData = mainCanvas.canvas.toDataURL()
        mainCanvas.clear()
        DrawingBoardClassRef.current?.addStroke(newStroke, imageData);

        mainCanvas.canvas.removeEventListener('mousemove', draw)
        mainCanvas.canvas.removeEventListener('mouseup', stopDrawing)
    }
    const selectDrawing = (event: MouseEvent) => {
        console.log('selecting')
        if (!mainCanvasRef.current) return
        const point: point = { x: event.clientX, y: event.clientY }
        const stroke = DrawingBoardClassRef.current?.select(point)
        if (stroke) {
            const mainCanvas = mainCanvasClass.current
            mainCanvas?.clear()
            mainCanvas?.drawSelectedStroke(stroke)
            // mainCanvas?.canvas.removeEventListener('mousedown',selectDrawing)
            // setSelected('draw')
        }
    }

    useEffect(() => {
        // add event listeners every time
        if (!mainCanvasRef.current) return;
        const canvas = mainCanvasRef.current
        console.log(selected)
        switch (selected) {
            case 'draw':
                console.log('opting draw')
                canvas.addEventListener('mousedown', startDrawing)
                break
            case 'select':
                console.log('opting select')
                canvas.addEventListener('mousedown', selectDrawing)
                break
        }

        return () => {
            canvas.removeEventListener('mousedown', startDrawing)
            canvas.removeEventListener('mousedown', selectDrawing)
        }
    })

    useEffect(() => {
        colorRef.current = color
        lineWidthRef.current = Number(lineWidth)
    }, [color, lineWidth])

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

    }, []);

    return (
        <div className="w-full p-2 h-full px-2 flex gap-5 bg-gray-500">
            {DrawingBoardClassRef.current && <SidePallete
                selected={selected}
                setSelected={setSelected}
                options={OPTIONS}
                onColorSelect={setColor}
                setLineWidth={setLineWidth}
                lineWidth={lineWidth}
                // ? is because typescript can't infer above conditional
                undo={() => DrawingBoardClassRef.current?.undo()}
                redo={() => DrawingBoardClassRef.current?.redo()}
                save={() => DrawingBoardClassRef.current?.save()}
            />}
            <LayerStack
                canvasContainerRef={canvasContainerRef}
                refCanvasContainerRef={refCanvasContainerRef}
            />
            <MainCanvas
                mainCanvasRef={mainCanvasRef}
                dimensions={dimensions}
            />
        </div>
    )
}


export default DrawingBoard
