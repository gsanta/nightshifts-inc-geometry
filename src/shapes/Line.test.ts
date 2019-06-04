import { Point } from "./Point";
import { Line } from './Line';
import { expect } from 'chai';

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

            const line = Line.createHorizontalLIne(4);

            expect(line.getSegmentWithCenterPointAndDistance(center, 2)).to.eql([new Point(0, 4), new Point(4, 4)]);
        });
    });
});
