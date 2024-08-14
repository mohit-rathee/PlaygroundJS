export class MainCanvasClass {
    public canvas: HTMLCanvasElement;
    // private dimensions: Dimensions
    private context : CanvasRenderingContext2D
    // public rCanvas: HTMLCanvasElement;
    // public isVisible: boolean;
    // private uid: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        // this.dimensions = {
        //     'width': canvas.width,
        //     'height': canvas.height,
        // }
        const context = canvas.getContext('2d')
        if(!context) throw new Error('cant get main context')
        this.context = context

        // this.rCanvas = this.createNewCanvas(false)
        // this.isVisible = true;
        // this.uid = 0
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
    getMinMaxPoints(points: point[]): [point,point] {
        if (points.length === 0) {
            throw new Error("The points list cannot be empty.");
        }

        // Initialize min and max values using the coordinates of the first point
        let minX = points[0].x;
        let maxX = points[0].x;
        let minY = points[0].y;
        let maxY = points[0].y;

        // Iterate through the list of points to find min and max coordinates
        for (const point of points) {
            if (point.x < minX) minX = point.x;
            if (point.x > maxX) maxX = point.x;
            if (point.y < minY) minY = point.y;
            if (point.y > maxY) maxY = point.y;
        }

        return [{ 'x': minX, 'y': minY }, { 'x': maxX, 'y': maxY }]
    }

    drawGizmo(pMin: point, pMax: point) {
        const ctx = this.context
        ctx.save()
        ctx.setLineDash([5, 5])

        // Draw the rectangle
        ctx.beginPath()
        const width = pMax.x - pMin.x + 20
        const height = pMax.y - pMin.y + 20
        ctx.rect(pMin.x-10, pMin.y-10, width, height)
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.restore()
    }

    drawSelectedStroke(stroke: Stroke) {
        const [minP,maxP] = this.getMinMaxPoints(stroke.coordinates)
        this.drawGizmo(minP,maxP)

        // const context = this.context
        // context.lineWidth = stroke.width
        // // TODO add some transparency to this color
        // context.strokeStyle = stroke.color
        // context.lineCap = 'round'
        //
        // const stroke_points = stroke.coordinates
        // context.beginPath();
        // context.moveTo(stroke_points[0].x, stroke_points[0].y)
        // stroke_points.forEach((point: point, index: number) => {
        //     if (index > 0) {
        //         context.lineTo(point.x, point.y);
        //     }
        //     context.stroke()
        // });
        // context.closePath()
    }

    start(p:point,color:string,width:number){
        const context = this.context
        context.beginPath()
        context.moveTo(p.x, p.y);
        context.strokeStyle = color
        context.lineWidth = width
        context.lineCap = 'round'
    }

    // OPTIMISATION: only give good points, don't repeat last point
    draw(p:point){
        const context = this.context
        context.lineTo(p.x, p.y);
        context.stroke()
        // context.strokeStyle = color
        // context.lineWidth = width
        // context.lineCap = 'round'
    }


}
