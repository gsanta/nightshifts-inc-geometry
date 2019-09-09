import { Polygon } from "./Polygon";
import { Shape } from "./Shape";


export class RectangleView {

    constructor(polygon: Polygon) {

    }

    getWidth() {

    }

    getHeight() {

    }

    private checkIfRectangle(shape: Shape) {
        const points = shape.getPoints();

        if (points.length !== 4) {
            this.throwNonRectangleError();
        }

        const [side1, side2, side3, side4] = shape.getEdges();

        if (side1.getLength() !== side3.getLength() || side2.getLength() !== side4.getLength()) {
            this.throwNonRectangleError();
        }

        const angle1 = Mea
    }

    private throwNonRectangleError() {
        throw new Error(`RectangleView can not be used with a non-rectangle shape: ${shape.toString()}`);
    }
}