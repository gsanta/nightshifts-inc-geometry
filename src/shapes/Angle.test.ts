import { Point } from "./Point";
import { Angle } from './Angle';
import { expect } from "chai";


describe(`Angle`, () => {

    describe(`getAngle`, () => {
        it ('returns the angle in radian', () => {
            const a = new Point(1, 1);
            const b = new Point(1, 3);
            const c = new Point(3, 1);

            const angle = new Angle(a, b, c);

            expect(angle.getAngle()).to.eql(Math.PI / 2);
        });
    });


    describe(`isStraightAngle`, () => {
        it ('returns true if the angle is a straight line', () => {
            const a = new Point(1, 1);
            const b = new Point(2, 2);
            const c = new Point(3, 3);

            const angle = new Angle(a, b, c);

            expect(angle.isStraightAngle()).to.eql(true);
        });
    });
});
