import { LAYER_THRESHOLD } from "../utils/initials";
import { CanvasClassGenerator, CanvasClass } from "./CanvasClass";
import { initialDrawingState, initialStrokePointer } from "../utils/initials";
import { Stroke } from "../types";
import { Shapes } from "./Strokes/Shapes";
import { Pencil } from "./Strokes/Pencil";
export class DrawingClass {
    private pCanvasContainer: HTMLDivElement;
    private rCanvasContainer: HTMLDivElement;

    private canvasList: CanvasClass[];
    private drawing: DrawingVerse;

    private strokePointer: StrokePointer;

    private dimensions: Dimensions;
    private isDebugMode: boolean;

    constructor(
        pCanvasContainer: HTMLDivElement,
        rCanvasContainer: HTMLDivElement,
        dimensions: Dimensions,
        isDebugMode: boolean,
        // styleRef: React.MutableRefObject<string>,
    ) {
        console.log('DIMENSIONS', dimensions)
        this.pCanvasContainer = pCanvasContainer
        this.rCanvasContainer = rCanvasContainer
        this.dimensions = dimensions
        this.isDebugMode = isDebugMode
        const canvasClass = CanvasClassGenerator(dimensions, isDebugMode)
        this.canvasList = [canvasClass]
        this.pCanvasContainer.appendChild(canvasClass.pCanvas)
        this.rCanvasContainer.appendChild(canvasClass.rCanvas)

        this.strokePointer = initialStrokePointer
        this.drawing = initialDrawingState
    }


    getStrokeLength(stroke: Stroke): number {
        if (stroke instanceof Shapes) {
            return 10;
        } else if (stroke instanceof Pencil) {
            return stroke.points.length
        }
        else throw new Error('method to calculate length of ' + stroke + ' is unknown')
    }


    addStroke(stroke: Stroke) {
        console.log('adding stroke')
        const strokePointer = this.strokePointer
        const layerStack = this.drawing
        const layerLength = layerStack[strokePointer.layer - 1].length
        const strokeLength = this.getStrokeLength(stroke)
        const newLength = (layerLength + strokeLength)

        // Override layer in undo state

        if (strokePointer.stroke_id != 0 && newLength >= LAYER_THRESHOLD) {
            // Override last layer strokes
            layerStack.length = strokePointer.layer
            layerStack[strokePointer.layer - 1].strokes.length = strokePointer.stroke_id


            // SET STROKE POINTER
            strokePointer.layer = strokePointer.layer + 1
            strokePointer.stroke_id = 1
            // later help to derive unique color
            // for color mapping for this layer

            // PUSH NEXT LAYER
            stroke.uid = strokePointer.stroke_id
            const nextLayer: Layer = {
                length: strokeLength,
                strokes: [stroke]
            }
            layerStack.push(nextLayer)

            // Adding new canvas
            if (this.canvasList.length < strokePointer.layer) {
                // const newCanvas = document.createElement('canvas')
                // newCanvas.className = 'fixed top-0 left-0 w-screen h-screen';
                // newCanvas.width = window.innerWidth;
                // newCanvas.height = window.innerHeight;
                // newCanvas.style.background = 'transparent';
                const newCanvasClass = CanvasClassGenerator(this.dimensions, this.isDebugMode)
                this.pCanvasContainer.appendChild(newCanvasClass.pCanvas)
                this.rCanvasContainer.appendChild(newCanvasClass.rCanvas)
                this.canvasList.push(newCanvasClass)
            }
            const canvas = this.canvasList[strokePointer.layer - 1]
            canvas.clearCanvas()
            canvas.setVisible(true)
            // TODO get uid
            canvas.drawStroke(stroke)
        } else {
            //OVERRIDE
            layerStack.length = strokePointer.layer
            layerStack[layerStack.length - 1].strokes.length = strokePointer.stroke_id

            // SET STROKE POINTER
            strokePointer.stroke_id = strokePointer.stroke_id + 1

            // PUSH
            const layerData = layerStack[layerStack.length - 1]
            stroke.uid = strokePointer.stroke_id
            layerData.strokes.push(stroke)
            layerData.length = newLength

            const canvas = this.canvasList[strokePointer.layer - 1]

            if (strokePointer.stroke_id == 1) {
                canvas.clearCanvas()
                canvas.setVisible(true)
            }

            // Add
            canvas.drawStroke(stroke)
            console.log('drawing:', this.drawing)
        }
        console.log('strokePointer', strokePointer)
    }
    undo() {
        console.log('undo')
        const strokePointer = this.strokePointer
        const layerStack = this.drawing
        const layerLength = layerStack[strokePointer.layer - 1].length

        const prevStroke = strokePointer.stroke_id - 1;

        const currentLayerIndex = strokePointer.layer - 1
        const prevLayerIndex = currentLayerIndex - 1

        if (prevStroke < 0) {
            if (prevLayerIndex < 0) {
                // Already at oldest change
                console.log('oldest change')
                return
            }
            const prevLayer = layerStack[prevLayerIndex]
            const lastStroke = prevLayer.strokes[prevLayer.strokes.length - 1]
            const lastStrokeLength = this.getStrokeLength(lastStroke)

            // layer length upto last 2nd stroke
            prevLayer.length = prevLayer.length - lastStrokeLength

            strokePointer.layer = prevLayerIndex + 1
            strokePointer.stroke_id = prevLayer.strokes.length - 1
        } else {
            // undo current layer
            const currentLayer = layerStack[currentLayerIndex]
            strokePointer.stroke_id = prevStroke
            const layer = layerStack[strokePointer.layer - 1]
            const currentStroke = layer.strokes[prevStroke]
            const currentStrokeLength = this.getStrokeLength(currentStroke)
            currentLayer.length = layerLength - currentStrokeLength
        }
        // redraw
        const canvasIndex = strokePointer.layer - 1
        const canvas = this.canvasList[canvasIndex]
        const stroke_id = strokePointer.stroke_id
        const layerData = layerStack[canvasIndex]
        if (stroke_id == 0) {
            canvas.setVisible(false)
        } else {
            canvas.clearCanvas()
            canvas.drawStrokes(0, stroke_id, layerData)
        }
        // debug
        console.log('drawingState', layerStack)
        console.log('strokePointer', strokePointer)
        return
    }
    redo() {
        console.log('redo')
        const strokePointer = this.strokePointer
        const layerStack = this.drawing

        const nextStrokeIndex = strokePointer.stroke_id + 1
        const maxStroke = layerStack[strokePointer.layer - 1].strokes.length

        const maxLayer = layerStack.length
        const currentLayerIndex = strokePointer.layer - 1
        const nextLayerIndex = currentLayerIndex + 1

        // redo next layer
        if (nextStrokeIndex > maxStroke) {
            // Already at newest change
            if (nextLayerIndex == maxLayer) {
                console.log('newest change')
                return
            }
            strokePointer.layer = nextLayerIndex + 1
            strokePointer.stroke_id = 1
            const nextLayer = layerStack[nextLayerIndex]
            // layerlength will be next layers first stroke length
            nextLayer.length = this.getStrokeLength(nextLayer.strokes[0])
        } else {
            // redo current layer
            strokePointer.stroke_id = nextStrokeIndex
            const nextStroke = layerStack[currentLayerIndex].strokes[nextStrokeIndex - 1]
            const nextStrokeLength = this.getStrokeLength(nextStroke)
            const currentLayer = layerStack[currentLayerIndex]
            // add length of next stroke in layerLength
            const layerLength = layerStack[currentLayerIndex].length
            currentLayer.length = layerLength + nextStrokeLength
        }

        // draw latest stroke
        const canvasIndex = strokePointer.layer - 1
        const canvas = this.canvasList[canvasIndex]
        if (strokePointer.stroke_id == 1) {
            canvas.setVisible(true)
        } else {
            const strokeIndex = strokePointer.stroke_id - 1
            const layerData = layerStack[canvasIndex]
            canvas.drawStrokes(strokeIndex, strokeIndex + 1, layerData)
        }
        //debug
        console.log('drawingState', layerStack)
        console.log('strokePointer', strokePointer)
    }
    save() {
        console.log('save')
        const mergedCanvas = document.createElement('canvas');
        const mergedCtx = mergedCanvas.getContext('2d');

        const canvasArray = this.canvasList
        const canvasClass = canvasArray[0]
        mergedCanvas.width = canvasClass.pCanvas.width
        mergedCanvas.height = canvasClass.pCanvas.height

        // Draw each canvas onto the merged canvas
        if (!mergedCtx) return;
        mergedCtx.fillStyle = "#6b6f7b" // gray
        mergedCtx.fillRect(0, 0, mergedCanvas.width, mergedCanvas.height)
        canvasArray.forEach((canvasClass) => {
            if (canvasClass.pCanvas.style.display == 'block') {
                mergedCtx.drawImage(canvasClass.pCanvas, 0, 0);
            }
        });

        // Convert the merged canvas to an image
        const dataURL = mergedCanvas.toDataURL('image/jpeg');

        // Create a link element and trigger download
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'drawing.jpg';
        link.click();
    }
    placeStrokeAt(strokeinfo: StrokePointer) {
        // const stroke = this.drawing[strokeinfo.layer].strokes[strokeinfo.stroke_id - 1]
        this.redrawLayer(strokeinfo.layer)
        // draw Strokes of that layer again

    }
    redrawLayer(layerIndex: number) {
        const layerData = this.drawing[layerIndex]
        const canvas = this.canvasList[layerIndex]
        canvas.clearCanvas()
        if (this.strokePointer.layer == layerIndex + 1) {
            canvas.drawStrokes(0, this.strokePointer.stroke_id, layerData)
        } else {
            canvas.drawStrokes(0, layerData.strokes.length, layerData)

        }
    }
    select(pos: point): [StrokePointer, Stroke] | null {
        const canvasList = this.canvasList
        // console.log('total',canvasList.length)
        for (let i = canvasList.length - 1; i >= 0; i--) {
            if (canvasList[i].isVisible) {
                const canvasClass = canvasList[i]
                const uid = canvasClass.getINT(pos)
                if (isNaN(uid)) {
                    continue;
                }
                // console.log('stroke found in layer ', i, ' stroke no', uid)
                const layerData = this.drawing[i]
                canvasClass.clearCanvas()
                canvasClass.drawStrokes(0, uid - 1, layerData)
                // Patch work embed this info in stroke
                if (this.strokePointer.layer - 1 == i) {
                    canvasClass.drawStrokes(uid, this.strokePointer.stroke_id, layerData)
                }
                else {
                    canvasClass.drawStrokes(uid, layerData.strokes.length, layerData)
                }
                return [
                    {
                        'layer': i,
                        'stroke_id': uid,
                    },
                    layerData.strokes[uid - 1]
                ]
            }
        }
        return null;
    }
}
