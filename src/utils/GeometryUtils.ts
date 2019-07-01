import { Segment } from "../shapes/Segment";
import { Polygon } from '../shapes/Polygon';
import { Point } from '../shapes/Point';
import { Line } from "../shapes/Line";
import _ from "lodash";


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

        const line1 = Line.createFromPointSlopeForm(point1, segment.getSlope());
        const [side1Point1, side1Point2] = line1.getSegmentWithCenterPointAndDistance(point1, segment.getLength() / 2);

        const line2 = Line.createFromPointSlopeForm(point2, segment.getSlope());
        const [side2Point1, side2Point2] = line2.getSegmentWithCenterPointAndDistance(point2, segment.getLength() / 2);

        return GeometryUtils.createRectangleFromTwoOppositeSides(new Segment(side1Point1, side1Point2), new Segment(side2Point1, side2Point2));
     }

     public static toRadian(degree: number) {
        return degree * Math.PI / 180;
     }

     public static toDegree(radian: number) {
        return radian * 180 / Math.PI;
     }

     public static orderPointsToStartAtBottomLeft = (points: Point[]) => {
        const minY = _.minBy(points, point => point.y).y;

        const bottomLeftPoint = _.chain(points)
            .filter(point => point.y === minY)
            .minBy(point => point.x)
            .value();

        while (!points[0].equalTo(bottomLeftPoint)) {
            points.push(points.shift());
        }

        return points;
    }

    public static mergePolygonsIfHaveCommonEdges(polygon1: Polygon, polygon2: Polygon): Polygon | undefined {
        const edges1 = polygon1.getEdges();
        const edges2 = polygon2.getEdges();

        let commonEdge: Segment;
        for (let i = 0; i < edges1.length; i++) {
            for (let j = 0; j < edges2.length; j++) {
                if (this.isCommonEdge(edges1[i], edges2[j])) {
                    commonEdge = edges1[i];
                    break;
                }
            }
        }

        if (commonEdge) {
            const orderedPoints1 = this.orderPolygonPointSoThatTheArrayStartsAndEndsWithEdge(polygon1, commonEdge);
            const orderedPoints2 = this.orderPolygonPointSoThatTheArrayStartsAndEndsWithEdge(polygon2, commonEdge);

            orderedPoints2.pop();
            orderedPoints2.shift();

            if (polygon1.getIndexOf(orderedPoints1[0]) === 0) {
                orderedPoints2.push(...orderedPoints1);
            } else {
                orderedPoints2.unshift(...orderedPoints1);
            }

            return new Polygon(orderedPoints2).removeStraightVertices();
        }

        return undefined;
    }

    private static isCommonEdge(segment1: Segment, segment2: Segment): boolean {
        return segment1.getLine().hasEqualSlope(segment2.getLine()) &&
            segment1.getBoundingCenter().distanceTo(segment2.getBoundingCenter()) <= 2;
    }

    private static orderPolygonPointSoThatTheArrayStartsAndEndsWithEdge(polygon: Polygon, edge: Segment): Point[] {
        let index_1 = polygon.getOrderedIndex(edge.getPoints()[0]);
        let index_2 = polygon.getOrderedIndex(edge.getPoints()[1]);
        const points = [...polygon.getPoints()];

        if (index_1 > index_2) {
            [index_1, index_2] = [index_2, index_1];
        }
        let newPoints: Point[] = [];

        if (index_1 === 0 && index_2 === polygon.getPoints().length - 1) {
            newPoints = points;
        } else {
            newPoints.push(...[...points].slice(index_2));
            newPoints.push(...[...points].slice(0, index_2));
        }

        return newPoints;
    }
}
