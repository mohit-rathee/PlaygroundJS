import { Stroke } from "../types";
import { CATMULL_ROM_PRECISION, IS_DRAW_DOTS } from "../utils/initials";
import { createNewCanvas, catmullRom, rgbToINTColor, intToRGBColor, intToRGBValue } from "../utils/magic_functions";
import { Pencil } from "./Strokes/Pencil";
import { Shapes } from "./Strokes/Shapes";

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

        const pContext = pCanvas.getContext('2d', { willReadFrequently: true })
        const rContext = rCanvas.getContext('2d', { willReadFrequently: true });

        if (!pContext || !rContext) {
            throw new Error('Cannot create context');
        }
        this.pContext = pContext;
        this.rContext = rContext;
        this.isVisible = true;
    }


    drawImpPoints(stroke: Stroke, color: string) {
        if (
            !isNaN(stroke.uid) ||
            (stroke instanceof Shapes)
        ) {

            const impPoints = stroke.getImpPoints()
            console.log(impPoints)

            for (let i = 0; i < impPoints.length; i++) {
                const p = impPoints[i];
                const scaledP = { x: p.x * stroke.scaleX, y: p.y * stroke.scaleY }
                const radius = Math.min(Math.max(stroke.lineWidth, 4), 6)
                this.drawDotonP(scaledP, radius, color)
            }
        }
    }
    drawDots(stroke: Stroke, color: string) {
        if (!IS_DRAW_DOTS) return
        if (stroke instanceof Pencil) {
            const points = stroke.points
            for (let i = 0; i < points.length; i++) {
                const p = points[i];
                const scaledP = { x: p.x * stroke.scaleX, y: p.y * stroke.scaleY }
                const radius = Math.min(Math.max(stroke.lineWidth, 4), 6)
                this.drawDotonP(scaledP, radius, color)
            }
        }
    }

    drawDotonP(p: point, radius = 5, color = 'black') {
        this.pContext.beginPath();
        this.pContext.arc(p.x, p.y, radius - 1, 0, Math.PI * 2); // Draw a full circle
        this.pContext.fillStyle = color;
        this.pContext.fill();
    }
    drawDotonR(p: point, radius = 5, color = 'black') {
        this.rContext.beginPath();
        this.rContext.arc(p.x, p.y, radius, 0, Math.PI * 2); // Draw a full circle
        this.rContext.fillStyle = color;
        this.rContext.fill();
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

        this.pContext.scale(stroke.scaleX, stroke.scaleY)
        this.rContext.scale(stroke.scaleX, stroke.scaleY)

    }
    drawCircle(stroke: Shapes) {
        if (stroke.data.type == "Circle") {
            const radius = stroke.data.radius
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
            this.pContext.scale(1 / stroke.scaleX, 1 / stroke.scaleY)
            this.rContext.scale(1 / stroke.scaleX, 1 / stroke.scaleY)
            // this.drawImpPoints(stroke, 'orange')
            this.pContext.restore()
            this.rContext.restore()

        }
    }
    drawRectange(shape: Shapes) {
        if (shape.data.type == "Rectangle") {
            const corner = shape.cornerP
            const width = shape.data.width
            const height = shape.data.height
            this.prepareContext(shape)
            // already translated to centerP
            this.pContext.rect(corner.x, corner.y, width, height)
            this.rContext.rect(corner.x, corner.y, width, height)
            this.pContext.stroke()
            this.rContext.stroke()
            if (shape.isFill) {
                this.pContext.fill()
                this.rContext.fill()
            }
            this.pContext.scale(1 / shape.scaleX, 1 / shape.scaleY)
            this.rContext.scale(1 / shape.scaleX, 1 / shape.scaleY)

            // this.drawImpPoints(shape, 'orange')

            this.pContext.restore()
            this.rContext.restore()
        }
    }

    drawStraightLines(stroke: Pencil) {
        const points = stroke.points
        if (!points.length) return
        this.prepareContext(stroke)

        this.pContext.moveTo(points[0].x, points[0].y);
        this.rContext.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
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
        this.pContext.scale(1 / stroke.scaleX, 1 / stroke.scaleY)
        this.rContext.scale(1 / stroke.scaleX, 1 / stroke.scaleY)

        this.drawDots(stroke, 'blue')
        // this.drawImpPoints(stroke, 'orange')

        this.pContext.restore()
        this.rContext.restore()
    }

    drawCatmullRomSpline(stroke: Pencil) {
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
        this.pContext.scale(1 / stroke.scaleX, 1 / stroke.scaleY)
        this.rContext.scale(1 / stroke.scaleX, 1 / stroke.scaleY)

        this.pContext.stroke()
        this.rContext.stroke()


        if (stroke.isFill) {
            this.pContext.fill()
            this.rContext.fill()
        }

        this.drawDots(stroke, 'blue')
        // this.drawImpPoints(stroke, 'orange')

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
        if (stroke instanceof Pencil) {
            switch (stroke.style) {
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
            }
        } else if (stroke instanceof Shapes) {
            switch (stroke.data.type) {
                case 'Rectangle': {
                    this.drawRectange(stroke)
                    break;
                }
                case 'Circle': {
                    this.drawCircle(stroke)
                    break;
                }
            }
        } else throw new Error('cant find drawing method for ' + stroke + ' class')
    }

    getINT(p: point): number {
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
