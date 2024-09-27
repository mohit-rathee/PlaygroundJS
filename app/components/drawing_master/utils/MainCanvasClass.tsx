import { catmullRom } from "./map_magic";
export class MainCanvasClass {
    public canvas: HTMLCanvasElement;
    public selectedStroke: {
        'layer': number,
        'stroke_id': number,
        'stroke': Stroke
    } | null;
    // private dimensions: Dimensions
    private context: CanvasRenderingContext2D
    // public isVisible: boolean;
    private coordinates: point[];
    private threshold: number;
    private color: string;
    private lineWidth: number;
    private lastP: point;
    private minX: number;
    private minY: number;
    private maxX: number;
    private maxY: number;
    private selectedPos: point;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.selectedStroke = null;
        // this.dimensions = {
        //     'width': canvas.width,
        //     'height': canvas.height,
        // }
        const context = canvas.getContext('2d')
        if (!context) throw new Error('cant get main context')
        this.context = context

        // this.rCanvas = this.createNewCanvas(false)
        // this.isVisible = true;
        this.coordinates = []
        this.threshold = 0
        this.color = ''
        this.lineWidth = NaN
        this.lastP = { 'x': NaN, 'y': NaN }
        this.minX = NaN
        this.minY = NaN
        this.maxX = NaN
        this.maxY = NaN
        this.selectedPos = { x: 0, y: 0 }
    }
    isThresholdTouched() {
        if (this.threshold > 10) {
            return true
        } else {
            return false
        }
    }
    setThreshold(n:number){
        this.threshold = n
    }
    drawDot(p: point, radius = 5, color = 'black') {
        const ctx = this.getContext()
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2); // Draw a full circle
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

    drawCatmullRomSpline(points: point[]) {
        const ctx = this.getContext();
        // Mirror the necessary points for smoother start and end
        ctx.closePath()
        const extPoints = [
            { x: 2 * points[0].x - points[1].x, y: 2 * points[0].y - points[1].y }, // Mirror first point
            ...points,
            { x: 2 * points[points.length - 1].x - points[points.length - 2].x, y: 2 * points[points.length - 1].y - points[points.length - 2].y } // Mirror last point
        ];

        requestAnimationFrame(() => {
            ctx.beginPath();
            ctx.moveTo(extPoints[1].x, extPoints[1].y);
            for (let i = 0; i < extPoints.length - 3; i++) {
                const p0 = extPoints[i];
                const p1 = extPoints[i + 1];
                const p2 = extPoints[i + 2];
                const p3 = extPoints[i + 3];
                for (let t = 0; t <= 1; t += 0.1) {
                    const { x, y } = catmullRom(p0, p1, p2, p3, t);
                    ctx.lineTo(x, y);
                }
            }
            const len = extPoints.length - 2
            ctx.lineTo(extPoints[len].x, extPoints[len].y);
            ctx.stroke()
            //NOTE: uncommenting will cause line to break
            for (let i = 1; i < points.length - 2; i++) {
            this.drawDot(points[i],3,'blue')
            }
            ctx.moveTo(extPoints[len].x, extPoints[len].y);
        })
    }

    redrawCurrentDrawing() {
        const points = this.coordinates;
        this.clear()
        this.drawCatmullRomSpline(points)
        // for (let i = 0; i < points.length; i++) {
        // }

    }
    getContext(): CanvasRenderingContext2D {
        const context = this.context
        // const rContext = this.rCanvas.getContext('2d')
        // if (!pContext || !rContext) throw new Error("can't get context!!!")
        // return [pContext, rContext];
        if (!context) throw new Error("can't get main context!!!")
        return context
    }
    clear() {
        const context = this.context
        // const [pContext, rContext] = contexts
        // const dimensions = this.dimensions
        context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        // rContext.clearRect(0, 0, dimensions.width, dimensions.height)
    }

    drawGizmo(pMin: point, pMax: point) {
        const ctx = this.context
        ctx.save()
        ctx.setLineDash([5, 5])

        // Draw the rectangle
        ctx.beginPath()
        const width = pMax.x - pMin.x + 20
        const height = pMax.y - pMin.y + 20
        ctx.rect(pMin.x - 10, pMin.y - 10, width, height)
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.restore()
    }

    getGap(p: point): point {
        return { x: p.x - this.selectedPos.x, y: p.y - this.selectedPos.y }
    }

    dragSelectedTo(p: point) {
        if (!this.selectedStroke) return
        const context = this.context
        this.clear()
        context.save()

        const gap = this.getGap(p)
        // context.translate(gapX,gapY)
        const img = new Image()
        img.src = this.selectedStroke.stroke.image
        img.onload = () => {
            requestAnimationFrame(() => {
                context.drawImage(img, gap.x, gap.y);
            })
        }
        // context.drawImage(this.imgData,gapX,gapY)
        context.restore()


    }
    drawSelectedStroke(p: point) {
        // const [minP, maxP] = this.getMinMaxPoints(stroke.coordinates)
        const stroke = this.selectedStroke?.stroke
        if (!stroke) return
        // this.drawGizmo(stroke.minP, stroke.maxP)

        const context = this.context
        context.lineWidth = stroke.lineWidth
        // TODO add some transparency to this color
        context.strokeStyle = stroke.color
        context.lineCap = 'round'

        const stroke_points = stroke.coordinates
        context.save()
        context.beginPath();
        context.translate(p.x, p.y)
        context.moveTo(stroke_points[0].x, stroke_points[0].y)
        stroke_points.forEach((point: point, index: number) => {
            if (index > 0) {
                context.lineTo(point.x, point.y);
            }
            context.stroke()
        });
        // context.closePath()
        this.imgData = this.getImageData()
        context.restore()
    }

    start(p: point, color: string, lineWidth: number) {
        this.color = color
        this.lineWidth = lineWidth
        this.coordinates = [p]
        this.minX = p.x
        this.minY = p.y
        this.maxX = p.x
        this.maxY = p.y
        const context = this.context
        context.beginPath()
        context.moveTo(p.x, p.y);
        context.strokeStyle = color
        context.lineWidth = lineWidth
        context.lineCap = 'round'
    }

    // OPTIMISATION: only give good points, don't repeat last point
    draw(p: point) {
        // check if same as lastPoint
        if (p.x == this.lastP.x &&
            p.y == this.lastP.y) return

        // update min & max points
        if (p.x < this.minX) { this.minX = p.x }
        else if (p.x > this.maxX) { this.maxX = p.x }
        if (p.y < this.minY) { this.minY = p.y }
        else if (p.y > this.maxY) { this.maxY = p.y }

        //push
        this.coordinates.push(p)
        const context = this.context
        // requestAnimationFrame(() => {
        context.lineTo(p.x, p.y);
        context.stroke()
        this.threshold += 1
        // })
    }

    getImageData(): string {
        return this.canvas.toDataURL("image/png")
    }
    setOnTop(bool: boolean) {
        // requestAnimationFrame(() => {
        if (bool) {
            this.canvas.style.zIndex = '100'
        } else {
            this.canvas.style.zIndex = '0'
        }
        // })
    }
    setSelected(layer: number, stroke_id: number, stroke: Stroke, e: any) {
        this.selectedStroke = {
            'layer': layer,
            'stroke_id': stroke_id,
            'stroke': stroke
        }
        const pos: point = { 'x': e.clientX, 'y': e.clientY }
        const origin: point = { 'x': this.canvas.width / 2, 'y': this.canvas.height / 2 }
        // this.drawSelectedStroke(origin)
        this.selectedPos = {
            x: pos.x - this.selectedStroke.stroke.centerP.x,
            y: pos.y - this.selectedStroke.stroke.centerP.y,
        }

    }
    getStroke(): Stroke {
        const maxP = { 'x': this.maxX, 'y': this.maxY }
        const minP = { 'x': this.minX, 'y': this.minY }
        const centerX = (this.minX + this.maxX) / 2
        const centerY = (this.minY + this.maxY) / 2
        const centerP = { 'x': centerX, 'y': centerY }
        // const centerP = { 'x': 0, 'y': 0 }
        const newCoordinates = this.coordinates.map(point => ({
            'x': point.x - centerX,
            'y': point.y - centerY,
        }))
        return {
            'uid': NaN,
            'coordinates': newCoordinates,
            'color': this.color,
            'lineWidth': this.lineWidth,
            'maxP': maxP,
            'minP': minP,
            'centerP': centerP,
            'image': ''
        }
    }
}
