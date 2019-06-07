import { Segment } from "./Segment";
import { Point } from "./Point";
import { expect } from "chai";
import { Polygon } from './Polygon';
import { Line } from "./Line";


describe('`Segment`', () => {
    describe('`isPointOnTheLine`', () => {
        it ('returns true if the given `Point` lines on the line.', () => {
            const line = new Segment(new Point(1, 2), new Point(5, 6));

            expect(line.isPointOnTheLine(new Point(3, 4))).to.be.true;
        });

        it ('returns true even if the given `Point` lies outside of the `Segment` segment, but on the `infinite` line the segment determines.', () => {
            const line = new Segment(new Point(1, 2), new Point(5, 6));

            expect(line.isPointOnTheLine(new Point(-2, -1))).to.be.true;
        });

        it ('can handle vertical lines where slope is undefined.', () => {
            const line = new Segment(new Point(1, 2), new Point(1, 5));

            expect(line.isPointOnTheLine(new Point(1, 3))).to.be.true;
        });

        it ('returns false if the given `Point` does not lie on the line.', () => {
            const line = new Segment(new Point(1, 2), new Point(5, 6));

            expect(line.isPointOnTheLine(new Point(2, 2))).to.be.false;
        });
    });

    describe('`isCoincidentToLine`', () => {
        it ('returns true if the two `Segment` segments determine the same infinite line.', () => {
            const line1 = new Segment(new Point(1, 1), new Point(2, 1));
            const line2 = new Segment(new Point(4, 1), new Point(5, 1));

            expect(line1.isCoincidentToLine(line2)).to.be.true;
        });

        it ('returns false if the two `Segment` segments do noet determine the same infinite line.', () => {
            const line1 = new Segment(new Point(1, 1), new Point(2, 1));
            const line2 = new Segment(new Point(4, 1), new Point(5, 2));

            expect(line1.isCoincidentToLine(line2)).to.be.false;
        });
    });

    describe(`getPerpendicularBisector`, () => {
        it ('returns with the `Line` representing the perpendicular bisector', () => {
            const segment = new Segment(new Point(1, 1), new Point(3, 3));

            expect(segment.getPerpendicularBisector()).to.eql(new Line(-1, 4));
        });

        it ('handles vertical segments', () => {
            const segment = new Segment(new Point(1, 1), new Point(1, 3));

            expect(segment.getPerpendicularBisector()).to.eql(new Line(0, 2));
        });

        it ('handles horizontal segments', () => {
            const segment = new Segment(new Point(1, 1), new Point(3, 1));
            expect(segment.getPerpendicularBisector()).to.eql(new Line(undefined, 2));
        });
    });

    describe('`getCoincidentLineSegment`', () => {
        it ('returns the overlap `Segment` segment when line1 extends line2 in both ends.', () => {
            const line1 = new Segment(new Point(1, 2), new Point(7, 8));
            const line2 = new Segment(new Point(3, 4), new Point(5, 6));

            expect(line1.getCoincidentLineSegment(line2)).to.eql([new Segment(new Point(3, 4), new Point(5, 6)), 0, 0]);
        });

        it ('returns the overlap `Segment` segment when line2 extends line1 in both ends.', () => {
            const line1 = new Segment(new Point(3, 4), new Point(5, 6));
            const line2 = new Segment(new Point(1, 2), new Point(7, 8));

            expect(line1.getCoincidentLineSegment(line2)).to.eql([new Segment(new Point(3, 4), new Point(5, 6)), 0, 0]);
        });

        it ('returns the overlap `Segment` segment when the two lines overlap and line1 starts at smaller x coordinate.', () => {
            const line1 = new Segment(new Point(1, 2), new Point(5, 6));
            const line2 = new Segment(new Point(3, 4), new Point(7, 8));

            expect(line1.getCoincidentLineSegment(line2)).to.eql([new Segment(new Point(3, 4), new Point(5, 6)), 0, 0]);
        });

        it ('returns the overlap `Segment` segment when the two lines are identical.', () => {
            const line1 = new Segment(new Point(1, 2), new Point(5, 6));
            const line2 = new Segment(new Point(1, 2), new Point(5, 6));

            expect(line1.getCoincidentLineSegment(line2)).to.eql([new Segment(new Point(1, 2), new Point(5, 6)), 0, 0]);
        });

        it ('returns the overlap `Segment` segment when the two lines overlap and line2 starts at smaller x coordinate.', () => {
            const line1 = new Segment(new Point(3, 4), new Point(7, 8));
            const line2 = new Segment(new Point(1, 2), new Point(5, 6));

            expect(line1.getCoincidentLineSegment(line2)).to.eql([new Segment(new Point(3, 4), new Point(5, 6)), 0, 0]);
        });

        it ('returns undefined when the two lines do not overlap.', () => {
            const line1 = new Segment(new Point(1, 2), new Point(3, 4));
            const line2 = new Segment(new Point(5, 6), new Point(7, 8));

            expect(line1.getCoincidentLineSegment(line2)).to.eql(undefined);
        });

        it ('works well also when the lines are vertical.', () => {
            const line1 = new Segment(new Point(1, 4), new Point(1, 0));
            const line2 = new Segment(new Point(1, 1), new Point(1, 3));

            expect(line1.getCoincidentLineSegment(line2)).to.eql([new Segment(new Point(1, 1), new Point(1, 3)), 0, 0]);
        });
    });

    describe ('equalTo', () => {
        it ('returns true if the two lines have equal endpoints', () => {
            const line1 = new Segment(new Point(1, 2), new Point(3, 4));
            const line2 = new Segment(new Point(1, 2), new Point(3, 4));

            expect(line1.equalTo(line2)).to.be.true;
        });

        it ('returns true if the two lines are equal but the endpoints are given in reverse order', () => {
            const line1 = new Segment(new Point(1, 2), new Point(3, 4));
            const line2 = new Segment(new Point(3, 4), new Point(1, 2));

            expect(line1.equalTo(line2)).to.be.true;
        });
    });

    describe('scaleX', () => {
        it ('scales the two endpoints of the line by the given amount on the x coordinate', () => {
            const line = new Segment(new Point(1, 2), new Point(3, 4));
            const scaledLine = new Segment(new Point(3, 2), new Point(9, 4));

            expect(line.scaleX(3).equalTo(scaledLine));
        });
    });

    describe('scaleY', () => {
        it ('scales the two endpoints of the line by the given amount on the y coordinate', () => {
            const line = new Segment(new Point(1, 2), new Point(3, 4));
            const scaledLine = new Segment(new Point(1, 6), new Point(3, 12));

            expect(line.scaleY(3).equalTo(scaledLine));
        });
    });

    describe('getLength', () => {
        it ('calculates the distance between `start` and `end` of `Segment`', () => {
            const line = new Segment(new Point(4, 2), new Point(1, 2));

            expect(line.getLength()).to.eql(3);
        });
    });

    describe('`getBoundingRectangle`', () => {
        it ('calculates the `Rectangle` which surrounds the `Polygon`', () => {
            const polygon = new Segment(new Point(1, 1), new Point(3, 3));

            const boundingRectangle = polygon.getBoundingRectangle();
            expect(boundingRectangle).to.eql(new Polygon([
                new Point(1, 1),
                new Point(1, 3),
                new Point(3, 3),
                new Point(3, 1)
            ]))
        });
    });

    describe('`stretch`', () => {
        it ('makes the segment shorter by the given amount if the parameter is negative', () => {
            const segment = new Segment(new Point(1, 1), new Point(5, 5));

            expect(segment.stretch(-Math.SQRT2)).to.eql(new Segment(new Point(2, 2), new Point(4, 4)));
        });

        it ('makes the segment longer by the given amount if the parameter is positive', () => {
            const segment = new Segment(new Point(1, 1), new Point(5, 5));

            expect(segment.stretch(Math.SQRT2)).to.eql(new Segment(new Point(0, 0), new Point(6, 6)));
        });


        it ('throws an error if the negative stretching would result 0 or negative length', () => {
            const segment = new Segment(new Point(1, 1), new Point(1, 3));

            expect(segment.stretch.bind(segment, -2)).to.throw('Can not stretch segment by -2 unit because the resulting length would be <= 0.');
        });
    });

    // describe(`getB`, () => {
    //     const segment = new Segment(new Point(2, 1), new Point(4, 2));

    //     expect(segment.getB()).to.eql(new Point(0, 1));
    // });
});