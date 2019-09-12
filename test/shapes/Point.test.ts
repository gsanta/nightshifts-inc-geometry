import { Point } from "../../src/shapes/Point";
import { expect } from "chai";
import { GeometryUtils, toRadian } from '../../src/utils/GeometryUtils';
import { GeometryService } from "../../src/GeometryService";


describe('`Point`', () => {
    const geometryService = new GeometryService();
    describe('`distanceTo`', () => {
        it ('returns the x and y distance from the other `Point`', () => {
            const point = geometryService.factory.point(2, 3);
            const otherPoint = geometryService.factory.point(4, -2);

            expect(point.absoluteDistanceTo(otherPoint)).to.eql([2, 5]);
        });
    });

    describe(`subtract`, () => {
        it ('returns the difference between this `Point` and the other `Point`', () => {
            const point = geometryService.factory.point(5, 5);
            const otherPoint = geometryService.factory.point(3, 3);

            expect(point.subtract(otherPoint)).to.eql(geometryService.factory.point(2, 2));
        });
    });

    describe(`distanceTo`, () => {
        it ('calculates the distance to another `Point`', () => {
            const point1 = geometryService.factory.point(2, 2);
            const point2 = geometryService.factory.point(4, 4);

            expect(point1.distanceTo(point2)).to.eq(2*Math.SQRT2);
        });
    });

    describe(`distanceToOrigin`, () => {
        it ('calculates the distance to the origin', () => {
            const point = geometryService.factory.point(5, 3);

            expect(point.distanceToOrigin()).to.eq(Math.sqrt(25 + 9));
        });
    });

    describe(`normalize`, () => {
        it ('normalizes the `Point`', () => {
            const point = geometryService.factory.point(2, 0);

            expect(point.normalize()).to.eql(geometryService.factory.point(1, 0));
        });

        it ('works well with negative numbers', () => {
            const point = geometryService.factory.point(-2, 0);

            expect(point.normalize()).to.eql(geometryService.factory.point(-1, 0));
        });
    });

    describe(`angleTo`, () => {
        it ('calculates the angle between the two `Point`s', () => {
            const point1 = geometryService.factory.point(0, 3);
            const point2 = geometryService.factory.point(2, 0);

            expect(point1.angleTo(point2)).to.eq(toRadian(90));
        });


        it ('works well with negative angles', () => {
            const point1 = geometryService.factory.point(0, 3);
            const point2 = geometryService.factory.point(2, 0);

            expect(point2.angleTo(point1)).to.eq(toRadian(-90));
        });
    });
});