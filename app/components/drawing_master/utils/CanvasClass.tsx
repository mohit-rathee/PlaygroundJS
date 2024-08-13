export class CanvasClass {

    public canvas: HTMLCanvasElement;
    // due to async nature of useRef these are not present in canvas.
    // private width: number;
    // private height: number;
    private isVisible: boolean;

    constructor(canvas: HTMLCanvasElement) {
            this.canvas = canvas;
            // console.log(canvas.height) //==> 0
            // this.height = canvas.height;
            // this.width =  canvas.width;
            this.isVisible = true;
    }

    getDimensions():{'width':number,'height':number}{
        return {
            'width':this.canvas.width,
            'height':this.canvas.height,
        }
    }

    setVisible(isVisible: boolean) {
        if (isVisible == true && this.isVisible == false) {
            this.canvas.style.display = 'block'
            this.isVisible = true;
        } else if (isVisible == false && this.isVisible == true) {
            this.canvas.style.display = 'none'
            this.isVisible = false;
        }
    }

    clear() {
        const context = this.getContext()
        context?.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    getContext(): CanvasRenderingContext2D | null {
        const context = this.canvas.getContext('2d')
        if (!context) throw Error("can't get context!!!")
        return context;
    }

    drawStrokes(start: number, end: number, layerData: Layer) {
        const context = this.getContext()
        if (!context) return
        for (let i = start; i < end; i++) {
            const stroke = layerData.strokes[i]
            const stroke_points = stroke.coordinates
            context.beginPath();
            context.strokeStyle = stroke.color.toString();
            context.lineWidth = stroke.width.valueOf()
            context.moveTo(stroke_points[0].x, stroke_points[0].y);
            stroke_points.forEach((point: point, index: number) => {
                if (index > 0) {
                    context.lineTo(point.x, point.y);
                }
                context.stroke()
            });
        }
        context.closePath()
    }

    drawImage(imgData: string) {
        const context = this.getContext()
        if (!context) return;
        const img = new Image()
        img.src = imgData
        img.onload = () => {
            context.drawImage(img, 0, 0);
        }

    }

}
