"use client";
import React, { useEffect, useRef, useState } from "react";
import SidePallete from "./sidePallete";
import { LayerStack, MainCanvas } from "./layerStack";
import { DrawingClass } from "./utils/DrawingClass";
import { MainCanvasClass } from "./utils/MainCanvasClass";

interface DrawingBoardProp {
    canvasContainerRef: React.RefObject<HTMLDivElement>;
    refCanvasContainerRef: React.RefObject<HTMLDivElement>;
    DrawingBoardClassRef: React.RefObject<DrawingClass>;
    dimensions: Dimensions
}

const OPTIONS = ['draw', 'select']

function DrawingBoard({ canvasContainerRef, refCanvasContainerRef, DrawingBoardClassRef, dimensions }: DrawingBoardProp) {
    console.log('rerendering')
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
    }

    // handleMouseDown
    const startDrawing = (event: MouseEvent) => {
        const mainCanvas = mainCanvasClass.current
        mainCanvas?.setOnTop(true)
        const startingPoint = {
            x: event.clientX,
            y: event.clientY,
        };
        mainCanvas?.clear()
        mainCanvas?.start(startingPoint, color, Number(lineWidth))
        mainCanvas?.canvas.addEventListener('mousemove', draw)
        mainCanvas?.canvas.addEventListener('mouseup', stopDrawing)
    }

    // handleMouseUp
    const stopDrawing = () => {
        const mainCanvas = mainCanvasClass.current
        if (!mainCanvas) return
        mainCanvas.setOnTop(false)
        const newStroke = mainCanvas.getStroke()
        newStroke.image = mainCanvas.getImageData()
        mainCanvas.clear()
        DrawingBoardClassRef.current?.addStroke(newStroke)
        mainCanvas.canvas.removeEventListener('mousemove', draw)
        mainCanvas.canvas.removeEventListener('mouseup', stopDrawing)
    }
    const drag = (e: MouseEvent) => {
        const pos:point = {'x':e.clientX,'y':e.clientY}
        const mainCanvas = mainCanvasClass.current
        mainCanvas?.dragSelectedTo(pos)
        console.log('draging')
    }
    const placeAt = (e:MouseEvent)=>{
        const pos:point = {'x':e.clientX,'y':e.clientY}
        const mainCanvas = mainCanvasClass.current
        if(!mainCanvas?.selectedStroke)return
        const layer = mainCanvas.selectedStroke.layer
        const stroke_id = mainCanvas.selectedStroke.stroke_id
        const gap = mainCanvas.getGap(pos)
        DrawingBoardClassRef.current?.placeStrokeAt(layer,stroke_id,gap)
        mainCanvas?.clear()
        mainCanvas?.canvas.removeEventListener('mousemove',drag)
        mainCanvas?.canvas.removeEventListener('mousedown',placeAt)
        console.log('placint at')
        mainCanvas?.canvas.addEventListener('mousedown', selectDrawing)
    }
    const selectDrawing = (event: MouseEvent) => {
        if (!mainCanvasRef.current) return
        const mainCanvas = mainCanvasClass.current
        mainCanvas?.clear()
        const point: point = { x: event.clientX, y: event.clientY }
        const stroke = DrawingBoardClassRef.current?.select(point)
        if (stroke) {
            mainCanvas?.setSelected(stroke.layer,stroke.stroke_id,stroke.stroke,event)
            // mainCanvas?.drawSelectedStroke()
            drag(event)
            mainCanvas?.canvas.addEventListener('mousemove', drag)
            mainCanvas?.canvas.addEventListener('mousedown',placeAt)
            mainCanvas?.canvas.removeEventListener('mousedown', selectDrawing)
        }
    }

    useEffect(() => {
        // add event listeners every time
        if (!mainCanvasRef.current) return;
        const canvas = mainCanvasRef.current
        switch (selected) {
            case 'draw':
                canvas.addEventListener('mousedown', startDrawing)
                break
            case 'select':
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
                undo={() => {
                    mainCanvasClass.current?.clear()
                    DrawingBoardClassRef.current?.undo()
                }}
                redo={() => {
                    mainCanvasClass.current?.clear()
                    DrawingBoardClassRef.current?.redo()
                }}
                save={() => {
                    mainCanvasClass.current?.clear()
                    DrawingBoardClassRef.current?.save()
                }}
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
