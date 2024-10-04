import { CATMULL_ROM_PRECISION, IS_DRAW_DOTS } from "../utils/initials";
import { createNewCanvas, catmullRom, rgbToINTColor, intToRGBColor, intToRGBValue } from "../utils/magic_functions";

export function CanvasClassGenerator(dimensions: Dimensions, isDebugMode: boolean) {
    const pCanvas = createNewCanvas(dimensions, true, true);
    const rCanvas = createNewCanvas(dimensions, isDebugMode, false)
    const canvasClass = new CanvasClass(pCanvas, rCanvas, isDebugMode)
    return canvasClass;
}

export class CanvasClass {
    public pCanvas: HTMLCanvasElement;
    public rCanvas: HTMLCanvasElement;
    public pContext: CanvasRenderingContext2D;
    public rContext: CanvasRenderingContext2D;
    public dimensions: Dimensions;
    public isVisible: boolean;
    private isDebugMode: boolean;

    constructor(pCanvas: HTMLCanvasElement, rCanvas: HTMLCanvasElement, isDebugMode: boolean) {
        this.dimensions = { width: pCanvas.width, height: pCanvas.height };
        this.pCanvas = pCanvas;
        this.rCanvas = rCanvas;
        this.isDebugMode = isDebugMode

        const pContext = pCanvas.getContext('2d',{willReadFrequently:true})
        const rContext = rCanvas.getContext('2d',{willReadFrequently:true});

        if (!pContext || !rContext) {
            throw new Error('Cannot create context');
        }
        this.pContext = pContext;
        this.rContext = rContext;
        this.isVisible = true;
    }


    drawImpPoints(stroke: Stroke) {
        if (
            !isNaN(stroke.uid) ||
            (stroke.type == "Circle" || stroke.type == "Rectangle")
        ) {
            const center = { x: 0, y: 0 };
            const corner = stroke.cornerP;
            const oppCorner = { x: -corner.x, y: -corner.y }
            const sideCorner = { x: corner.x, y: oppCorner.y }
            const oppSideCorner = { x: -sideCorner.x, y: -sideCorner.y }

            const impPoints = [center, corner, oppCorner, sideCorner, oppSideCorner]

            for (let i = 0; i < impPoints.length; i++) {
                const p = impPoints[i];
                this.drawDot(p, Math.max(stroke.lineWidth - 3, 3), 'orange')
            }
        }
    }
    drawDots(stroke: Stroke) {
        if (!IS_DRAW_DOTS) return
        // if (!isNaN(stroke.uid)) {
        if (stroke.type != "Circle" && stroke.type != "Rectangle") {
            const points = stroke.points
            for (let i = 0; i < points.length; i++) {
                const p = points[i];
                this.drawDot(p, Math.max(stroke.lineWidth - 3, 3), 'blue')
            }
        }
        // }
    }

    drawDot(p: point, radius = 5, color = 'black') {
        this.pContext.beginPath();
        this.pContext.arc(p.x, p.y, radius, 0, Math.PI * 2); // Draw a full circle
        this.pContext.fillStyle = color;
        this.pContext.fill();
    }

    prepareContext(stroke: Stroke) {
        this.pContext.save()
        this.rContext.save()

        this.pContext.beginPath();
        this.rContext.beginPath();

        this.pContext.lineWidth = stroke.lineWidth
        this.rContext.lineWidth = stroke.lineWidth + 3

        this.pContext.lineCap = 'round'
        this.rContext.lineCap = 'round'

        this.pContext.strokeStyle = stroke.lineColor
        this.rContext.strokeStyle = intToRGBColor(stroke.uid)

        if (stroke.isFill) {
            this.pContext.fillStyle = stroke.fillColor
            this.rContext.fillStyle = intToRGBColor(stroke.uid)
        }

        this.pContext.setTransform(1, 0, 0, 1, 0, 0)
        this.rContext.setTransform(1, 0, 0, 1, 0, 0)

        this.pContext.translate(stroke.centerP.x, stroke.centerP.y)
        this.rContext.translate(stroke.centerP.x, stroke.centerP.y)

    }
    drawCircle(stroke: Stroke) {
        if (stroke.type == "Circle") {
            const radius = stroke.radius
            this.prepareContext(stroke)
            // already translated to centerP
            this.pContext.arc(0, 0, radius, 0, Math.PI * 2)
            this.rContext.arc(0, 0, radius, 0, Math.PI * 2)
            this.pContext.stroke()
            this.rContext.stroke()
            if (stroke.isFill) {
                this.pContext.fill()
                this.rContext.fill()
            }
            this.drawImpPoints(stroke)
            this.pContext.restore()
            this.rContext.restore()

        }
    }
    drawRectange(stroke: Stroke) {
        if (stroke.type == "Rectangle") {
            const corner = stroke.cornerP
            const width = stroke.width
            const height = stroke.height
            this.prepareContext(stroke)
            // already translated to centerP
            this.pContext.rect(corner.x, corner.y, width, height)
            this.rContext.rect(corner.x, corner.y, width, height)
            this.pContext.stroke()
            this.rContext.stroke()
            if (stroke.isFill) {
                this.pContext.fill()
                this.rContext.fill()
            }
            this.drawImpPoints(stroke)
            this.pContext.restore()
            this.rContext.restore()
        }
    }

    drawStraightLines(stroke: Stroke) {
        if (stroke.type == "Circle" || stroke.type == "Rectangle") return
        const points = stroke.points
        if (!points.length) return
        this.prepareContext(stroke)

        this.pContext.moveTo(points[0].x, points[0].y);
        this.rContext.moveTo(points[0].x, points[0].y);

        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            this.pContext.lineTo(p.x, p.y);
            this.rContext.lineTo(p.x, p.y);
        }
        this.pContext.stroke()
        this.rContext.stroke()

        if (stroke.isFill) {
            this.pContext.fill()
            this.rContext.fill()

        }
        this.drawDots(stroke)
        this.drawImpPoints(stroke)

        this.pContext.restore()
        this.rContext.restore()
    }

    drawCatmullRomSpline(stroke: Stroke) {
        if (stroke.type == "Circle" || stroke.type == "Rectangle") return
        const points = stroke.points
        if (points.length < 2) return
        const firstMirroredP = {
            x: 2 * points[0].x - points[1].x,
            y: 2 * points[0].y - points[1].y,
        }
        const lastMirroredP = {
            x: 2 * points[points.length - 1].x - points[points.length - 2].x,
            y: 2 * points[points.length - 1].y - points[points.length - 2].y,
        }
        const extPoints = [
            firstMirroredP,
            ...points,
            lastMirroredP
        ];
            this.prepareContext(stroke)

            this.pContext.moveTo(points[0].x, points[0].y);
            this.rContext.moveTo(points[0].x, points[0].y);

            for (let i = 0; i < extPoints.length - 3; i++) {
                const p0 = extPoints[i];
                const p1 = extPoints[i + 1];
                const p2 = extPoints[i + 2];
                const p3 = extPoints[i + 3];
                for (let t = 0; t <= 1; t += CATMULL_ROM_PRECISION) {
                    const { x, y } = catmullRom(p0, p1, p2, p3, t);
                    this.pContext.lineTo(x, y);
                    this.rContext.lineTo(x, y);
                }
            }

            this.pContext.stroke()
            this.rContext.stroke()

            if (stroke.isFill) {
                this.pContext.fill()
                this.rContext.fill()
            }

            this.drawDots(stroke)
            this.drawImpPoints(stroke)

            this.pContext.restore()
            this.rContext.restore()

    }

    drawImage(stroke: Stroke) {
        const strokeImg = new Image
        // strokeImg.src = stroke.image
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
        // to clear previous paths
        this.pContext.beginPath()
        this.rContext.beginPath()

        this.pContext.setTransform(1, 0, 0, 1, 0, 0)
        this.rContext.setTransform(1, 0, 0, 1, 0, 0)

        this.pContext.clearRect(0, 0, dimensions.width, dimensions.height)
        this.rContext.clearRect(0, 0, dimensions.width, dimensions.height)

        this.pContext.beginPath()
        this.rContext.beginPath()

    }

    getContext(): [CanvasRenderingContext2D, CanvasRenderingContext2D] {
        const pContext = this.pCanvas.getContext('2d')
        const rContext = this.rCanvas.getContext('2d')
        if (!pContext || !rContext) throw new Error("can't get context!!!")
        return [pContext, rContext];
    }

    //TODO send to DrawingClass
    drawStrokes(start: number, end: number, layerData: Layer) {
        for (let i = start; i < end; i++) {
            const stroke = layerData.strokes[i]
            this.drawStroke(stroke)
        }
    }

    drawStroke(stroke: Stroke) {
        if (!stroke) return
        switch (stroke.type) {
            case 'FreeForm': {
                this.drawStraightLines(stroke);
                break;
            }
            case 'CatmullRom': {
                this.drawCatmullRomSpline(stroke)
                break;
            }
            case 'Polygon': {
                this.drawStraightLines(stroke)
                break;
            }
            case 'Rectangle': {
                this.drawRectange(stroke)
                break;
            }
            case 'Circle': {
                this.drawCircle(stroke)
                break;
            }
            default: {
                throw new Error('Type not found')
            }
        }
    }

    getUID(p: point): number {
        this.rContext.resetTransform()
        const img = this.rContext.getImageData(p.x, p.y, 1, 1)
        const pixel = img.data
        const red = pixel[0];
        const green = pixel[1];
        const blue = pixel[2];
        const alpha = pixel[3];
        if (alpha == 255) {
            const uid = rgbToINTColor(red, green, blue)
            return uid
        } else {
            return NaN
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
