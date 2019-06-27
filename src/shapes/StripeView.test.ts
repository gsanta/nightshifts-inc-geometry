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

    describe(`merge`, () => {
        it ('merges two overlapping (horizontal) stripes', () => {
            const stripe1 = new StripeView(Polygon.createRectangle(0, 0, 4, 1));
            const stripe2 = new StripeView(Polygon.createRectangle(2, 0, 6, 1));
            expect(stripe1.merge(stripe2)).to.eql(Polygon.createRectangle(0, 0, 8, 1));

        });

        it ('merges two overlapping (vertical) stripes', () => {
            const stripe1 = new StripeView(Polygon.createRectangle(0, 0, 1, 4));
            const stripe2 = new StripeView(Polygon.createRectangle(0, 2, 1, 6));
            expect(stripe1.merge(stripe2).equalTo(Polygon.createRectangle(0, 0, 1, 8))).to.be.true;
        });
    });
});
