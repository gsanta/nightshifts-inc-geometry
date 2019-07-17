import { Point } from "../../src/shapes/Point";
import { Angle } from '../../src/shapes/Angle';
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

    describe(`isPointInsideAngle`, () => {
        it ('returns true if the given `Point` is inside the angle (test 45 deg)', () => {
            const angle45deg = new Angle(new Point(0, 0), new Point(1, 1), new Point(1, 0));

            expect(angle45deg.isPointInsideAngle(new Point(2, 1))).to.be.true;

            expect(angle45deg.isPointInsideAngle(new Point(1, 1))).to.be.false;

            expect(angle45deg.isPointInsideAngle(new Point(-1, 2))).to.be.false;

            expect(angle45deg.isPointInsideAngle(new Point(-1, 1))).to.be.false;

            expect(angle45deg.isPointInsideAngle(new Point(-2, 1))).to.be.false;

            expect(angle45deg.isPointInsideAngle(new Point(-1, -1))).to.be.false;

            expect(angle45deg.isPointInsideAngle(new Point(1, -1))).to.be.false;

            expect(angle45deg.isPointInsideAngle(new Point(1, 0))).to.be.false;
        });

        it ('returns true if the given `Point` is inside the angle (test 90 deg)', () => {
            const angle90deg = new Angle(new Point(0, 0), new Point(0, 1), new Point(1, 0));

            expect(angle90deg.isPointInsideAngle(new Point(2, 1))).to.be.true;

            expect(angle90deg.isPointInsideAngle(new Point(1, 1))).to.be.true;

            expect(angle90deg.isPointInsideAngle(new Point(-1, 2))).to.be.false;

            expect(angle90deg.isPointInsideAngle(new Point(-1, 1))).to.be.false;

            expect(angle90deg.isPointInsideAngle(new Point(-2, 1))).to.be.false;

            expect(angle90deg.isPointInsideAngle(new Point(-1, -1))).to.be.false;

            expect(angle90deg.isPointInsideAngle(new Point(1, -1))).to.be.false;

            expect(angle90deg.isPointInsideAngle(new Point(1, 0))).to.be.false;
        });

        it ('returns true if the given `Point` is inside the angle (test 135 deg)', () => {
            const angle135deg = new Angle(new Point(0, 0), new Point(-1, 1), new Point(1, 0));

            expect(angle135deg.isPointInsideAngle(new Point(2, 1))).to.be.true;

            expect(angle135deg.isPointInsideAngle(new Point(1, 1))).to.be.true;

            expect(angle135deg.isPointInsideAngle(new Point(-1, 2))).to.be.true;

            expect(angle135deg.isPointInsideAngle(new Point(-1, 1))).to.be.false;

            expect(angle135deg.isPointInsideAngle(new Point(-2, 1))).to.be.false;

            expect(angle135deg.isPointInsideAngle(new Point(-1, -1))).to.be.false;

            expect(angle135deg.isPointInsideAngle(new Point(1, -1))).to.be.false;

            expect(angle135deg.isPointInsideAngle(new Point(1, 0))).to.be.false;
        });
    })
});
