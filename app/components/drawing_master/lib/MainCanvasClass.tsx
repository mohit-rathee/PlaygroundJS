import { ramerDouglasPeucker } from "../utils/magic_functions";
import { CanvasClass } from "./CanvasClass";
import { RDP_NORMAL, RDP_CATMULLROM } from "../utils/initials";

import { REDRAW_THRESHOLD } from "../utils/initials";

        
export class MainCanvasClass extends CanvasClass {
    public stroke: Stroke | null
    public selectedStrokeData: {
        'layer': number,
        'stroke_id': number,
    }
    public colorRef: React.MutableRefObject<string>;
    public styleRef: React.MutableRefObject<string>;
    public lineWidthRef: React.MutableRefObject<number>;
    private threshold: number;
    private minX: number;
    private minY: number;
    private maxX: number;
    private maxY: number;
    private selectedPos: point;

    constructor(
        pCanvas: HTMLCanvasElement,
        rCanvas: HTMLCanvasElement,
        colorRef: React.MutableRefObject<string>,
        lineWidthRef: React.MutableRefObject<number>,
        styleRef: React.MutableRefObject<string>,
    ) {
        console.log('mainCanvas is created')
        super(pCanvas, rCanvas)
        this.selectedStrokeData = {
            "layer": NaN,
            "stroke_id": NaN
        }
        this.stroke = null
        this.colorRef = colorRef
        this.styleRef = styleRef
        this.lineWidthRef = lineWidthRef
        this.threshold = 0
        this.minX = NaN
        this.minY = NaN
        this.maxX = NaN
        this.maxY = NaN
        this.selectedPos = { x: 0, y: 0 }
    }
    // setStyle(style:any) { this.style = style
    //     this.stroke.data.style = style
    // }
    getNewStroke(): Stroke {
        console.log('color', this.colorRef.current)
        console.log('lineWidth', this.lineWidthRef.current)
        console.log('style', this.styleRef.current)
        return {
            'uid': NaN,
            'type': 'pencil',
            'data': { 'points': [], 'style': this.styleRef.current },
            'color': this.colorRef.current,
            'lineWidth': this.lineWidthRef.current,
            'minP': { x: 0, y: 0 },
            'maxP': { x: 0, y: 0 },
            'centerP': { x: 0, y: 0 },
            'image': ''
        }

    }
    isThresholdTouched() {
        if (this.threshold > REDRAW_THRESHOLD) {
            return true
        } else {
            return false
        }
    }
    resetThreshold() {
        this.threshold = 0
    }
    drawDot(p: point, radius = 5, color = 'black') {
        this.pContext.beginPath();
        this.pContext.arc(p.x, p.y, radius, 0, Math.PI * 2); // Draw a full circle
        this.pContext.fillStyle = color;
        this.pContext.fill();
        this.pContext.closePath();
    }

    useRDP() {
        if (!this.stroke) throw new Error('stroke is null')
        const points = this.stroke.data.points
        const style = this.stroke.data.style
        if (style == "CatmullRom") {
            this.stroke.data.points = ramerDouglasPeucker(points, RDP_CATMULLROM)
        } else if (style == "Normal") {
            this.stroke.data.points = ramerDouglasPeucker(points, RDP_NORMAL)
        }
    }

    redrawCurrentDrawing() {
        if (!this.stroke) throw new Error('stroke is null')
        this.clearCanvas()
        switch (this.stroke.data.style) {
            case 'Normal': {
                this.drawNormalStrokes(this.stroke)
                break;
            }
            case 'CatmullRom': {
                this.drawCatmullRomSpline(this.stroke)
                break;
            }
        }
        // for (let i = 0; i < points.length; i++) {
        // }

    }
    // getContext(): CanvasRenderingContext2D {
    //     const context = this.context
    //     // const rContext = this.rCanvas.getContext('2d')
    //     // if (!pContext || !rContext) throw new Error("can't get context!!!")
    //     // return [pContext, rContext];
    //     if (!context) throw new Error("can't get main context!!!")
    //     return context
    // }

    // drawGizmo(pMin: point, pMax: point) {
    //     const ctx = this.context
    //     ctx.save()
    //     ctx.setLineDash([5, 5])
    //
    //     // Draw the rectangle
    //     ctx.beginPath()
    //     const width = pMax.x - pMin.x + 20
    //     const height = pMax.y - pMin.y + 20
    //     ctx.rect(pMin.x - 10, pMin.y - 10, width, height)
    //     ctx.strokeStyle = 'black'
    //     ctx.lineWidth = 2
    //     ctx.stroke()
    //     ctx.restore()
    // }

    getGap(p: point): point {
        return { x: p.x - this.selectedPos.x, y: p.y - this.selectedPos.y }
    }

    getNewCenterP(p: point): point {
        if (!this.stroke) throw new Error('stroke is null')
        const strokeCenterP = this.stroke.centerP
        if (!strokeCenterP) return { x: 0, y: 0 }
        const gap = this.getGap(p)
        console.log('GAP', gap)
        this.selectedPos = p
        return { x: strokeCenterP.x + gap.x, y: strokeCenterP.y + gap.y }
    }

    dragSelectedTo(p: point) {
        console.log('POS', p)
        if (!this.stroke) throw new Error('stroke is null')
        // this.clearCanvas()

        const newCenterP = this.getNewCenterP(p)
        console.log('CENTER', newCenterP)
        this.stroke.centerP = newCenterP
        this.redrawCurrentDrawing()
        // const gap = this.getGap(p)
        // this.drawCatmullRomSpline(this.stroke)
        // this.pContext.translate(gap.x, gap.y)
        // const img = new Image()
        // img.src = this.stroke.image
        // img.onload = () => {
        //     requestAnimationFrame(() => {
        //         this.pContext.drawImage(img, gap.x, gap.y);
        //     })
        // }
        // this.pContext.restore()


    }
    // drawSelectedStroke(p: point) {
    //     // const [minP, maxP] = this.getMinMaxPoints(stroke.coordinates)
    //     const stroke = this.selectedStroke?.stroke
    //     if (!stroke) return
    //     // this.drawGizmo(stroke.minP, stroke.maxP)
    //
    //     const context = this.context
    //     context.lineWidth = stroke.lineWidth
    //     // TODO add some transparency to this color
    //     context.strokeStyle = stroke.color
    //     context.lineCap = 'round'
    //
    //     const stroke_points = stroke.coordinates
    //     context.save()
    //     context.beginPath();
    //     context.translate(p.x, p.y)
    //     context.moveTo(stroke_points[0].x, stroke_points[0].y)
    //     stroke_points.forEach((point: point, index: number) => {
    //         if (index > 0) {
    //             context.lineTo(point.x, point.y);
    //         }
    //         context.stroke()
    //     });
    //     // context.closePath()
    //     this.imgData = this.getImageData()
    //     context.restore()
    // }
    //

    start(p: point) {
        this.stroke = this.getNewStroke()
        this.stroke.data.points = [p]
        this.minX = p.x
        this.minY = p.y
        this.maxX = p.x
        this.maxY = p.y
        this.pContext.beginPath()
        this.pContext.moveTo(p.x, p.y);
        this.pContext.strokeStyle = this.stroke.color
        this.pContext.lineWidth = this.stroke.lineWidth
        this.pContext.lineCap = 'round'
    }

    // OPTIMISATION: only give good points, don't repeat last point
    draw(p: point) {
        // update min & max points
        if (p.x < this.minX) { this.minX = p.x }
        else if (p.x > this.maxX) { this.maxX = p.x }
        if (p.y < this.minY) { this.minY = p.y }
        else if (p.y > this.maxY) { this.maxY = p.y }

        //push
        this.stroke?.data.points.push(p)
        // requestAnimationFrame(() => {
        this.pContext.lineTo(p.x, p.y);
        this.pContext.stroke()
        // })
        this.threshold += 1
    }

    getImageData(): string {
        return this.pCanvas.toDataURL("image/png")
    }
    setOnTop(bool: boolean) {
        // requestAnimationFrame(() => {
        if (bool) {
            this.pCanvas.style.zIndex = '100'
        } else {
            this.pCanvas.style.zIndex = '0'
        }
        // })
    }
    setSelected(layer: number, stroke_id: number, stroke: Stroke, e: any) {
        this.stroke = stroke
        this.selectedStrokeData = {
            'layer': layer,
            'stroke_id': stroke_id,
        }
        const pos: point = { 'x': e.clientX, 'y': e.clientY }
        // const origin: point = { 'x': this.pCanvas.width / 2, 'y': this.pCanvas.height / 2 }
        // this.drawSelectedStroke(origin)
        this.selectedPos = {
            x: pos.x,
            y: pos.y,
        }
        console.log('selectedStroke', this.selectedPos)
        console.log('center', this.stroke.centerP)

    }
    getStroke(): Stroke {
        if (!this.stroke) throw new Error('stroke is null')
        const centerX = (this.minX + this.maxX) / 2
        const centerY = (this.minY + this.maxY) / 2
        const maxP = { 'x': this.maxX - centerX, 'y': this.maxY - centerY }
        const minP = { 'x': this.minX - centerX, 'y': this.minY - centerY }
        const centerP = { 'x': centerX, 'y': centerY }
        const newPoints = this.stroke.data.points.map(point => ({
            'x': point.x - centerX,
            'y': point.y - centerY,
        }))

        const color = this.stroke.color
        const lineWidth = this.stroke.lineWidth
        const style = this.stroke.data.style
        const stroke = {
            'uid': NaN,
            'type': 'Pencil',
            'data': { 'points': newPoints, 'style': style },
            'color': color,
            'lineWidth': lineWidth,
            'maxP': maxP,
            'minP': minP,
            'centerP': centerP,
            'image': ''
        }
        this.stroke = null
        return stroke
    }
}
