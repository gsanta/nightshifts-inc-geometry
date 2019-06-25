import { Point } from "../shapes/Point";

export class MeasurementUtils {

    public static isDistanceSmallerThanOneUnit(point1: Point, point2: Point) {
        return point1.distanceTo(point2) <= 1;
    }
}