import { Segment } from "../shapes/Segment";
import { Polygon } from '../shapes/Polygon';
import { Point } from '../shapes/Point';
import { Line } from "../shapes/Line";


export class GeometryUtils {

    /**
     * Creates a rectangular `Polyon` given two opposite sides of the rectangle as `Segment`s.
     */
    public static createRectangleFromTwoOppositeSides(side1: Segment, side2: Segment): Polygon {
        if (side2.getSlope() === new Segment(side1.points[1], side1.points[0]).getSlope()) {
            side1 = new Segment(side1.points[1], side1.points[0]);
        }

        if (side1.getSlope() !== side2.getSlope()) {
            throw new Error('Lines should be parallel.');
        }

        return new Polygon([
            side1.points[0],
            side1.points[1],
            side2.points[1],
            side2.points[0]
        ]);
    }

    /**
     * Creates a rectangular `Polygon` from a `Segment` via adding 'thickness' to it
     * on the `Segment`s normal direction
     */
     public static addThicknessToSegment(segment: Segment, thickness: number): Polygon {
        const bisectorLine = segment.getPerpendicularBisector();

        const [point1, point2] = bisectorLine.getSegmentWithCenterPointAndDistance(segment.getBoundingCenter(), thickness);

        const line1 = Line.createFromPointSlopeForm(point1, segment.getSlope());
        const [side1Point1, side1Point2] = line1.getSegmentWithCenterPointAndDistance(point1, segment.getLength() / 2);

        const line2 = Line.createFromPointSlopeForm(point2, segment.getSlope());
        const [side2Point1, side2Point2] = line2.getSegmentWithCenterPointAndDistance(point2, segment.getLength() / 2);

        return GeometryUtils.createRectangleFromTwoOppositeSides(new Segment(side1Point1, side1Point2), new Segment(side2Point1, side2Point2));
     }
}
