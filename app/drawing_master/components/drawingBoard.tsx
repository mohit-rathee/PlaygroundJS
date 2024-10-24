"use client";
import React, { useEffect, useRef, useState } from "react";
import SidePallete from "./sidePallete";
import { LayerStack, MainCanvas } from "./layerStack";
import { DrawingClass } from "../lib/DrawingClass";
import { CanvasClass } from "../lib/CanvasClass";
import { DrawPencilEventClass } from "../events/pencilEvents";
import { SelectEventClass } from "../events/selectEvents";
import { IS_DEBUG_MODE } from "../utils/initials";
import { DrawPolygonEventClass } from "../events/polygonEvents";
import { DrawShapeEventClass } from "../events/shapeEvents";
import { ToolRefs } from "../types";
import { EventClassType } from "../types";

function DrawingBoard() {

    const [isDebugMode, _setDebugMode] = useState(IS_DEBUG_MODE);

    const canvasContainerRef = useRef<HTMLDivElement | null>(null);
    const refCanvasContainerRef = useRef<HTMLDivElement | null>(null);

    const drawingClassRef = useRef<DrawingClass | null>(null)

    const [lineColor, setLineColor] = useState<string>('blue')
    const [fillColor, setFillColor] = useState<string>('green')
    const [lineWidth, setLineWidth] = useState<number>(7);
    const [isFill, setIsFill] = useState<boolean>(false)
    const [mode, setMode] = useState<string>("")

    const lineColorRef = useRef<string>(lineColor)
    const fillColorRef = useRef<string>(fillColor)
    const lineWidthRef = useRef<number>(lineWidth)
    const isFillRef = useRef<boolean>(isFill)

    const mainPCanvasRef = useRef<HTMLCanvasElement>(null)
    const mainRCanvasRef = useRef<HTMLCanvasElement>(null)
    const mainCanvasClassRef = useRef<CanvasClass | null>(null)

    const eventClassRef = useRef<EventClassType | null>(null)

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

            drawingClassRef.current = new DrawingClass(
                canvasContainer,
                refCanvasContainer,
                dimensions,
                isDebugMode,
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

        setMode('drawCatmullRom')

    }, [mainPCanvasRef.current?.height, isDebugMode])
    //height is updated later in react.


    useEffect(() => {
        lineColorRef.current = lineColor
        fillColorRef.current = fillColor
        isFillRef.current = isFill
        lineWidthRef.current = Number(lineWidth)
        if (!eventClassRef.current) return
        if (eventClassRef.current?.event == "select") {
            eventClassRef.current.eventClass.reload()
        }
    }, [lineColor, lineWidth, fillColor, isFill])

    useEffect(() => {
        if (!mainCanvasClassRef.current) return
        if (!drawingClassRef.current) return

        const toolRefs: ToolRefs = {
            mainCanvasClass: mainCanvasClassRef.current,
            drawingClass: drawingClassRef,
            lineColor: lineColorRef,
            fillColor: fillColorRef,
            lineWidth: lineWidthRef,
            isFill: isFillRef
        }
        const eventClass = eventClassRef.current?.eventClass
        if (eventClass) {
            eventClass.deConstructor()
        }

        switch (mode) {
            case "": return
            case "drawFreeForm": {
                eventClassRef.current = {
                    event: 'drawPencil',
                    eventClass: new DrawPencilEventClass(
                        toolRefs,
                        "FreeForm"
                    )
                }
                break
            }
            case "drawCatmullRom": {
                eventClassRef.current = {
                    event: 'drawPencil',
                    eventClass: new DrawPencilEventClass(
                        toolRefs,
                        "CatmullRom"
                    )
                }
                break
            }
            case "drawPolygon": {
                eventClassRef.current = {
                    event: 'drawPolygon',
                    eventClass: new DrawPolygonEventClass(
                        toolRefs,
                    )
                }
                break
            }
            case "drawRectangle": {
                eventClassRef.current = {
                    event: 'drawShapes',
                    eventClass: new DrawShapeEventClass(
                        toolRefs,
                        "Rectangle"
                    )
                }
                break
            }
            case "drawCircle": {
                eventClassRef.current = {
                    event: 'drawShapes',
                    eventClass: new DrawShapeEventClass(
                        toolRefs,
                        "Circle"
                    )
                }
                break
            }
            case "select": {
                eventClassRef.current = {
                    event: 'select',
                    eventClass: new SelectEventClass(
                        toolRefs,
                    )
                }
                break
            }
            default: throw new Error(mode + ' is not available')
        }
    }, [mode, drawingClassRef])

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

    const sideProps = {
        mode:mode,
        setMode:setMode,
        lineColor:lineColor,
        setLineColor:setLineColor,
        fillColor:fillColor,
        setFillColor:setFillColor,
        lineWidth:lineWidth,
        setLineWidth:setLineWidth,
        isFill:isFill,
        setIsFill:setIsFill,
        undo: () => {
            eventClassRef.current?.eventClass.deConstructor()
            drawingClassRef.current?.undo()
            setMode("")
        },
        redo: () => {
            eventClassRef.current?.eventClass.deConstructor()
            drawingClassRef.current?.redo()
            setMode("")
        },
        save: () => {
            eventClassRef.current?.eventClass.deConstructor()
            drawingClassRef.current?.save()
            setMode("")
        },

    }
    return (
        <div className="w-full p-2 h-[calc(100vh-3.5rem)] px-2 flex gap-5 bg-[#bbbbbb] dark:bg-gray-600">
            {drawingClassRef.current && <SidePallete props={sideProps} />}
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
