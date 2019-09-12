import { Segment } from "../shapes/Segment";
import { Polygon } from '../shapes/Polygon';
import { Point } from '../shapes/Point';
import { Line } from "../shapes/Line";
import _ from "lodash";


export function toRadian(degree: number) {
    return degree * Math.PI / 180;
 }

export function toDegree(radian: number) {
    return radian * 180 / Math.PI;
}

export class GeometryUtils {

    /**
     * Creates a rectangular `Polyon` given two opposite sides of the rectangle as `Segment`s.
     */
    public static createRectangleFromTwoOppositeSides(side1: Segment, side2: Segment): Polygon {

        if (side1.getPoints()[0].distanceTo(side2.getPoints()[0]) < side1.getPoints()[0].distanceTo(side2.getPoints()[1])) {
            side2 = new Segment(side2.getPoints()[1], side2.getPoints()[0]);
        }

        return new Polygon([
            side1.getPoints()[0],
            side1.getPoints()[1],
            side2.getPoints()[0],
            side2.getPoints()[1],
        ]);
    }

    /**
     * Creates a rectangular `Polygon` from a `Segment` via adding 'thickness' to it
     * on the `Segment`s normal direction
     */
     public static addThicknessToSegment(segment: Segment, thickness: number): Polygon {
        const bisectorLine = segment.getPerpendicularBisector();

        const [point1, point2] = bisectorLine.getSegmentWithCenterPointAndDistance(segment.getBoundingCenter(), thickness);

        const line1 = Line.fromPointSlopeForm(point1, segment.getSlope());
        const [side1Point1, side1Point2] = line1.getSegmentWithCenterPointAndDistance(point1, segment.getLength() / 2);

        const line2 = Line.fromPointSlopeForm(point2, segment.getSlope());
        const [side2Point1, side2Point2] = line2.getSegmentWithCenterPointAndDistance(point2, segment.getLength() / 2);

        return GeometryUtils.createRectangleFromTwoOppositeSides(new Segment(side1Point1, side1Point2), new Segment(side2Point1, side2Point2));
     }
}
