export class MainCanvasClass {
    public canvas: HTMLCanvasElement;
    public seletedStroke: { 
        'layer': number,
        'stroke_id': number,
        'stroke': Stroke
    } | null;
    // private dimensions: Dimensions
    private context: CanvasRenderingContext2D
    // public rCanvas: HTMLCanvasElement;
    // public isVisible: boolean;
    private coordinates: point[];
    private color: string;
    private lineWidth: number;
    private lastP: point;
    private minX: number;
    private minY: number;
    private maxX: number;
    private maxY: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.seletedStroke = null;
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
        this.color = ''
        this.lineWidth = NaN
        this.lastP = { 'x': NaN, 'y': NaN }
        this.minX = NaN
        this.minY = NaN
        this.maxX = NaN
        this.maxY = NaN
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
        console.log('clearing')
    }

    drawGizmo(pMin: point, pMax: point) {
        console.log(pMin, pMax)
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
        console.log('drawing gizmo')
    }

    dragSelectedTo(p: point) {
        if (!this.seletedStroke) return
        const context = this.context
        this.clear()
        context.save()
        this.drawSelectedStroke(p)
        context.restore()


    }
    drawSelectedStroke(p:point) {
        // const [minP, maxP] = this.getMinMaxPoints(stroke.coordinates)
        const stroke = this.seletedStroke?.stroke
        if (!stroke) return
        // this.drawGizmo(stroke.minP, stroke.maxP)

        const context = this.context
        context.lineWidth = stroke.lineWidth
        // TODO add some transparency to this color
        context.strokeStyle = stroke.color
        context.lineCap = 'round'

        const stroke_points = stroke.coordinates
        context.beginPath();
        context.translate(p.x,p.y)
        context.moveTo(stroke_points[0].x, stroke_points[0].y)
        stroke_points.forEach((point: point, index: number) => {
            if (index > 0) {
                context.lineTo(point.x, point.y);
            }
            context.stroke()
        });
        // context.closePath()
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
        console.log('starting')
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
        requestAnimationFrame(() => {
            context.lineTo(p.x, p.y);
            context.stroke()
        })
    }

    getImageData(): string {
        return this.canvas.toDataURL()
    }
    setOnTop(bool: boolean) {
        requestAnimationFrame(() => {
            if (bool) {
                this.canvas.style.zIndex = '100'
            } else {
                console.log('zIndex to 0')
                this.canvas.style.zIndex = '0'
            }
        })
    }
    setSelected(layer:number,stroke_id:number,stroke: Stroke) {
        this.seletedStroke = {
            'layer':layer,
            'stroke_id':stroke_id,
            'stroke':stroke
        }
    }
    getStroke(): Stroke {
        const maxP = { 'x': this.maxX, 'y': this.maxY }
        const minP = { 'x': this.minX, 'y': this.minY }
        const centerX = (this.minX + this.maxX) / 2
        const centerY = (this.minY + this.maxY) / 2
        const centerP = { 'x': centerX, 'y': centerY }
        const newCoordinates = this.coordinates.map(point=>({
            'x': point.x-centerX,
            'y': point.y-centerY,
        }))
        console.log(newCoordinates)
        return {
            'uid': NaN,
            'coordinates': newCoordinates,
            'color': this.color,
            'lineWidth': this.lineWidth,
            'maxP': maxP,
            'minP': minP,
            'centerP': centerP,
        }
    }
}
