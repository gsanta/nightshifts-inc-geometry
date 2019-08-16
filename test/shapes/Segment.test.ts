import { Segment } from "../../src/shapes/Segment";
import { Point } from "../../src/shapes/Point";
import { Polygon } from '../../src/shapes/Polygon';
import { Line } from "../../src/shapes/Line";


describe('`Segment`', () => {
    describe('`isPointOnTheLine`', () => {
        it ('returns true if the given `Point` lines on the line.', () => {
            const line = new Segment(new Point(1, 2), new Point(5, 6));

            expect(line.isPointOnTheLine(new Point(3, 4))).toBeTruthy();
        });

        it ('returns true even if the given `Point` lies outside of the `Segment` segment, but on the `infinite` line the segment determines.', () => {
            const line = new Segment(new Point(1, 2), new Point(5, 6));

            expect(line.isPointOnTheLine(new Point(-2, -1))).toBeTruthy();
        });

        it ('can handle vertical lines where slope is undefined.', () => {
            const line = new Segment(new Point(1, 2), new Point(1, 5));

            expect(line.isPointOnTheLine(new Point(1, 3))).toBeTruthy();
        });

        it ('returns false if the given `Point` does not lie on the line.', () => {
            const line = new Segment(new Point(1, 2), new Point(5, 6));

            expect(line.isPointOnTheLine(new Point(2, 2))).toBeFalsy();
        });
    });

    describe('`isCoincidentToLine`', () => {
        it ('returns true if the two `Segment` segments determine the same infinite line.', () => {
            const line1 = new Segment(new Point(1, 1), new Point(2, 1));
            const line2 = new Segment(new Point(4, 1), new Point(5, 1));

            expect(line1.isCoincidentToLine(line2)).toBeTruthy();
        });

        it ('returns false if the two `Segment` segments do noet determine the same infinite line.', () => {
            const line1 = new Segment(new Point(1, 1), new Point(2, 1));
            const line2 = new Segment(new Point(4, 1), new Point(5, 2));

            expect(line1.isCoincidentToLine(line2)).toBeFalsy();
        });
    });

    describe(`getPerpendicularBisector`, () => {
        it ('returns with the `Line` representing the perpendicular bisector', () => {
            const segment = new Segment(new Point(1, 1), new Point(3, 3));

            expect(segment.getPerpendicularBisector()).toEqual(Line.fromPointSlopeForm(new Point(0, 4), -1));

            const verticalSegment = new Segment(new Point(1, 1), new Point(1, 3));
            expect(verticalSegment.getPerpendicularBisector()).toEqual(Line.fromPointSlopeForm(new Point(0, 2), 0));

            const horizontalSegment = new Segment(new Point(1, 1), new Point(3, 1));
            expect(horizontalSegment.getPerpendicularBisector()).toEqual(Line.fromPointSlopeForm(new Point(2, 0), undefined));
        });
    });

    describe('`getCoincidentLineSegment`', () => {
        it ('returns the overlap `Segment` segment when line1 extends line2 in both ends.', () => {
            const line1 = new Segment(new Point(1, 2), new Point(7, 8));
            const line2 = new Segment(new Point(3, 4), new Point(5, 6));

            expect(line1.getCoincidentLineSegment(line2)).toEqual([new Segment(new Point(3, 4), new Point(5, 6)), 0, 0]);
        });

        it ('returns the overlap `Segment` segment when line2 extends line1 in both ends.', () => {
            const line1 = new Segment(new Point(3, 4), new Point(5, 6));
            const line2 = new Segment(new Point(1, 2), new Point(7, 8));

            expect(line1.getCoincidentLineSegment(line2)).toEqual([new Segment(new Point(3, 4), new Point(5, 6)), 0, 0]);
        });

        it ('returns the overlap `Segment` segment when the two lines overlap and line1 starts at smaller x coordinate.', () => {
            const line1 = new Segment(new Point(1, 2), new Point(5, 6));
            const line2 = new Segment(new Point(3, 4), new Point(7, 8));

            expect(line1.getCoincidentLineSegment(line2)).toEqual([new Segment(new Point(3, 4), new Point(5, 6)), 0, 0]);
        });

        it ('returns the overlap `Segment` segment when the two lines are identical.', () => {
            const line1 = new Segment(new Point(1, 2), new Point(5, 6));
            const line2 = new Segment(new Point(1, 2), new Point(5, 6));

            expect(line1.getCoincidentLineSegment(line2)).toEqual([new Segment(new Point(1, 2), new Point(5, 6)), 0, 0]);
        });

        it ('returns the overlap `Segment` segment when the two lines overlap and line2 starts at smaller x coordinate.', () => {
            const line1 = new Segment(new Point(3, 4), new Point(7, 8));
            const line2 = new Segment(new Point(1, 2), new Point(5, 6));

            expect(line1.getCoincidentLineSegment(line2)).toEqual([new Segment(new Point(3, 4), new Point(5, 6)), 0, 0]);
        });

        it ('returns undefined when the two lines do not overlap.', () => {
            const line1 = new Segment(new Point(1, 2), new Point(3, 4));
            const line2 = new Segment(new Point(5, 6), new Point(7, 8));

            expect(line1.getCoincidentLineSegment(line2)).toEqual(undefined);
        });

        it ('works well also when the lines are vertical.', () => {
            const line1 = new Segment(new Point(1, 4), new Point(1, 0));
            const line2 = new Segment(new Point(1, 1), new Point(1, 3));

            expect(line1.getCoincidentLineSegment(line2)).toEqual([new Segment(new Point(1, 1), new Point(1, 3)), 0, 0]);
        });
    });

    describe ('equalTo', () => {
        it ('returns true if the two lines have equal endpoints', () => {
            const line1 = new Segment(new Point(1, 2), new Point(3, 4));
            const line2 = new Segment(new Point(1, 2), new Point(3, 4));

            expect(line1.equalTo(line2)).toBeTruthy();
        });

        it ('returns true if the two lines are equal but the endpoints are given in reverse order', () => {
            const line1 = new Segment(new Point(1, 2), new Point(3, 4));
            const line2 = new Segment(new Point(3, 4), new Point(1, 2));

            expect(line1.equalTo(line2)).toBeTruthy();
        });
    });

    describe(`scale`, () => {
        it ('scales the two endpoints of the `Segment` by the given x', () => {
            const line = new Segment(new Point(1, 2), new Point(3, 4));
            const scaledLine = new Segment(new Point(3, 2), new Point(9, 4));

            expect(line.scale(new Point(3, 0)).equalTo(scaledLine));
        });

        it ('scales the two endpoints of the `Segment` by the given y', () => {
            const line = new Segment(new Point(1, 2), new Point(3, 4));
            const scaledLine = new Segment(new Point(1, 6), new Point(3, 12));

            expect(line.scale(new Point(0, 3)).equalTo(scaledLine));
        });
    });

    describe('scaleY', () => {
    });

    describe('getLength', () => {
        it ('calculates the distance between `start` and `end` of `Segment`', () => {
            const line = new Segment(new Point(4, 2), new Point(1, 2));

            expect(line.getLength()).toEqual(3);
        });
    });

    describe('`getBoundingRectangle`', () => {
        it ('calculates the `Rectangle` which surrounds the `Polygon`', () => {
            const polygon = new Segment(new Point(1, 1), new Point(3, 3));

            const boundingRectangle = polygon.getBoundingRectangle();
            expect(boundingRectangle).toEqual(new Polygon([
                new Point(1, 1),
                new Point(1, 3),
                new Point(3, 3),
                new Point(3, 1)
            ]))
        });
    });
});