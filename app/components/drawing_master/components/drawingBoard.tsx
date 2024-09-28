"use client";
import React, { useEffect, useRef, useState } from "react";
import SidePallete from "./sidePallete";
import { LayerStack, MainCanvas } from "./layerStack";
import { DrawingClass } from "../lib/DrawingClass";
import { MainCanvasClass } from "../lib/MainCanvasClass";
import { EventHandlerClass } from "../event_handlers/mouseEvents";

interface DrawingBoardProp {
    canvasContainerRef: React.RefObject<HTMLDivElement>;
    refCanvasContainerRef: React.RefObject<HTMLDivElement>;
    DrawingBoardClassRef: React.RefObject<DrawingClass>;
    dimensions: Dimensions
    isDebugMode: boolean
}

const OPTIONS = ['drawPencil', 'select']

function DrawingBoard({ canvasContainerRef, refCanvasContainerRef, DrawingBoardClassRef, dimensions, isDebugMode }: DrawingBoardProp) {
    const [color, setColor] = useState<string>('darkred')
    const [lineWidth, setLineWidth] = useState<number>(5);
    const [mode, setMode] = useState<string>('drawPencil')
    const [style, setStyle] = useState<string>('CatmullRom')

    const colorRef = useRef<string>('gray')
    const styleRef = useRef<string>(style)
    const lineWidthRef = useRef<number>(5)
    const mainPCanvasRef = useRef<HTMLCanvasElement>(null)
    const mainRCanvasRef = useRef<HTMLCanvasElement>(null)
    const mainCanvasClassRef = useRef<MainCanvasClass | null>(null)
    const eventClassRef = useRef<EventHandlerClass | null>(null)


    useEffect(() => {
        if (!mainPCanvasRef.current || !mainRCanvasRef.current) {
            throw new Error("can't create main canvas") }

        const pCanvas = mainPCanvasRef.current
        const rCanvas = mainRCanvasRef.current

        if (!pCanvas.width || !pCanvas.height) return
        if (!rCanvas.width || !rCanvas.height) return
        if (mainCanvasClassRef.current!=null) return

        mainCanvasClassRef.current = new MainCanvasClass(
            pCanvas,
            rCanvas,
            colorRef,
            lineWidthRef,
            styleRef
        )
        eventClassRef.current = new EventHandlerClass(
            pCanvas,
            mainCanvasClassRef.current,
            DrawingBoardClassRef,
        )

        mainCanvasClassRef.current.colorRef = colorRef
        mainCanvasClassRef.current.lineWidthRef = lineWidthRef

    },[DrawingBoardClassRef,mainPCanvasRef.current?.height])

    //height is updated later in react.

    useEffect(() => {
        colorRef.current = color
        styleRef.current = style
        lineWidthRef.current = Number(lineWidth)
    }, [color, lineWidth, style])

    useEffect(() => {
        const eventClass = eventClassRef.current
        if(!eventClass)return
        eventClass.setMode(mode)
    },[mode])

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
                mode={mode}
                setMode={setMode}
                options={OPTIONS}
                onColorSelect={setColor}
                setLineWidth={setLineWidth}
                lineWidth={lineWidth}
                style = {style}
                setStyle = {setStyle}
                undo={() => {
                    mainCanvasClassRef.current?.clearCanvas()
                    DrawingBoardClassRef.current?.undo()
                }}
                redo={() => {
                    mainCanvasClassRef.current?.clearCanvas()
                    DrawingBoardClassRef.current?.redo()
                }}
                save={() => {
                    mainCanvasClassRef.current?.clearCanvas()
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
