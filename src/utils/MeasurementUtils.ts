import { Point } from "../shapes/Point";

export class MeasurementUtils {
    // TODO: rename to smth like "closeTo" so that the exact distance is not mentioned in the name
    public static isDistanceSmallerThan(point1: Point, point2: Point, unit = 0.5) {
        return point1.distanceTo(point2) <= unit;
    }
}