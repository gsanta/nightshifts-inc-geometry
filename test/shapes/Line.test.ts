import { Point } from "../../src/shapes/Point";
import { Line } from '../../src/shapes/Line';
import { expect } from 'chai';
import { toDegree } from '../../src/shapes/Angle';

describe(`Line`, () => {
    describe(`createFromPointSlopeForm`, () => {
        it ('creates a line with the correct \'b\' and \'m\' values from a `Point` and a slope.', () => {
            const point = new Point(4, 3);
            const slope = 0.5;

            const line = Line.createFromPointSlopeForm(point, slope);

            expect(line.b).to.eq(1);
            expect(line.m).to.eq(0.5);
        });

        it ('can create a vertical line.', () => {
            const point = new Point(4, 3);
            const slope = undefined;

            const line = Line.createFromPointSlopeForm(point, slope);

            expect(line.b).to.eq(4);
            expect(line.m).to.eq(undefined);
        });

        it ('can create a horizontal line.', () => {
            const point = new Point(4, 3);
            const slope = 0;

            const line = Line.createFromPointSlopeForm(point, slope);

            expect(line.b).to.eq(3);
            expect(line.m).to.eq(0);
        });
    });

    describe(`getX`, () => {
        it ('calculates the \'x\' value on the line for the given \'y\'.', () => {
            const point = new Point(4, 4);
            const slope = 0.5;

            const line = Line.createFromPointSlopeForm(point, slope);

            expect(line.getX(3)).to.eq(2);
        });
    });

    describe(`getY`, () => {
        it ('calculates the \'y\' value on the line for the given \'x\'.', () => {
            const point = new Point(4, 4);
            const slope = 0.5;

            const line = Line.createFromPointSlopeForm(point, slope);

            expect(line.getX(2)).to.eq(0);
        });
    });

    describe(`intersection`, () => {
        it ('calculates the intersection of two `Line`s', () => {

            const line1 = new Line(2, 2);
            const line2 = new Line(3, -2);

            expect(line1.intersection(line2)).to.eql(new Point(4, 10));
        });

        it ('returns undefined if the slopes are the same', () => {

            const line1 = new Line(2, 2);
            const line2 = new Line(2, -2);

            expect(line1.intersection(line2)).to.eql(undefined);
        });

        it ('works if one of the `Line`s is vertical', () => {
            const line1 = new Line(undefined, 2);
            const line2 = new Line(2, -2);

            expect(line1.intersection(line2)).to.eql(new Point(2, 2));
        });

        it ('works if the other `Line` is vertical', () => {
            const line1 = new Line(2, -2);
            const line2 = new Line(undefined, 2);

            expect(line1.intersection(line2)).to.eql(new Point(2, 2));
        });
    });

    describe(`getSegmentWithCenterPointAndDistance`, () => {
        it ('returns the two endpoints of a segment given the center `Point` and the distance from the center.', () => {
            const center = new Point(4, 3);

            const line = Line.createFromPointSlopeForm(center, 1);

            expect(line.getSegmentWithCenterPointAndDistance(center, Math.SQRT2)).to.eql([new Point(5, 4), new Point(3, 2)]);
        });

        it ('handles vertical lines', () => {
            const center = new Point(4, 3);

            const line = Line.createVerticalLine(4);

            expect(line.getSegmentWithCenterPointAndDistance(center, 1)).to.eql([new Point(4, 2), new Point(4, 4)]);
        });

        it ('handles horizontal lines', () => {
            const center = new Point(2, 4);

            const line = Line.createHorizontalLine(4);

            expect(line.getSegmentWithCenterPointAndDistance(center, 2)).to.eql([new Point(0, 4), new Point(4, 4)]);
        });
    });

    describe(`getAngleToXAxis`, () => {
        it ('returns with the line\'s angle to the x axis', () => {
            const line45Deg = new Line(1, 0);

            expect(toDegree(line45Deg.getAngleToXAxis().getAngle())).to.eql(45);

            const lineHorizontal = Line.createHorizontalLine(1);

            expect(toDegree(lineHorizontal.getAngleToXAxis().getAngle())).to.eql(0);

            const lineVertical = Line.createVerticalLine(-2);

            expect(toDegree(lineVertical.getAngleToXAxis().getAngle())).to.eql(90);

            const lineneg45Deg = new Line(-1, 0);

            expect(toDegree(lineneg45Deg.getAngleToXAxis().getAngle())).to.eql(315);
        });
    });
});
