import { CanvasClass } from "../../lib/CanvasClass";
import { Shapes } from "../../lib/Strokes/Shapes";
import { Stroke } from "../../types";
import { intToRGBColor } from "../../utils/magic_functions";


export class EditShapes {
    public canvasClass: CanvasClass;
    public stroke: Stroke;
    private selectPos: point;
    private selectedPoint: number;
    private selectAnother: (e: MouseEvent) => void;

    constructor(
        canvasClass: CanvasClass,
        stroke: Stroke,
        e: MouseEvent,
        selectAnother: (e: MouseEvent) => void
    ) {
        this.canvasClass = canvasClass
        this.selectPos = e
        this.selectedPoint = NaN
        this.stroke = stroke
        this.selectAnother = selectAnother
        console.log('adding edit shapes events')
        this.canvasClass.clearCanvas()
        this.canvasClass.drawStroke(this.stroke)
        this.drawGizmo(this.stroke)

        this.canvasClass.pCanvas.addEventListener('mousedown', this.selectShapeEvent)
        this.selectShapeEvent(e, true)//can specify to drag stroke as an arg
    }
    selectShapeEvent = (e: MouseEvent, toDrag = false) => { //
        console.log('selectShapeEvent clicked')
        const pos: point = { x: e.clientX, y: e.clientY }
        const int = this.canvasClass.getINT(pos)
        if (isNaN(int)) {
            console.log('Selecting another from shapes')
            this.selectAnother(e)
            return
        }
        e.preventDefault()
        this.setOnTop(true)
        this.selectedPoint = int
        console.log(this.selectedPoint)
        this.selectPos = pos
        this.canvasClass?.pCanvas.addEventListener('mousemove', this.dragEvent)
        this.canvasClass?.pCanvas.removeEventListener('mousedown', this.selectShapeEvent)
        this.canvasClass?.pCanvas.addEventListener('mouseup', this.placeEvent)
    }

    deConstructor = () => {
        //only to be called by selectEventClass
        console.log('removing edit shapes events')
        this.canvasClass.clearCanvas()
        this.canvasClass.pCanvas.removeEventListener('mousedown', this.selectShapeEvent)
        this.canvasClass.pCanvas.removeEventListener('mousemove', this.dragEvent)
        this.canvasClass.pCanvas.removeEventListener('mouseup', this.placeEvent)
    }
    reload(
        lineColor: string,
        fillColor: string,
        lineWidth: number,
        isFill: boolean
    ) {
        this.stroke.lineColor = lineColor
        this.stroke.lineWidth = lineWidth
        this.stroke.fillColor = fillColor
        this.stroke.isFill = isFill
        this.canvasClass.clearCanvas()
        this.canvasClass.drawStroke(this.stroke)
        this.drawGizmo(this.stroke)
    };
    setOnTop(bool: boolean) {
            if (bool) {
                this.canvasClass.pCanvas.style.zIndex = '100'
                this.canvasClass.pContext.globalAlpha = 0.8
            } else {
                this.canvasClass.pCanvas.style.zIndex = '0'
                this.canvasClass.pContext.globalAlpha = 1
            }
    }


    dragEvent = (e: MouseEvent) => {
        const pos: point = { 'x': e.clientX, 'y': e.clientY }
        if (!this.stroke) throw new Error('stroke is null')
        const gap = this.getGap(pos)
        switch (this.selectedPoint) {
            // 0: "Drag",
            case 0:
                this.stroke.centerP.x += gap.x
                this.stroke.centerP.y += gap.y
                break
            // 1: "center",
            case 1:
                this.stroke.centerP.x += gap.x
                this.stroke.centerP.y += gap.y
                break
            // 2: "TopLeftC",
            case 2:
                this.stroke.scaleX -= gap.x / 100
                this.stroke.scaleY -= gap.y / 100
                break
            // 3: "BottomRightC",
            case 3:
                this.stroke.scaleX += gap.x / 100
                this.stroke.scaleY += gap.y / 100
                break
            // 4: "BottomLeftC",
            case 4:
                this.stroke.scaleX -= gap.x / 100
                this.stroke.scaleY += gap.y / 100
                break
            // 5: "TopRightC",
            case 5:
                this.stroke.scaleX += gap.x / 100
                this.stroke.scaleY -= gap.y / 100
                break
            // 6: "LeftS",
            case 6:
                this.stroke.scaleX -= gap.x / 100
                // this.stroke.centerP.x += gap.x /2
                break
            // 7: "RightS",
            case 7:
                this.stroke.scaleX += gap.x / 100
                // this.stroke.centerP.x -= gap.x /2
                break
            // 8: "TopS",
            case 8:
                this.stroke.scaleY -= gap.y / 100
                // this.stroke.centerP.y += gap.y /2
                break
            // 9: "BottomS" }
            case 9:
                this.stroke.scaleY += gap.y / 100
                // this.stroke.centerP.y += gap.y /2
                break
        }
        this.canvasClass.clearCanvas()
        this.canvasClass.drawStroke(this.stroke)
        this.drawGizmo(this.stroke)

    }

    placeEvent = () => {
        // if (!this.stroke) return
        // const pos: point = { 'x': e.clientX, 'y': e.clientY }
        // this.stroke.centerP = this.getNewCenterP(pos)
        // this.drawing.current?.placeStrokeAt(this.strokeInfo)
        //
        this.setOnTop(false)
        this.canvasClass.clearCanvas()
        this.canvasClass.drawStroke(this.stroke)
        this.drawGizmo(this.stroke)
        this.selectedPoint = NaN
        this.canvasClass?.pCanvas.removeEventListener('mousemove', this.dragEvent)
        this.canvasClass?.pCanvas.removeEventListener('mouseup', this.placeEvent)
        this.canvasClass?.pCanvas.addEventListener('mousedown', this.selectShapeEvent)
    }

    getGap(p: point): point {
        const gap = { x: p.x - this.selectPos.x, y: p.y - this.selectPos.y }
        this.selectPos = p
        return gap
    }
    drawGizmo(stroke: Stroke) {
        if (!this.stroke) return
        const pCtx = this.canvasClass.pContext
        const rCtx = this.canvasClass.rContext
        pCtx.save()
        rCtx.save()
        pCtx.setLineDash([5, 5])

        // Draw the rectangle
        pCtx.beginPath()
        rCtx.beginPath()

        pCtx.translate(stroke.centerP.x, stroke.centerP.y)
        rCtx.translate(stroke.centerP.x, stroke.centerP.y)

        pCtx.scale(stroke.scaleX, stroke.scaleY)
        rCtx.scale(stroke.scaleX, stroke.scaleY)

        const cornerP = stroke.cornerP
        const width = Math.abs(2 * cornerP.x) + 20
        const height = Math.abs(2 * cornerP.y) + 20
        pCtx.rect(cornerP.x - 10, cornerP.y - 10, width, height)
        rCtx.rect(cornerP.x - 10, cornerP.y - 10, width, height)
        pCtx.strokeStyle = 'darkgray'
        const uniqueColor = intToRGBColor(0)
        rCtx.strokeStyle = uniqueColor
        rCtx.fillStyle = uniqueColor
        pCtx.fillStyle = '#d3d5d74f'
        pCtx.lineWidth = 2
        rCtx.lineWidth = 2
        pCtx.scale(1/this.stroke.scaleX,1/this.stroke.scaleY)
        rCtx.scale(1/this.stroke.scaleX,1/this.stroke.scaleY)
        pCtx.stroke()
        rCtx.stroke()
        pCtx.fill()
        rCtx.fill()

        this.drawImpPoints()

        pCtx.restore()
        rCtx.restore()
    }
    drawImpPoints() {
        const impPoints = this.stroke.getImpPoints(10)
        for (let i = 0; i < impPoints.length; i++) {
            const p = impPoints[i];
            const scaledP = { x: p.x * this.stroke.scaleX, y: p.y * this.stroke.scaleY }
            // const radius = Math.min(Math.max(this.stroke.lineWidth+1, 4), 6)
            const radius = 8
            this.canvasClass.drawDotonR(scaledP, radius + 1, intToRGBColor(i + 1))
            this.canvasClass.drawDotonP(scaledP, radius + 1, 'white')
            this.canvasClass.drawDotonP(scaledP, radius, 'green')
        }
    }

}
