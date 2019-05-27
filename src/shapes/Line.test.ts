import { Line } from "./Line";
import { Point } from "./Point";
import { expect } from "chai";


describe('Line', () => {
    describe('`isPointOnTheLine`', () => {
        it ('returns true if the given `Point` lines on the line.', () => {
            const line = new Line(new Point(1, 2), new Point(5, 6));

            expect(line.isPointOnTheLine(new Point(3, 4))).to.be.true;
        });

        it ('returns true even if the given `Point` lies outside of the `Line` segment, but on the `infinite` line the segment determines.', () => {
            const line = new Line(new Point(1, 2), new Point(5, 6));

            expect(line.isPointOnTheLine(new Point(-2, -1))).to.be.true;
        });

        it ('returns false if the given `Point` does not lie on the line.', () => {
            const line = new Line(new Point(1, 2), new Point(5, 6));

            expect(line.isPointOnTheLine(new Point(2, 2))).to.be.false;
        });
    });

    describe('`isCoincidentToLine`', () => {
        it ('returns true if the two `Line` segments determine the same infinite line.', () => {
            const line1 = new Line(new Point(1, 1), new Point(2, 1));
            const line2 = new Line(new Point(4, 1), new Point(5, 1));

            expect(line1.isCoincidentToLine(line2)).to.be.true;
        });

        it ('returns false if the two `Line` segments do noet determine the same infinite line.', () => {
            const line1 = new Line(new Point(1, 1), new Point(2, 1));
            const line2 = new Line(new Point(4, 1), new Point(5, 2));

            expect(line1.isCoincidentToLine(line2)).to.be.false;
        });
    });

    describe ('equalTo', () => {
        it ('returns true if the two lines have equal endpoints', () => {
            const line1 = new Line(new Point(1, 2), new Point(3, 4));
            const line2 = new Line(new Point(1, 2), new Point(3, 4));

            expect(line1.equalTo(line2)).to.be.true;
        });

        it ('returns true if the two lines are equal but the endpoints are given in reverse order', () => {
            const line1 = new Line(new Point(1, 2), new Point(3, 4));
            const line2 = new Line(new Point(3, 4), new Point(1, 2));

            expect(line1.equalTo(line2)).to.be.true;
        });
    });

    describe('scaleX', () => {
        it ('scales the two endpoints of the line by the given amount on the x coordinate', () => {
            const line = new Line(new Point(1, 2), new Point(3, 4));
            const scaledLine = new Line(new Point(3, 2), new Point(9, 4));

            expect(line.scaleX(3).equalTo(scaledLine));
        });
    });

    describe('scaleY', () => {
        it ('scales the two endpoints of the line by the given amount on the y coordinate', () => {
            const line = new Line(new Point(1, 2), new Point(3, 4));
            const scaledLine = new Line(new Point(1, 6), new Point(3, 12));

            expect(line.scaleY(3).equalTo(scaledLine));
        });
    });

    describe('getLength', () => {
        it ('calculates the distance between `start` and `end` of `Line`', () => {
            const line = new Line(new Point(4, 2), new Point(1, 2));

            expect(line.getLength()).to.eql(3);
        });
    });
});