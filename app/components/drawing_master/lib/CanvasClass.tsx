import { createNewCanvas, catmullRom, rgbToINTColor, intToRGBColor, intToRGBValue } from "../utils/magic_functions";

export function CanvasClassGenerator(dimensions: Dimensions, isDebugMode: boolean) {
    const pCanvas = createNewCanvas(dimensions, true, true);
    const rCanvas = createNewCanvas(dimensions, isDebugMode, false)
    const canvasClass = new CanvasClass(pCanvas, rCanvas)
    console.log('CanvasClass created for the first time')
    return canvasClass;
}

export class CanvasClass {
    public pCanvas: HTMLCanvasElement;
    public rCanvas: HTMLCanvasElement;
    public pContext: CanvasRenderingContext2D;
    public rContext: CanvasRenderingContext2D;
    public dimensions: Dimensions;
    public isVisible: boolean;

    constructor(pCanvas: HTMLCanvasElement, rCanvas: HTMLCanvasElement) {
        this.dimensions = { width: pCanvas.width, height: pCanvas.height };
        this.pCanvas = pCanvas;
        this.rCanvas = rCanvas;

        const pContext = pCanvas.getContext('2d')
        const rContext = rCanvas.getContext('2d');

        if (!pContext || !rContext) {
            throw new Error('Cannot create context');
        }
        this.pContext = pContext;
        this.rContext = rContext;
        this.isVisible = true;
    }


    drawDot(p: point, radius = 5, color = 'black') {
        this.pContext.beginPath();
        this.pContext.arc(p.x, p.y, radius, 0, Math.PI * 2); // Draw a full circle
        this.pContext.fillStyle = color;
        this.pContext.fill();
        this.pContext.closePath();
    }

    drawNormalStrokes(stroke: Stroke) {
        const points = stroke.coordinates
        requestAnimationFrame(() => {
            this.pContext.beginPath();
            this.rContext.beginPath();

            this.pContext.save()
            this.rContext.save()

            this.pContext.lineWidth = stroke.lineWidth
            this.rContext.lineWidth = stroke.lineWidth + 3

            this.pContext.strokeStyle = stroke.color
            this.rContext.strokeStyle = intToRGBColor(stroke.uid)

            this.pContext.translate(stroke.centerP.x, stroke.centerP.y)
            this.rContext.translate(stroke.centerP.x, stroke.centerP.y)

            this.pContext.moveTo(points[0].x, points[0].y);
            this.rContext.moveTo(points[0].x, points[0].y);

            for (let i = 0; i < points.length - 1; i++) {
                const p = points[i];
                this.pContext.lineTo(p.x, p.y);
                this.rContext.lineTo(p.x, p.y);
            }
            this.pContext.stroke()
            this.rContext.stroke()

            // for (let i = 0; i < points.length - 1; i++) {
            //     const p = points[i];
            //     this.drawDot(p, Math.max(stroke.lineWidth - 3, 3), 'blue')
            // }

            this.pContext.restore()
            this.rContext.restore()
        })
    }

    drawCatmullRomSpline(stroke: Stroke) {
        const points = stroke.coordinates
        if (points.length < 2) return
        const firstMirroredP = { x: 2 * points[0].x - points[1].x, y: 2 * points[0].y - points[1].y }
        const lastMirroredP = { x: 2 * points[points.length - 1].x - points[points.length - 2].x, y: 2 * points[points.length - 1].y - points[points.length - 2].y }
        const extPoints = [
            firstMirroredP,
            ...points,
            lastMirroredP
        ];
        requestAnimationFrame(() => {
            this.pContext.save()
            this.rContext.save()
            this.pContext.closePath();
            this.rContext.closePath();
            this.pContext.beginPath();
            this.rContext.beginPath();

            this.pContext.lineWidth = stroke.lineWidth
            this.rContext.lineWidth = stroke.lineWidth + 3

            this.pContext.strokeStyle = stroke.color
            this.rContext.strokeStyle = intToRGBColor(stroke.uid)

            this.pContext.translate(stroke.centerP.x, stroke.centerP.y)
            this.rContext.translate(stroke.centerP.x, stroke.centerP.y)

            this.pContext.moveTo(extPoints[1].x, extPoints[1].y);
            this.rContext.moveTo(extPoints[1].x, extPoints[1].y);

            for (let i = 0; i < extPoints.length - 3; i++) {
                const p0 = extPoints[i];
                const p1 = extPoints[i + 1];
                const p2 = extPoints[i + 2];
                const p3 = extPoints[i + 3];
                for (let t = 0; t <= 1; t += 0.01) {
                    const { x, y } = catmullRom(p0, p1, p2, p3, t);
                    this.pContext.lineTo(x, y);
                    this.rContext.lineTo(x, y);
                }
            }
            this.pContext.stroke()
            this.pContext.closePath()
            this.rContext.stroke()
            this.rContext.closePath()

            // for (let i = 0; i < points.length; i++) {
            //     this.drawDot(points[i], 3, 'blue')
            // }

            this.pContext.restore()
            this.rContext.restore()
        })

    }

    drawImage(stroke: Stroke) {
        const strokeImg = new Image
        strokeImg.src = stroke.image
        strokeImg.onload = () => {
            requestAnimationFrame(() => {
                this.pContext.save()
                this.rContext.save()

                this.pContext.drawImage(strokeImg, stroke.centerP.x, stroke.centerP.y);

                const color = intToRGBValue(stroke.uid)
                const modifiedImage = new Image();
                modifiedImage.src = this.changeImageColor(strokeImg, color);
                modifiedImage.onload = () => {
                    this.rContext.drawImage(modifiedImage, stroke.centerP.x, stroke.centerP.y);
                };

                this.pContext.restore()
                this.rContext.restore()
            })
        }
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

    clearCanvas() {
        const dimensions = this.dimensions
        this.pContext.save()
        this.rContext.save()

        this.pContext.clearRect(0, 0, dimensions.width, dimensions.height)
        this.rContext.clearRect(0, 0, dimensions.width, dimensions.height)

        this.pContext.restore()
        this.rContext.restore()

    }

    getContext(): [CanvasRenderingContext2D, CanvasRenderingContext2D] {
        const pContext = this.pCanvas.getContext('2d')
        const rContext = this.rCanvas.getContext('2d')
        if (!pContext || !rContext) throw new Error("can't get context!!!")
        return [pContext, rContext];
    }

    drawStrokes(start: number, end: number, layerData: Layer) {
        console.log('drawing from ', start, ' to ', end)
        for (let i = start; i < end; i++) {
            const stroke = layerData.strokes[i]
            this.drawStroke(stroke)
        }
    }

    drawStroke(stroke: Stroke) {
        //DRAW METHODS

        this.drawCatmullRomSpline(stroke)
        // this.drawNormalStrokes(stroke)
        // this.drawImage(stroke)

    }
    getStrokeId(p: point): number {
        this.rContext.resetTransform()
        const img = this.rContext.getImageData(p.x, p.y, 1, 1)
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

    changeImageColor(img: HTMLImageElement, color: number[]): string {
        // Create a canvas to work with the image
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return ''

        // Set canvas dimensions to the size of the image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image onto the canvas
        context.drawImage(img, 0, 0);

        // Get the image data (pixel data)
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data; // This contains RGBA values
        if (!data || !data.length) return ''

        // Loop through each pixel
        for (let i = 0; i < data.length; i += 4) {
            const alpha = data[i + 3];
            if (alpha > 0) {
                data[i] = color[0];     // Red
                data[i + 1] = color[1]; // Green
                data[i + 2] = color[2]; // Blue
            }
        }

        context.putImageData(imageData, 0, 0);

        // Convert the canvas back to a dataURL
        const modifiedDataURL = canvas.toDataURL();

        return modifiedDataURL
    }
}