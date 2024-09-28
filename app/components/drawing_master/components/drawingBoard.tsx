"use client";
import React, { useEffect, useRef, useState } from "react";
import SidePallete from "./sidePallete";
import { LayerStack, MainCanvas } from "./layerStack";
import { DrawingClass } from "../lib/DrawingClass";
import { MainCanvasClass } from "../lib/MainCanvasClass";
import { EventHandlerClass as addEventHandlerClass } from "../event_handlers/mouseEvents";

interface DrawingBoardProp {
    canvasContainerRef: React.RefObject<HTMLDivElement>;
    refCanvasContainerRef: React.RefObject<HTMLDivElement>;
    DrawingBoardClassRef: React.RefObject<DrawingClass>;
    dimensions: Dimensions
    isDebugMode: boolean
}

const OPTIONS = ['draw', 'select']

function DrawingBoard({ canvasContainerRef, refCanvasContainerRef, DrawingBoardClassRef, dimensions, isDebugMode }: DrawingBoardProp) {
    const [color, setColor] = useState<string>('darkred')
    const [lineWidth, setLineWidth] = useState<number>(5);
    const [selected, setSelected] = useState<string>('draw')

    const colorRef = useRef<string>('gray')
    const lineWidthRef = useRef<number>(5)
    const mainPCanvasRef = useRef<HTMLCanvasElement>(null)
    const mainRCanvasRef = useRef<HTMLCanvasElement>(null)
    const mainCanvasClass = useRef<MainCanvasClass | null>(null)


    useEffect(() => {
        if (!mainPCanvasRef.current || !mainRCanvasRef.current) {
            throw new Error("can't create main canvas") }

        const pCanvas = mainPCanvasRef.current
        const rCanvas = mainRCanvasRef.current

        if (!pCanvas.width || !pCanvas.height) return
        if (!rCanvas.width || !rCanvas.height) return

        mainCanvasClass.current = new MainCanvasClass(
            pCanvas,
            rCanvas,
            colorRef,
            lineWidthRef
        )

        new addEventHandlerClass(
            pCanvas,
            mainCanvasClass.current,
            DrawingBoardClassRef,
            selected
        )

        mainCanvasClass.current.colorRef = colorRef
        mainCanvasClass.current.lineWidthRef = lineWidthRef

    }, [selected, mainPCanvasRef.current?.height])
    //height is updated later in react.

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
                    mainCanvasClass.current?.clearCanvas()
                    DrawingBoardClassRef.current?.undo()
                }}
                redo={() => {
                    mainCanvasClass.current?.clearCanvas()
                    DrawingBoardClassRef.current?.redo()
                }}
                save={() => {
                    mainCanvasClass.current?.clearCanvas()
                    DrawingBoardClassRef.current?.save()
                }}
            />}
            <LayerStack
                canvasContainerRef={canvasContainerRef}
                refCanvasContainerRef={refCanvasContainerRef}
            />
            <MainCanvas
                mainPCanvasRef={mainPCanvasRef}
                mainRCanvasRef={mainRCanvasRef}
                dimensions={dimensions}
                isDebugMode={isDebugMode}
            />
        </div>
    )
}


export default DrawingBoard
