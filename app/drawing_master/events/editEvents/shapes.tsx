import { CanvasClass } from "../../lib/CanvasClass";
import { intToRGBColor } from "../../utils/magic_functions";
export class EditShapes {
    public canvasClass: CanvasClass;
    public stroke: Rectangle | Circle | Polygon | FreeForm | CatmullRom;
    private selectPos: point;
    private selectedPoint: number;
    private selectAnother: (e: MouseEvent) => void;

    constructor(
        canvasClass: CanvasClass,
        stroke: Rectangle | Circle | Polygon | FreeForm | CatmullRom,
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
        this.selectShapeEvent(e)
    }
    selectShapeEvent = (e: MouseEvent) => { //
        console.log('selectShapeEvent clicked')
        const pos: point = { x: e.clientX, y: e.clientY }
        const uid = this.canvasClass.getUID(pos)
        if (isNaN(uid)) {
            console.log('Selecting another from shapes')
            this.selectAnother(e)
            return
        }
        e.preventDefault()
        this.setOnTop(true)
        this.selectedPoint = uid
        this.selectPos = pos
        this.canvasClass.clearCanvas()
        this.canvasClass.drawStroke(this.stroke)
        this.drawGizmo(this.stroke)
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
        requestAnimationFrame(() => {
            if (bool) {
                this.canvasClass.pCanvas.style.zIndex = '100'
            } else {
                this.canvasClass.pCanvas.style.zIndex = '0'
            }
        })
    }


    dragEvent = (e: MouseEvent) => {
        const pos: point = { 'x': e.clientX, 'y': e.clientY }
        if (!this.stroke) throw new Error('stroke is null')
        if (this.selectedPoint == 0) {
            const newCenterP = this.getNewCenterP(pos)
            this.stroke.centerP = newCenterP
            this.canvasClass.clearCanvas()
            this.canvasClass.drawStroke(this.stroke)
            this.drawGizmo(this.stroke)
        }

    }

    placeEvent = () => {
        // if (!this.stroke) return
        // const pos: point = { 'x': e.clientX, 'y': e.clientY }
        // this.stroke.centerP = this.getNewCenterP(pos)
        // this.drawing.current?.placeStrokeAt(this.strokeInfo)
        //
        this.selectedPoint = NaN
        this.setOnTop(false)
        this.canvasClass?.pCanvas.removeEventListener('mousemove', this.dragEvent)
        this.canvasClass?.pCanvas.removeEventListener('mouseup', this.placeEvent)
        this.canvasClass?.pCanvas.addEventListener('mousedown', this.selectShapeEvent)
    }

    getNewCenterP(p: point): point {
        if (!this.stroke) throw new Error('stroke is null')
        const centerP = this.stroke.centerP
        const gap = { x: p.x - this.selectPos.x, y: p.y - this.selectPos.y }
        this.selectPos = p
        return { x: centerP.x + gap.x, y: centerP.y + gap.y }
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

        const cornerP = stroke.cornerP
        const width = Math.abs(2 * cornerP.x) + 20
        const height = Math.abs(2 * cornerP.y) + 20
        pCtx.rect(cornerP.x - 10, cornerP.y - 10, width, height)
        rCtx.rect(cornerP.x - 10, cornerP.y - 10, width, height)
        pCtx.strokeStyle = 'darkgray'
        const uniqueColor = intToRGBColor(0)
        rCtx.strokeStyle = uniqueColor
        rCtx.fillStyle = uniqueColor
        pCtx.lineWidth = 2
        rCtx.lineWidth = 2
        pCtx.stroke()
        rCtx.stroke()
        rCtx.fill()
        pCtx.restore()
        rCtx.restore()
    }

}
