import { BaseStroke } from "./BaseStroke";

export class Shapes extends BaseStroke {
    data: Rectangle | Circle

    constructor(
        baseStroke: BaseType,
        type: 'Rectangle' | 'Circle'
    ) {
        super(baseStroke);
        switch (type) {
            case "Rectangle":
                this.data = { type: "Rectangle", width: 0, height: 0 }
                break
            case "Circle":
                this.data = { type: "Circle", radius: 0 }
                break
        }
    }
}

