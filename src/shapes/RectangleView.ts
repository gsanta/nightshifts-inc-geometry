import { Polygon } from "./Polygon";
import { Shape } from "./Shape";
import { Measurements } from '../utils/Measurements';
import { Angle } from "./Angle";
import { toRadian } from "../utils/GeometryUtils";


export class RectangleView {
    private measurements: Measurements;

    constructor(shape: Shape, measurements = new Measurements()) {
        this.measurements = measurements;

        this.checkIfRectangle(shape);
    }

    getWidth() {

    }

    getHeight() {

    }

    private checkIfRectangle(shape: Shape) {
        const points = shape.getPoints();

        if (points.length !== 4) {
            this.throwNonRectangleError(shape);
        }

        const [side1, side2, side3, side4] = shape.getEdges();

        const angles = [
            Angle.fromTwoLines(side1.getLine(), side2.getLine()),
            Angle.fromTwoLines(side2.getLine(), side3.getLine()),
            Angle.fromTwoLines(side2.getLine(), side3.getLine()),
            Angle.fromTwoLines(side4.getLine(), side1.getLine()),
        ];

        const isEveryAngle90Deg = angles.every(angle => this.measurements.angleToBe(angle, toRadian(90)))

        if (!isEveryAngle90Deg) {
            this.throwNonRectangleError(shape);
        }
    }

    private throwNonRectangleError(shape: Shape) {
        throw new Error(`RectangleView can not be used with a non-rectangle shape: ${shape.toString()}`);
    }
}