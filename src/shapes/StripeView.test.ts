import { StripeView } from './StripeView';
import { Polygon } from './Polygon';
import { expect } from 'chai';
import { Point } from './Point';

describe(`StripeView`, () => {
    describe(`getSlope`, () => {
        it ('returns with the slope of the longer side of the stripe', () => {
            const stripeHorizontal = new StripeView(Polygon.createRectangle(1, 1, 5, 1));

            expect(stripeHorizontal.getSlope(), 'slope of horizontal stripe not correct').to.eq(0);

            const stripeVertical = new StripeView(Polygon.createRectangle(1, 1, 1, 5));

            expect(stripeVertical.getSlope(), 'slope of vertical stripe not correct').to.eq(undefined);

            const stripe45DegreesRotated = new StripeView(new Polygon([
                new Point(0, 1),
                new Point(4, 5),
                new Point(5, 4),
                new Point(1, 0)
            ]));

            expect(stripe45DegreesRotated.getSlope(), 'slope of stripe rotated 45 degrees not correct').to.eql(1);
        });
    });
});
