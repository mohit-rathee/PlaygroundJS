import { BaseStroke } from "./BaseStroke";

export class Pencil extends BaseStroke {
    points: point[];
    style: "FreeForm" | "CatmullRom" | "Polygon";

    constructor(
        baseStroke: BaseType,
        type: "FreeForm" | "CatmullRom" | "Polygon",
        points: point[]
    ) {
        super(baseStroke);
        this.style = type
        this.points = points;
    }
}
