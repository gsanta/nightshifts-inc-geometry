import { GeometryService } from '../GeometryService';
import { Shape } from "./Shape";
import { toRadian } from '../utils/Measurements';


export class RectangleView {
    private geometryService: GeometryService;

    constructor(shape: Shape, geometryService: GeometryService) {
        this.geometryService = geometryService;

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
            this.geometryService.factory.angleFromTwoLines(side1.getLine(), side2.getLine()),
            this.geometryService.factory.angleFromTwoLines(side2.getLine(), side3.getLine()),
            this.geometryService.factory.angleFromTwoLines(side2.getLine(), side3.getLine()),
            this.geometryService.factory.angleFromTwoLines(side4.getLine(), side1.getLine()),
        ];

        const isEveryAngle90Deg = angles.every(angle => this.geometryService.measuerments.angleToBe(angle, toRadian(90)))

        if (!isEveryAngle90Deg) {
            this.throwNonRectangleError(shape);
        }
    }

    private throwNonRectangleError(shape: Shape) {
        throw new Error(`RectangleView can not be used with a non-rectangle shape: ${shape.toString()}`);
    }
}