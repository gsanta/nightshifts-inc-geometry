import { Point } from "../../src/shapes/Point";
import { expect } from "chai";
import { GeometryUtils } from '../../src/utils/GeometryUtils';


describe('`Point`', () => {
    describe('`distanceTo`', () => {
        it ('returns the x and y distance from the other `Point`', () => {
            const point = new Point(2, 3);
            const otherPoint = new Point(4, -2);

            expect(point.absoluteDistanceTo(otherPoint)).to.eql([2, 5]);
        });
    });

    describe(`subtract`, () => {
        it ('returns the difference between this `Point` and the other `Point`', () => {
            const point = new Point(5, 5);
            const otherPoint = new Point(3, 3);

            expect(point.subtract(otherPoint)).to.eql(new Point(2, 2));
        });
    });

    describe(`distanceTo`, () => {
        it ('calculates the distance to another `Point`', () => {
            const point1 = new Point(2, 2);
            const point2 = new Point(4, 4);

            expect(point1.distanceTo(point2)).to.eq(2*Math.SQRT2);
        });
    });

    describe(`distanceToOrigin`, () => {
        it ('calculates the distance to the origin', () => {
            const point = new Point(5, 3);

            expect(point.distanceToOrigin()).to.eq(Math.sqrt(25 + 9));
        });
    });

    describe(`normalize`, () => {
        it ('normalizes the `Point`', () => {
            const point = new Point(2, 0);

            expect(point.normalize()).to.eql(new Point(1, 0));
        });

        it ('works well with negative numbers', () => {
            const point = new Point(-2, 0);

            expect(point.normalize()).to.eql(new Point(-1, 0));
        });
    });

    describe(`angleTo`, () => {
        it ('calculates the angle between the two `Point`s', () => {
            const point1 = new Point(0, 3);
            const point2 = new Point(2, 0);

            expect(point1.angleTo(point2)).to.eq(GeometryUtils.toRadian(90));
        });


        it ('works well with negative angles', () => {
            const point1 = new Point(0, 3);
            const point2 = new Point(2, 0);

            expect(point2.angleTo(point1)).to.eq(GeometryUtils.toRadian(-90));
        });
    });
});