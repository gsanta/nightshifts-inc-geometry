import { Segment } from "../../src/shapes/Segment";
import { Point } from "../../src/shapes/Point";
import { Polygon } from '../../src/shapes/Polygon';
import { Line } from "../../src/shapes/Line";
import { GeometryService } from '../../src/GeometryService';


describe('`Segment`', () => {
    const geometryService = new GeometryService();

    describe('`isPointOnTheLine`', () => {
        it ('returns true if the given `Point` lines on the line.', () => {
            const line = geometryService.factory.edge(geometryService.factory.point(1, 2), geometryService.factory.point(5, 6));

            expect(line.isPointOnTheLine(geometryService.factory.point(3, 4))).toBeTruthy();
        });

        it ('returns true even if the given `Point` lies outside of the `Segment` segment, but on the `infinite` line the segment determines.', () => {
            const line = geometryService.factory.edge(geometryService.factory.point(1, 2), geometryService.factory.point(5, 6));

            expect(line.isPointOnTheLine(geometryService.factory.point(-2, -1))).toBeTruthy();
        });

        it ('can handle vertical lines where slope is undefined.', () => {
            const line = geometryService.factory.edge(geometryService.factory.point(1, 2), geometryService.factory.point(1, 5));

            expect(line.isPointOnTheLine(geometryService.factory.point(1, 3))).toBeTruthy();
        });

        it ('returns false if the given `Point` does not lie on the line.', () => {
            const line = geometryService.factory.edge(geometryService.factory.point(1, 2), geometryService.factory.point(5, 6));

            expect(line.isPointOnTheLine(geometryService.factory.point(2, 2))).toBeFalsy();
        });
    });

    describe('`isCoincidentToLine`', () => {
        it ('returns true if the two `Segment` segments determine the same infinite line.', () => {
            const line1 = geometryService.factory.edge(geometryService.factory.point(1, 1), geometryService.factory.point(2, 1));
            const line2 = geometryService.factory.edge(geometryService.factory.point(4, 1), geometryService.factory.point(5, 1));

            expect(line1.isCoincidentToLine(line2)).toBeTruthy();
        });

        it ('returns false if the two `Segment` segments do noet determine the same infinite line.', () => {
            const line1 = geometryService.factory.edge(geometryService.factory.point(1, 1), geometryService.factory.point(2, 1));
            const line2 = geometryService.factory.edge(geometryService.factory.point(4, 1), geometryService.factory.point(5, 2));

            expect(line1.isCoincidentToLine(line2)).toBeFalsy();
        });
    });

    describe(`getPerpendicularBisector`, () => {
        it ('returns with the `Line` representing the perpendicular bisector', () => {
            const segment = geometryService.factory.edge(geometryService.factory.point(1, 1), geometryService.factory.point(3, 3));

            expect(segment.getPerpendicularBisector()).toEqual(geometryService.factory.lineFromPointSlopeForm(geometryService.factory.point(0, 4), -1));

            const verticalSegment = geometryService.factory.edge(geometryService.factory.point(1, 1), geometryService.factory.point(1, 3));
            expect(verticalSegment.getPerpendicularBisector()).toEqual(geometryService.factory.lineFromPointSlopeForm(geometryService.factory.point(0, 2), 0));

            const horizontalSegment = geometryService.factory.edge(geometryService.factory.point(1, 1), geometryService.factory.point(3, 1));
            expect(horizontalSegment.getPerpendicularBisector()).toEqual(geometryService.factory.lineFromPointSlopeForm(geometryService.factory.point(2, 0), undefined));
        });
    });

    describe('`getCoincidentLineSegment`', () => {
        it ('returns the overlap `Segment` segment when line1 extends line2 in both ends.', () => {
            const line1 = geometryService.factory.edge(geometryService.factory.point(1, 2), geometryService.factory.point(7, 8));
            const line2 = geometryService.factory.edge(geometryService.factory.point(3, 4), geometryService.factory.point(5, 6));

            expect(line1.getCoincidentLineSegment(line2)).toEqual([geometryService.factory.edge(geometryService.factory.point(3, 4), geometryService.factory.point(5, 6)), 0, 0]);
        });

        it ('returns the overlap `Segment` segment when line2 extends line1 in both ends.', () => {
            const line1 = geometryService.factory.edge(geometryService.factory.point(3, 4), geometryService.factory.point(5, 6));
            const line2 = geometryService.factory.edge(geometryService.factory.point(1, 2), geometryService.factory.point(7, 8));

            expect(line1.getCoincidentLineSegment(line2)).toEqual([geometryService.factory.edge(geometryService.factory.point(3, 4), geometryService.factory.point(5, 6)), 0, 0]);
        });

        it ('returns the overlap `Segment` segment when the two lines overlap and line1 starts at smaller x coordinate.', () => {
            const line1 = geometryService.factory.edge(geometryService.factory.point(1, 2), geometryService.factory.point(5, 6));
            const line2 = geometryService.factory.edge(geometryService.factory.point(3, 4), geometryService.factory.point(7, 8));

            expect(line1.getCoincidentLineSegment(line2)).toEqual([geometryService.factory.edge(geometryService.factory.point(3, 4), geometryService.factory.point(5, 6)), 0, 0]);
        });

        it ('returns the overlap `Segment` segment when the two lines are identical.', () => {
            const line1 = geometryService.factory.edge(geometryService.factory.point(1, 2), geometryService.factory.point(5, 6));
            const line2 = geometryService.factory.edge(geometryService.factory.point(1, 2), geometryService.factory.point(5, 6));

            expect(line1.getCoincidentLineSegment(line2)).toEqual([geometryService.factory.edge(geometryService.factory.point(1, 2), geometryService.factory.point(5, 6)), 0, 0]);
        });

        it ('returns the overlap `Segment` segment when the two lines overlap and line2 starts at smaller x coordinate.', () => {
            const line1 = geometryService.factory.edge(geometryService.factory.point(3, 4), geometryService.factory.point(7, 8));
            const line2 = geometryService.factory.edge(geometryService.factory.point(1, 2), geometryService.factory.point(5, 6));

            expect(line1.getCoincidentLineSegment(line2)).toEqual([geometryService.factory.edge(geometryService.factory.point(3, 4), geometryService.factory.point(5, 6)), 0, 0]);
        });

        it ('returns undefined when the two lines do not overlap.', () => {
            const line1 = geometryService.factory.edge(geometryService.factory.point(1, 2), geometryService.factory.point(3, 4));
            const line2 = geometryService.factory.edge(geometryService.factory.point(5, 6), geometryService.factory.point(7, 8));

            expect(line1.getCoincidentLineSegment(line2)).toEqual(undefined);
        });

        it ('works well also when the lines are vertical.', () => {
            const line1 = geometryService.factory.edge(geometryService.factory.point(1, 4), geometryService.factory.point(1, 0));
            const line2 = geometryService.factory.edge(geometryService.factory.point(1, 1), geometryService.factory.point(1, 3));

            expect(line1.getCoincidentLineSegment(line2)).toEqual([geometryService.factory.edge(geometryService.factory.point(1, 1), geometryService.factory.point(1, 3)), 0, 0]);
        });
    });

    describe ('equalTo', () => {
        it ('returns true if the two lines have equal endpoints', () => {
            const line1 = geometryService.factory.edge(geometryService.factory.point(1, 2), geometryService.factory.point(3, 4));
            const line2 = geometryService.factory.edge(geometryService.factory.point(1, 2), geometryService.factory.point(3, 4));

            expect(line1.equalTo(line2)).toBeTruthy();
        });

        it ('returns true if the two lines are equal but the endpoints are given in reverse order', () => {
            const line1 = geometryService.factory.edge(geometryService.factory.point(1, 2), geometryService.factory.point(3, 4));
            const line2 = geometryService.factory.edge(geometryService.factory.point(3, 4), geometryService.factory.point(1, 2));

            expect(line1.equalTo(line2)).toBeTruthy();
        });
    });

    describe(`scale`, () => {
        it ('scales the two endpoints of the `Segment` by the given x', () => {
            const line = geometryService.factory.edge(geometryService.factory.point(1, 2), geometryService.factory.point(3, 4));
            const scaledLine = geometryService.factory.edge(geometryService.factory.point(3, 2), geometryService.factory.point(9, 4));

            expect(line.scale(geometryService.factory.point(3, 0)).equalTo(scaledLine));
        });

        it ('scales the two endpoints of the `Segment` by the given y', () => {
            const line = geometryService.factory.edge(geometryService.factory.point(1, 2), geometryService.factory.point(3, 4));
            const scaledLine = geometryService.factory.edge(geometryService.factory.point(1, 6), geometryService.factory.point(3, 12));

            expect(line.scale(geometryService.factory.point(0, 3)).equalTo(scaledLine));
        });
    });

    describe('scaleY', () => {
    });

    describe('getLength', () => {
        it ('calculates the distance between `start` and `end` of `Segment`', () => {
            const line = geometryService.factory.edge(geometryService.factory.point(4, 2), geometryService.factory.point(1, 2));

            expect(line.getLength()).toEqual(3);
        });
    });

    describe('`getBoundingRectangle`', () => {
        it ('calculates the `Rectangle` which surrounds the `Polygon`', () => {
            const polygon = geometryService.factory.edge(geometryService.factory.point(1, 1), geometryService.factory.point(3, 3));

            const boundingRectangle = polygon.getBoundingRectangle();
            expect(
                boundingRectangle.equalTo(
                    geometryService.factory.polygon([
                        geometryService.factory.point(1, 1),
                        geometryService.factory.point(1, 3),
                        geometryService.factory.point(3, 3),
                        geometryService.factory.point(3, 1)
                    ])
                )
            ).toBeTruthy();
        });
    });

    describe('intersection', () => {
        it ('returns the intersecting point of the two segments if exists', () => {
            let segments = [
                geometryService.factory.edge(geometryService.factory.point(0, 2), geometryService.factory.point(8, 6)),
                geometryService.factory.edge(geometryService.factory.point(0, 0), geometryService.factory.point(10, 10))
            ];

            expect(segments[0].intersection(segments[1])).toEqual(geometryService.factory.point(4, 4));

            segments = [
                geometryService.factory.edge(geometryService.factory.point(2, -1), geometryService.factory.point(2, 7)),
                geometryService.factory.edge(geometryService.factory.point(-1, 3), geometryService.factory.point(2, 3))
            ];

            expect(segments[0].intersection(segments[1])).toEqual(geometryService.factory.point(2, 3));

            segments = [
                geometryService.factory.edge(geometryService.factory.point(2, -1), geometryService.factory.point(2, 7)),
                geometryService.factory.edge(geometryService.factory.point(-1, 8), geometryService.factory.point(2, 8))
            ];

            expect(segments[0].intersection(segments[1])).toEqual(undefined);

            segments = [
                geometryService.factory.edge(geometryService.factory.point(2, -1), geometryService.factory.point(2, 7)),
                geometryService.factory.edge(geometryService.factory.point(-1, 3), geometryService.factory.point(1, 3))
            ];

            expect(segments[0].intersection(segments[1])).toEqual(undefined);
        });
    });

    describe(`addThicknessToSegment`, () => {
        it ('creates a rectangular `Polygon` via adding thickness to a `Segment` 2', () => {
            const segment = geometryService.factory.edge(new Point(1, 1), new Point(3, 3));
            const rectangle = segment.addThickness(Math.SQRT2);
            expect(
                rectangle.equalTo(
                    geometryService.factory.polygon([
                        new Point(2, 0),
                        new Point(4, 2),
                        new Point(2, 4),
                        new Point(0, 2),
                    ])
                )
            ).toBeTruthy();
        });
    });

    describe('isPointOnSegment', () => {
        it ('returns true if the point is on the segment', () => {
            const segment45deg = geometryService.factory.edge(
                geometryService.factory.point(1, 1),
                geometryService.factory.point(5, 5),
            );

            expect(segment45deg.isPointOnSegment(geometryService.factory.point(2, 2))).toEqual(true);
            expect(segment45deg.isPointOnSegment(geometryService.factory.point(1, 1))).toEqual(true);

            const segmentVertical = geometryService.factory.edge(
                geometryService.factory.point(1, 1),
                geometryService.factory.point(1, 5),
            );

            expect(segmentVertical.isPointOnSegment(geometryService.factory.point(1, 3))).toEqual(true);

            const segmentHorizontal = geometryService.factory.edge(
                geometryService.factory.point(1, 1),
                geometryService.factory.point(5, 1),
            );

            expect(segmentHorizontal.isPointOnSegment(geometryService.factory.point(3, 1))).toEqual(true);
        });

        it ('returns false if the point is not on the segment', () => {
            const segment45deg = geometryService.factory.edge(
                geometryService.factory.point(1, 1),
                geometryService.factory.point(5, 5),
            );

            expect(segment45deg.isPointOnSegment(geometryService.factory.point(6, 6))).toEqual(false);
            expect(segment45deg.isPointOnSegment(geometryService.factory.point(0, 0))).toEqual(false);

            const segmentVertical = geometryService.factory.edge(
                geometryService.factory.point(1, 1),
                geometryService.factory.point(1, 5),
            );

            expect(segmentVertical.isPointOnSegment(geometryService.factory.point(1, 6))).toEqual(false);

            const segmentHorizontal = geometryService.factory.edge(
                geometryService.factory.point(1, 1),
                geometryService.factory.point(5, 1),
            );

            expect(segmentHorizontal.isPointOnSegment(geometryService.factory.point(6, 1))).toEqual(false);


        });
    });
});