import { rgbToINTColor, intToRGBColor } from "./map_magic";
export class CanvasClass {
    public pCanvas: HTMLCanvasElement;
    public rCanvas: HTMLCanvasElement;
    public isVisible: boolean;
    // private uid: number;
    private dimensions: Dimensions

    constructor(dimensions: Dimensions, isDebugMode: boolean) {
        this.dimensions = dimensions
        this.pCanvas = this.createNewCanvas(true, true);
        this.rCanvas = this.createNewCanvas(isDebugMode, false)

        this.isVisible = true;
        // this.uid = 0
    }

    createNewCanvas(isP: boolean, onLeft: boolean) {
        const newCanvas = document.createElement('canvas')
        var newCanvasClassName = 'fixed top-0  h-screen';
        if (onLeft) {
            newCanvasClassName += ' left-0'
        } else {
            newCanvasClassName += ' left-[50%]'

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
            console.log('cleared rContext')
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
        console.log('drawing from ', start, ' to ', end)
        const contexts = this.getContext()
        const [pContext, rContext] = contexts
        for (let i = start; i < end; i++) {
            const stroke = layerData.strokes[i]
            const strokeImg = new Image
            strokeImg.src = stroke.image
            strokeImg.onload = () => {
                requestAnimationFrame(() => {
                    pContext.drawImage(strokeImg, stroke.centerP.x, stroke.centerP.y);
                })
                const modifiedImage = new Image();
                const color = intToRGBColor(stroke.uid)
                modifiedImage.src = this.changeImageColor(strokeImg, color);
                modifiedImage.onload = () => {
                    // rContext.drawImage(modifiedImage, 0, 0);
                    rContext.drawImage(modifiedImage, stroke.centerP.x, stroke.centerP.y);
                };
            }
        }
        pContext.setTransform(1, 0, 0, 1, 0, 0);
        rContext.setTransform(1, 0, 0, 1, 0, 0);
    }

    drawStroke(stroke: Stroke) {

        const contexts = this.getContext()
        const [pContext, rContext] = contexts
        // pDrawing
        const img = new Image()
        img.src = stroke.image
        img.onload = () => {
            requestAnimationFrame(() => {
                pContext.drawImage(img, 0, 0);
            })
            const modifiedImage = new Image();
            const color = intToRGBColor(stroke.uid)
            modifiedImage.src = this.changeImageColor(img, color);
            modifiedImage.onload = () => {
                rContext.drawImage(modifiedImage, 0, 0);
            };
        }
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
        // Now, draw the modified image to the primary context (pContext)

    }
}
