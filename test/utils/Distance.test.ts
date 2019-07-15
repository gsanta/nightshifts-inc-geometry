import { Distance } from "../../src/utils/Distance";
import { Segment } from "../../src/shapes/Segment";
import { Point } from "../../src/shapes/Point";
import { expect } from "chai";


describe(`Distance`, () => {
    describe(`pointToSegment`, () => {
        it ('calculates the min distance between the `Point` and the `Segment`', () => {
            const distance = new Distance();

            expect(distance.pointToSegment(new Point(2, 4), new Segment(new Point(0, 5), new Point(0, 3)))).to.eq(2);

            expect(distance.pointToSegment(new Point(3, 5), new Segment(new Point(0, 5), new Point(0, 3)))).to.eq(3);

            expect(distance.pointToSegment(new Point(4, 1), new Segment(new Point(1, 1), new Point(3, 1)))).to.eq(1);
        });
    });
});
