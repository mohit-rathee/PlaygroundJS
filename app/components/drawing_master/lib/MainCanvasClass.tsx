import { ramerDouglasPeucker } from "../utils/magic_functions";
import { CanvasClass } from "./CanvasClass";
const REDRAW_THRESHOLD = 20

export class MainCanvasClass extends CanvasClass {
    public stroke: Stroke
    public selectedStrokeData: {
        'layer': number,
        'stroke_id': number,
    }
    public colorRef: React.MutableRefObject<string>;
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
        lineWidthRef: React.MutableRefObject<number>
    ) {
        console.log('mainCanvas is created')
        super(pCanvas, rCanvas)
        this.selectedStrokeData = {
            "layer": NaN,
            "stroke_id": NaN
        }
        this.stroke = this.getNewStroke()
        this.colorRef = colorRef
        this.lineWidthRef = lineWidthRef
        this.threshold = 0
        this.minX = NaN
        this.minY = NaN
        this.maxX = NaN
        this.maxY = NaN
        this.selectedPos = { x: 0, y: 0 }
    }
    getNewStroke() {
        return {
            'uid': NaN,
            'coordinates': [],
            'color': '',
            'lineWidth': NaN,
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
    // drawCatmullRomSpline(stroke: Stroke) {
    //     const points = stroke.coordinates
    //     const ctx = this.getContext();
    //     const extPoints = [
    //         { x: 2 * points[0].x - points[1].x, y: 2 * points[0].y - points[1].y }, // Mirror first point
    //         ...points,
    //         { x: 2 * points[points.length - 1].x - points[points.length - 2].x, y: 2 * points[points.length - 1].y - points[points.length - 2].y } // Mirror last point
    //     ];
    //
    //     requestAnimationFrame(() => {
    //         ctx.beginPath();
    //         ctx.moveTo(extPoints[1].x, extPoints[1].y);
    //         for (let i = 0; i < extPoints.length - 3; i++) {
    //             const p0 = extPoints[i];
    //             const p1 = extPoints[i + 1];
    //             const p2 = extPoints[i + 2];
    //             const p3 = extPoints[i + 3];
    //             for (let t = 0; t <= 1; t += 0.01) {
    //                 const { x, y } = catmullRom(p0, p1, p2, p3, t);
    //                 ctx.lineTo(x, y);
    //             }
    //         }
    //         const len = extPoints.length - 2
    //         ctx.lineTo(extPoints[len].x, extPoints[len].y);
    //         ctx.stroke()
    //         // for (let i = 1; i < points.length; i++) {
    //         //     this.drawDot(points[i], 3, 'blue')
    //         // }
    //         ctx.moveTo(extPoints[len].x, extPoints[len].y);
    //     })
    // }

    useRDP() {
        const points = this.stroke.coordinates
        const epsilon = 3
        const newCoordinates = ramerDouglasPeucker(points, epsilon)
        this.stroke.coordinates = newCoordinates
    }

    redrawCurrentDrawing() {
        this.clearCanvas()
        // this.drawCatmullRomSpline(this.stroke)
        this.drawNormalStrokes(this.stroke)
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
        const strokeCenterP = this.stroke.centerP
        if (!strokeCenterP) return { x: 0, y: 0 }
        const gap = this.getGap(p)
        console.log('Gap', gap)
        return { x: strokeCenterP.x + gap.x, y: strokeCenterP.y + gap.y }
    }

    dragSelectedTo(p: point) {
        if (!this.stroke) return
        this.clearCanvas()

        const gap = this.getGap(p)
        // this.drawCatmullRomSpline(this.selectedStroke)
        this.pContext.translate(gap.x, gap.y)
        const img = new Image()
        img.src = this.stroke.image
        img.onload = () => {
            requestAnimationFrame(() => {
                this.pContext.drawImage(img, gap.x, gap.y);
            })
        }
        this.pContext.restore()


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
        this.stroke.coordinates = [p]
        this.minX = p.x
        this.minY = p.y
        this.maxX = p.x
        this.maxY = p.y
        this.pContext.beginPath()
        this.pContext.moveTo(p.x, p.y);
        this.stroke.color = this.colorRef.current
        this.stroke.lineWidth = this.lineWidthRef.current
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
        this.stroke.coordinates.push(p)
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
        const maxP = { 'x': this.maxX, 'y': this.maxY }
        const minP = { 'x': this.minX, 'y': this.minY }
        const centerX = (this.minX + this.maxX) / 2
        const centerY = (this.minY + this.maxY) / 2
        const centerP = { 'x': centerX, 'y': centerY }
        const newCoordinates = this.stroke.coordinates.map(point => ({
            'x': point.x - centerX,
            'y': point.y - centerY,
        }))
        const color = this.stroke.color
        const lineWidth = this.stroke.lineWidth
        const stroke =  {
            'uid': NaN,
            'coordinates': newCoordinates,
            'color': color,
            'lineWidth': lineWidth,
            'maxP': maxP,
            'minP': minP,
            'centerP': centerP,
            'image': ''
        }
        this.stroke = this.getNewStroke()
        return stroke
    }
}
