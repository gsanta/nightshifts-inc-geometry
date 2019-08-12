import { Point } from "../../src/shapes/Point";
import { Angle, toDegree } from '../../src/shapes/Angle';

describe(`Angle`, () => {

    describe('fromRadian', () => {
        it ('creates a new Angle instance based on the given radian angle', () => {
            const angle0 = 0;

            expect(Angle.fromRadian(angle0).getAngle()).toEqual(0);

            const angle90 = Math.PI / 2;

            expect(toDegree(Angle.fromRadian(angle90).getAngle())).toEqual(90);

            const angle180 = Math.PI;

            expect(toDegree(Angle.fromRadian(angle180).getAngle())).toEqual(180);

            const angleNeg180 = - Math.PI / 2;

            expect(toDegree(Angle.fromRadian(angleNeg180).getAngle())).toEqual(270);
        });
    });

    describe(`getAngle`, () => {
        it ('returns the angle in radian', () => {
            expect(Angle.fromThreePoints(new Point(1, 1), new Point(1, 3), new Point(1, 3)).getAngle()).toEqual(0);

            expect(Angle.fromThreePoints(new Point(1, 1), new Point(1, 3), new Point(3, 1)).getAngle()).toEqual(Math.PI / 2);

            expect(Angle.fromThreePoints(new Point(1, 1), new Point(-2, 1), new Point(3, 1)).getAngle()).toEqual(Math.PI);

            expect(Angle.fromThreePoints(new Point(0, 0), new Point(0, -1), new Point(3, 0)).getAngle()).toEqual(3 * Math.PI / 2);
        });
    });


    describe(`isStraightAngle`, () => {
        it ('returns true if the angle is a straight line', () => {
            const a = new Point(1, 1);
            const b = new Point(2, 2);
            const c = new Point(3, 3);

            const angle = Angle.fromThreePoints(a, b, c);

            expect(angle.isStraightAngle()).toEqual(true);
        });
    });

    describe(`isPointInsideAngle`, () => {
        it ('returns true if the given `Point` is inside the angle (test 45 deg)', () => {
            const angle45deg = Angle.fromThreePoints(new Point(0, 0), new Point(1, 1), new Point(1, 0));

            expect(angle45deg.isPointInsideAngle(new Point(2, 1))).toBeTruthy();

            expect(angle45deg.isPointInsideAngle(new Point(1, 1))).toBeFalsy();

            expect(angle45deg.isPointInsideAngle(new Point(-1, 2))).toBeFalsy();

            expect(angle45deg.isPointInsideAngle(new Point(-1, 1))).toBeFalsy();

            expect(angle45deg.isPointInsideAngle(new Point(-2, 1))).toBeFalsy();

            expect(angle45deg.isPointInsideAngle(new Point(-1, -1))).toBeFalsy();

            expect(angle45deg.isPointInsideAngle(new Point(1, -1))).toBeFalsy();

            expect(angle45deg.isPointInsideAngle(new Point(1, 0))).toBeFalsy();
        });

        it ('returns true if the given `Point` is inside the angle (test 90 deg)', () => {
            const angle90deg = Angle.fromThreePoints(new Point(0, 0), new Point(0, 1), new Point(1, 0));

            expect(angle90deg.isPointInsideAngle(new Point(2, 1))).toBeTruthy();

            expect(angle90deg.isPointInsideAngle(new Point(1, 1))).toBeTruthy();

            expect(angle90deg.isPointInsideAngle(new Point(-1, 2))).toBeFalsy();

            expect(angle90deg.isPointInsideAngle(new Point(-1, 1))).toBeFalsy();

            expect(angle90deg.isPointInsideAngle(new Point(-2, 1))).toBeFalsy();

            expect(angle90deg.isPointInsideAngle(new Point(-1, -1))).toBeFalsy();

            expect(angle90deg.isPointInsideAngle(new Point(1, -1))).toBeFalsy();

            expect(angle90deg.isPointInsideAngle(new Point(1, 0))).toBeFalsy();
        });

        it ('returns true if the given `Point` is inside the angle (test 135 deg)', () => {
            const angle135deg = Angle.fromThreePoints(new Point(0, 0), new Point(-1, 1), new Point(1, 0));

            expect(angle135deg.isPointInsideAngle(new Point(2, 1))).toBeTruthy();

            expect(angle135deg.isPointInsideAngle(new Point(1, 1))).toBeTruthy();

            expect(angle135deg.isPointInsideAngle(new Point(-1, 2))).toBeTruthy();

            expect(angle135deg.isPointInsideAngle(new Point(-1, 1))).toBeFalsy();

            expect(angle135deg.isPointInsideAngle(new Point(-2, 1))).toBeFalsy();

            expect(angle135deg.isPointInsideAngle(new Point(-1, -1))).toBeFalsy();

            expect(angle135deg.isPointInsideAngle(new Point(1, -1))).toBeFalsy();

            expect(angle135deg.isPointInsideAngle(new Point(1, 0))).toBeFalsy();
        });
    })
});
