import { Segment } from "../shapes/Segment";
import { Point } from "../shapes/Point";
import { GeometryUtils } from "./GeometryUtils";
import { expect } from "chai";
import { Polygon } from '../shapes/Polygon';


describe(`GeometryUtils`, () => {
    describe(`createRectangleFromTwoOppositeSides`, () => {
        it ('creates a rectangle based on the given segments', () => {
            const segment1 = new Segment(new Point(1, 1), new Point(2, 2));
            const segment2 = new Segment(new Point(3, 1), new Point(4, 2));

            const rectangle = GeometryUtils.createRectangleFromTwoOppositeSides(segment1, segment2);
            expect(rectangle).to.eql(new Polygon([
                new Point(1, 1),
                new Point(2, 2),
                new Point(4, 2),
                new Point(3, 1)
            ]));
        });
    });

    describe(`addThicknessToSegment`, () => {
        it ('creates a rectangular `Polygon` via adding thickness to a `Segment` 2', () => {
            const segment = new Segment(new Point(1, 1), new Point(3, 3));
            const rectangle = GeometryUtils.addThicknessToSegment(segment, Math.SQRT2);
            expect(rectangle).to.eql(new Polygon([
                new Point(2, 0),
                new Point(4, 2),
                new Point(2, 4),
                new Point(0, 2),
            ]));
        });
    });

    describe('`orderPointsToStartAtBottomLeft`', () => {
        it ('orders a list of points so that the relative order of the points remain, but the first point will be the bottom left', () => {
            const points = [
                new Point(5, 5),
                new Point(5, 3),
                new Point(4, 3),
                new Point(4, 2),
                new Point(1, 2),
                new Point(1, 5)
            ];

            expect(GeometryUtils.orderPointsToStartAtBottomLeft(points)).to.eql([
                new Point(1, 2),
                new Point(1, 5),
                new Point(5, 5),
                new Point(5, 3),
                new Point(4, 3),
                new Point(4, 2)
            ]);
        });
    });

    describe(`mergePolygonsIfHaveCommonEdges`, () => {
        it ('merges the two Polygon if they have a common edge', () => {
            const polygon1 = Polygon.createRectangle(0, 0, 2, 3);
            const polygon2 = Polygon.createRectangle(0, 3, 2, 2);
            expect(GeometryUtils.mergePolygonsIfHaveCommonEdges(polygon1, polygon2).equalTo(Polygon.createRectangle(0, 0, 2, 5))).to.be.true;
        });
    });
});
