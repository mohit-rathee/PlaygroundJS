"use client";
import React, { useEffect, useRef, useState } from "react";
import SidePallete from "./sidePallete";
import { LayerStack, MainCanvas } from "./layerStack";
import { DrawingClass } from "../lib/DrawingClass";
import { CanvasClass } from "../lib/CanvasClass";
import { EventClass } from "../events/eventClass";
import { DrawPencilEventClass } from "../events/pencilEvents";
import { SelectEventClass } from "../events/selectEvents";
import { IS_DEBUG_MODE } from "../utils/initials";

const OPTIONS = ['drawPencil', 'select']

function DrawingBoard() {

    const [isDebugMode, _setDebugMode] = useState(IS_DEBUG_MODE);

    const canvasContainerRef = useRef<HTMLDivElement | null>(null);
    const refCanvasContainerRef = useRef<HTMLDivElement | null>(null);

    const drawingClass = useRef<DrawingClass | null>(null)

    const [color, setColor] = useState<string>('darkred')
    const [lineWidth, setLineWidth] = useState<number>(5);
    const [mode, setMode] = useState<string>('')
    const [style, setStyle] = useState<string>('CatmullRom')

    const colorRef = useRef<string>('gray')
    const styleRef = useRef<string>(style)
    const lineWidthRef = useRef<number>(5)

    const mainPCanvasRef = useRef<HTMLCanvasElement>(null)
    const mainRCanvasRef = useRef<HTMLCanvasElement>(null)
    const mainCanvasClassRef = useRef<CanvasClass | null>(null)

    const eventClassRef = useRef<EventClass | null>(null)

    const [dimensions, setDimensions] = useState({
        'width': 0,
        'height': 0,
    })

    useEffect(() => {
        if (canvasContainerRef.current && refCanvasContainerRef.current) {
            const canvasContainer = canvasContainerRef.current
            const refCanvasContainer = refCanvasContainerRef.current
            const dimensions = {
                'width': window.innerWidth,
                'height': window.innerHeight
            }
            if (isDebugMode) {
                dimensions.width = dimensions.width / 2
            }

            if (!dimensions.width || !dimensions.height) return
            setDimensions(dimensions)

            drawingClass.current = new DrawingClass(
                canvasContainer,
                refCanvasContainer,
                dimensions,
                isDebugMode,
                colorRef,
                lineWidthRef,
                styleRef
            )
        }
        else {
            throw new Error("can't create canvas container")
        }
    }, [isDebugMode])

    useEffect(() => {
        if (!mainPCanvasRef.current || !mainRCanvasRef.current) {
            throw new Error("can't create main canvas")
        }

        const pCanvas = mainPCanvasRef.current
        const rCanvas = mainRCanvasRef.current

        if (!pCanvas.width || !pCanvas.height) return
        if (!rCanvas.width || !rCanvas.height) return
        if (mainCanvasClassRef.current != null) return

        mainCanvasClassRef.current = new CanvasClass(
            pCanvas,
            rCanvas,
            isDebugMode,
        )

        setMode('drawPencil')

    }, [mainPCanvasRef.current?.height, isDebugMode])
    //height is updated later in react.


    useEffect(() => {
        colorRef.current = color
        styleRef.current = style
        lineWidthRef.current = Number(lineWidth)
    }, [color, lineWidth, style])

    useEffect(() => {
        if (!mainCanvasClassRef.current) return

        const eventClass = eventClassRef.current
        if (eventClass) {
            eventClass.deConstructor()
        }

        switch (mode) {
            case "drawPencil": {
                eventClassRef.current = new DrawPencilEventClass(
                    mainCanvasClassRef.current,
                    drawingClass,
                )
                break
            }
            case "select": {
                eventClassRef.current = new SelectEventClass(
                    mainCanvasClassRef.current,
                    drawingClass,
                )
                break
            }
        }
    }, [mode, drawingClass])

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
            {drawingClass.current && <SidePallete
                mode={mode}
                setMode={setMode}
                options={OPTIONS}
                onColorSelect={setColor}
                setLineWidth={setLineWidth}
                lineWidth={lineWidth}
                style={style}
                setStyle={setStyle}
                undo={() => {
                    mainCanvasClassRef.current?.clearCanvas()
                    drawingClass.current?.undo()
                }}
                redo={() => {
                    mainCanvasClassRef.current?.clearCanvas()
                    drawingClass.current?.redo()
                }}
                save={() => {
                    mainCanvasClassRef.current?.clearCanvas()
                    drawingClass.current?.save()
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
