import { rgbToINTColor, intToRGBColor } from "./map_magic";
export class CanvasClass {
    public pCanvas: HTMLCanvasElement;
    public rCanvas: HTMLCanvasElement;
    public isVisible: boolean;
    // private uid: number;
    private dimensions: Dimensions

    constructor(dimensions: Dimensions,isDebugMode:boolean) {
        this.dimensions = dimensions
        this.pCanvas = this.createNewCanvas(true,true);
        this.rCanvas = this.createNewCanvas(isDebugMode,false)

        this.isVisible = true;
        // this.uid = 0
    }

    createNewCanvas(isP: boolean,onLeft: boolean) {
        const newCanvas = document.createElement('canvas')
        var newCanvasClassName = 'fixed top-0  h-screen';
        if (onLeft){
            newCanvasClassName+=' left-0'
        }else{
            newCanvasClassName+=' left-[50%]'

        }
        newCanvas.className = newCanvasClassName
        if (isP) {
            newCanvas.style.display = 'block'
        } else {
            newCanvas.style.display = 'none'
        }
        const dimensions = this.dimensions
        newCanvas.width = dimensions.width
        newCanvas.height = dimensions.height
        newCanvas.style.background = 'transparent'
        return newCanvas
    }

    setVisible(isVisible: boolean) {
        if (isVisible == true && this.isVisible == false) {
            this.pCanvas.style.display = 'block'
            // this.rCanvas.style.display = 'block'
            this.isVisible = true;
        } else if (isVisible == false && this.isVisible == true) {
            this.pCanvas.style.display = 'none'
            // this.rCanvas.style.display = 'none'
            this.isVisible = false;
        }
    }

    clear() {
        const contexts = this.getContext()
        if (contexts) {
            const [pContext, rContext] = contexts
            const dimensions = this.dimensions
            pContext.clearRect(0, 0, dimensions.width, dimensions.height)
            rContext.clearRect(0, 0, dimensions.width, dimensions.height)
            pContext.setTransform(1, 0, 0, 1, 0, 0);
            rContext.setTransform(1, 0, 0, 1, 0, 0);
        }
    }

    getContext(): [CanvasRenderingContext2D, CanvasRenderingContext2D] {
        const pContext = this.pCanvas.getContext('2d')
        const rContext = this.rCanvas.getContext('2d')
        if (!pContext || !rContext) throw new Error("can't get context!!!")
        return [pContext, rContext];
    }

    drawStrokes(start: number, end: number, layerData: Layer) {
        const contexts = this.getContext()
        const [pContext, rContext] = contexts
        for (let i = start; i < end; i++) {
            const stroke = layerData.strokes[i]
            const stroke_points = stroke.coordinates
            pContext.beginPath();
            pContext.strokeStyle = stroke.color.toString();
            pContext.lineWidth = stroke.lineWidth.valueOf()
            pContext.lineCap = 'round'
            pContext.translate(stroke.centerP.x,stroke.centerP.y)
            pContext.moveTo(stroke_points[0].x, stroke_points[0].y);

            rContext.beginPath();
            rContext.strokeStyle = intToRGBColor(stroke.uid)
            rContext.lineWidth = stroke.lineWidth.valueOf() + 5;
            rContext.lineCap = 'round'
            rContext.translate(stroke.centerP.x,stroke.centerP.y)
            rContext.moveTo(stroke_points[0].x, stroke_points[0].y);

            stroke_points.forEach((point: point, index: number) => {
                if (index > 0) {
                    pContext.lineTo(point.x, point.y);
                    rContext.lineTo(point.x, point.y);
                }
                pContext.stroke()
                rContext.stroke()
            });
            pContext.setTransform(1, 0, 0, 1, 0, 0);
            rContext.setTransform(1, 0, 0, 1, 0, 0);
        }
    }

    drawStroke(imgData: string, stroke: Stroke) {

        const contexts = this.getContext()
        const [pContext, rContext] = contexts
        // pDrawing
        const img = new Image()
        img.src = imgData
        img.onload = () => {
            requestAnimationFrame(() => {
                pContext.drawImage(img, 0, 0);
            })
        }
        // rDrawing
        console.log('----------')
        console.log(this.rCanvas)
        rContext.lineWidth = stroke.lineWidth + 5
        rContext.strokeStyle = intToRGBColor(stroke.uid)
        rContext.lineCap = 'round'
        rContext.translate(stroke.centerP.x,stroke.centerP.y)

        const stroke_points = stroke.coordinates
        rContext.beginPath();
        rContext.moveTo(stroke_points[0].x, stroke_points[0].y)
        stroke_points.forEach((point: point, index: number) => {
            if (index > 0) {
                rContext.lineTo(point.x, point.y);
            }
            rContext.stroke()
        });
        rContext.setTransform(1, 0, 0, 1, 0, 0);
    }
    getStrokeId(p: point): number {
        const contexts = this.getContext()
        const [_, rContext] = contexts
        const img = rContext.getImageData(p.x, p.y, 1, 1)
        const pixel = img.data
        const red = pixel[0];
        const green = pixel[1];
        const blue = pixel[2];
        const alpha = pixel[3];
        if (alpha > 0) {
            const uid = rgbToINTColor(red, green, blue)
            return uid
        } else {
            return 0
        }
    }
}
