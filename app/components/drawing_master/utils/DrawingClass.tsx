import { THRESHOLD_VALUE } from "../initials";
import { CanvasClass } from "./CanvasClass";
import { initialDrawingState, initialStrokePointer } from "../initials";
export class DrawingClass {
    private canvasList: CanvasClass[];
    private pCanvasContainer: HTMLDivElement;
    private rCanvasContainer: HTMLDivElement;
    private strokePointer: StrokePointer;
    private drawing: Drawing;
    private dimensions: Dimensions;

    constructor(
        pCanvasContainer: HTMLDivElement,
        rCanvasContainer: HTMLDivElement,
        dimensions: Dimensions
    ) {
        this.pCanvasContainer = pCanvasContainer
        this.rCanvasContainer = rCanvasContainer
        this.dimensions = dimensions
        const canvasClass = new CanvasClass(dimensions)
        this.canvasList = [canvasClass]

        this.pCanvasContainer.appendChild(canvasClass.pCanvas)
        this.rCanvasContainer.appendChild(canvasClass.rCanvas)

        this.strokePointer = initialStrokePointer
        this.drawing = initialDrawingState
    }

    addStroke(stroke: Stroke, imgData: string) {
        console.log('adding stroke')
        console.log(stroke)
        const strokePointer = this.strokePointer
        const layerStack = this.drawing
        const layerLength = layerStack[strokePointer.layer - 1].length


        const newLength = (layerLength + stroke.coordinates.length)
        // Override layer in undo state

        if (strokePointer.stroke_id != 0 && newLength >= THRESHOLD_VALUE) {
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
                length: stroke.coordinates.length,
                strokes: [stroke]
            }
            layerStack.push(nextLayer)
            console.log('layerLength:', stroke.coordinates.length)

            // Adding new canvas
            if (this.canvasList.length < strokePointer.layer) {
                // const newCanvas = document.createElement('canvas')
                // newCanvas.className = 'fixed top-0 left-0 w-screen h-screen';
                // newCanvas.width = window.innerWidth;
                // newCanvas.height = window.innerHeight;
                // newCanvas.style.background = 'transparent';
                const newCanvasClass = new CanvasClass(this.dimensions)
                this.pCanvasContainer.appendChild(newCanvasClass.pCanvas)
                this.rCanvasContainer.appendChild(newCanvasClass.rCanvas)
                this.canvasList.push(newCanvasClass)
            }
            const canvas = this.canvasList[strokePointer.layer - 1]
            canvas.clear()
            canvas.setVisible(true)
            // TODO get uid
            canvas.drawStroke(imgData, stroke)
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
                canvas.clear()
                canvas.setVisible(true)
            }

            // Add
            canvas.drawStroke(imgData, stroke)
            console.log('layerLength:', newLength)
        }
        console.log('drawingState', layerStack)
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
            const lastStrokeLength = lastStroke.coordinates.length

            // layer length upto last 2nd stroke
            prevLayer.length = prevLayer.length - lastStrokeLength

            strokePointer.layer = prevLayerIndex + 1
            strokePointer.stroke_id = prevLayer.strokes.length - 1
            console.log('layerLength:', prevLayer.length)
        } else {
            // undo current layer
            const currentLayer = layerStack[currentLayerIndex]
            strokePointer.stroke_id = prevStroke
            const layer = layerStack[strokePointer.layer - 1]
            const currentStrokeLength = layer.strokes[prevStroke].coordinates.length
            currentLayer.length = layerLength - currentStrokeLength
            console.log('layerLength:', currentLayer.length)
        }
        // redraw
        const canvasIndex = strokePointer.layer - 1
        const canvas = this.canvasList[canvasIndex]
        const stroke_id = strokePointer.stroke_id
        const layerData = layerStack[canvasIndex]
        if (stroke_id == 0) {
            canvas.setVisible(false)
        } else {
            canvas.clear()
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

        const nextStroke = strokePointer.stroke_id + 1
        const maxStroke = layerStack[strokePointer.layer - 1].strokes.length

        const maxLayer = layerStack.length
        const currentLayerIndex = strokePointer.layer - 1
        const nextLayerIndex = currentLayerIndex + 1

        // redo next layer
        if (nextStroke > maxStroke) {
            // Already at newest change
            if (nextLayerIndex == maxLayer) {
                console.log('newest change')
                return
            }
            strokePointer.layer = nextLayerIndex + 1
            strokePointer.stroke_id = 1
            const nextLayer = layerStack[nextLayerIndex]
            // layerlength will be next layers first stroke length
            nextLayer.length = nextLayer.strokes[0].coordinates.length
            console.log('layerLength:', nextLayer.length)
        } else {
            // redo current layer
            strokePointer.stroke_id = nextStroke
            const nextStrokeLength = layerStack[currentLayerIndex].strokes[nextStroke - 1].coordinates.length
            const currentLayer = layerStack[currentLayerIndex]
            // add length of next stroke in layerLength
            const layerLength = layerStack[currentLayerIndex].length
            currentLayer.length = layerLength + nextStrokeLength
            console.log('redo in same layer')
            console.log('layerLength:', currentLayer.length)
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
    placeStrokeAt(layer:number,stroke_id:number,p:point){
        const stroke = this.drawing[layer].strokes[stroke_id-1]
        const prevCenter = stroke.centerP
        stroke.centerP = p
        const shiftX = p.x - prevCenter.x
        const shiftY = p.y - prevCenter.y
        stroke.minP.x = stroke.minP.x + shiftX
        stroke.minP.y = stroke.minP.y + shiftY
        stroke.maxP.x = stroke.maxP.x + shiftX
        stroke.maxP.y  = stroke.maxP.y + shiftY
        this.redrawLayer(layer)
        // draw Strokes of that layer again

    }
    redrawLayer(layerIndex:number){
        const layerData = this.drawing[layerIndex]
        const canvas = this.canvasList[layerIndex]
        canvas.clear()
        if(this.strokePointer.layer==layerIndex+1){
            canvas.drawStrokes(0,this.strokePointer.stroke_id,layerData)
        }else{
            canvas.drawStrokes(0,layerData.strokes.length,layerData)

        }
    }
    select(p: point) {
        const canvasList = this.canvasList
        for (let i = canvasList.length - 1; i >= 0; i--) {
            if (canvasList[i].isVisible) {
                const canvasClass = canvasList[i]
                const uid = canvasClass.getStrokeId(p)
                if (uid) {
                    console.log('stroke found in layer ', i, ' stroke no', uid)
                    const layerData = this.drawing[i]
                    canvasClass.clear()
                    canvasClass.drawStrokes(0, uid - 1, layerData)
                    canvasClass.drawStrokes(uid, layerData.strokes.length, layerData)
                    return { 
                        'layer': i,
                        'stroke_id': uid,
                        'stroke': layerData.strokes[uid - 1] 
                    }
                } else {
                    console.log('cant find in ', i)
                }
            }
        }


    }

}
