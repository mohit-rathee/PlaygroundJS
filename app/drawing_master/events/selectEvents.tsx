import { Stroke, ToolRefs } from "../types";
import { EditShapes } from "./editEvents/shapes";
import { EventClass } from "./eventClass";


export class SelectEventClass extends EventClass {
    public strokeInfo: StrokePointer;
    public editClass: EditShapes | null;
    private stroke: Stroke | null;

    constructor(
        toolRef: ToolRefs,
    ) {
        super(toolRef)

        this.editClass = null
        this.stroke = null
        this.strokeInfo = {
            layer: 0,
            stroke_id: 0,
        }
        //constructor
        console.log('adding SelectEventClass')
        this.canvasClass.pCanvas.addEventListener('mousedown', this.selectEvent)
    }

    //deConstructor
    deConstructor() {
        if (this.editClass) {
            this.drawing.current?.placeStrokeAt(this.strokeInfo)
            this.editClass.deConstructor()
            this.editClass = null
        } else {
            console.log('removing SelectEventClass')
            this.canvasClass.pCanvas.removeEventListener('mousedown', this.selectEvent)
        }
    }
    reload() {
        if (!this.editClass) return
        const lineColor = this.lineColorRef.current
        const fillColor = this.fillColorRef.current
        const lineWidth = this.lineWidthRef.current
        const isFill = this.isFillRef.current
        this.editClass.reload(lineColor, fillColor, lineWidth, isFill)
    }
    selectEvent = (e: MouseEvent) => {
        e.preventDefault()
        console.log('selectEvent Clicked')
        this.canvasClass?.clearCanvas()
        if (this.stroke) {
            this.drawing.current?.placeStrokeAt(this.strokeInfo)
            console.log('adding event listner')
            this.canvasClass.pCanvas.addEventListener('mousedown', this.selectEvent)
            this.stroke = null
        }
        if (this.editClass) {
            this.editClass.deConstructor()
            this.editClass = null
        }
        const pos: point = { x: e.clientX, y: e.clientY }
        const selectedStroke = this.drawing.current?.select(pos)
        if (!selectedStroke) {
            console.log('notfound');
            return;
        }
        const [strokeInfo, stroke] = selectedStroke
        this.strokeInfo = strokeInfo
        this.stroke = stroke

        this.canvasClass.clearCanvas()
        // this.canvasClass.pCanvas.removeEventListener('mousedown', this.selectEvent)
        //SelectEventClass is only a vessel for EditClass
        this.deConstructor()
        this.editClass = new EditShapes(this.canvasClass, stroke, e, this.selectEvent)
        // switch (stroke.type) {
        //     case "Rectangle":
        //         this.editClass = new EditShapes(this.canvasClass, stroke, e, this.selectEvent)
        //         break
        //     case "Circle":
        //         this.editClass = new EditShapes(this.canvasClass, stroke, e, this.selectEvent)
        //         break
        //     case "Polygon":
        //         this.editClass = new EditShapes(this.canvasClass, stroke, e, this.selectEvent)
        //         break
        //     case "FreeForm":
        //         this.editClass = new EditShapes(this.canvasClass, stroke, e, this.selectEvent)
        //         break
        //     case "CatmullRom":
        //         this.editClass = new EditShapes(this.canvasClass, stroke, e, this.selectEvent)
        //         break
        //     default:
        //         throw new Error('edit class not defined yet')
        // }
    }

}
