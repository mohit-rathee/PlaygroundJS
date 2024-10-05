export class BaseStroke {
    uid: number;
    lineColor: string;
    lineWidth: number;
    fillColor: string;
    isFill: boolean;
    cornerP: point;
    centerP: point;
    scaleX: number;
    scaleY: number

    constructor(baseStroke: BaseType) {
        this.uid = baseStroke.uid;
        this.lineColor = baseStroke.lineColor;
        this.lineWidth = baseStroke.lineWidth;
        this.fillColor = baseStroke.fillColor;
        this.isFill = baseStroke.isFill;
        this.cornerP = baseStroke.cornerP;
        this.centerP = baseStroke.centerP;
        this.scaleX = 1
        this.scaleY = 1
    }

    getImpPoints(offset = 0): point[] {
        const center = { x: 0, y: 0 };
        const TopLeftC = { x: this.cornerP.x - offset, y: this.cornerP.y - offset };
        const BottomRightC = { x: -TopLeftC.x, y: -TopLeftC.y }
        const BottomLeftC = { x: TopLeftC.x, y: -TopLeftC.y }
        const TopRightC = { x: -TopLeftC.x, y: TopLeftC.y }
        const LeftS = { x: TopLeftC.x, y: 0 }
        const RightS = { x: -TopLeftC.x, y: 0 }
        const TopS = { x: 0, y: TopLeftC.y }
        const BottomS = { x: 0, y: -TopLeftC.y }

        const impPoints = [
            center,
            TopLeftC,
            BottomRightC,
            BottomLeftC,
            TopRightC,
            LeftS,
            RightS,
            TopS,
            BottomS
        ]
        return impPoints
    }
}
