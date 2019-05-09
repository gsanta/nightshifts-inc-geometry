import { Point } from "./Point";
import { expect } from "chai";


describe('`Point`', () => {
    describe('`distanceTo`', () => {
        it ('returns the x and y distance from the other `Point`', () => {
            const point = new Point(2, 3);
            const otherPoint = new Point(4, -2);

            expect(point.distanceTo(otherPoint)).to.eql([2, 5]);
        });
    });
});