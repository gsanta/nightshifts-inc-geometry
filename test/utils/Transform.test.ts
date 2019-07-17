import { Transform } from '../../src/utils/Transform';
import { Polygon } from '../../src/shapes/Polygon';
import { expect } from 'chai';
import { Point } from '../../src/shapes/Point';


describe(`Transform`, () => {
    describe(`rotate`, () => {
        it ('rotates the `Polygon` with the given degree at the center', () => {
            const transform = new Transform();

            const polygon = Polygon.createRectangle(1, 1, 3, 2);
            const rot1 = transform.rotate(polygon, Math.PI / 2);

            expect(rot1).to.eql(new Polygon([
                new Point(1.5, 0.5),
                new Point(1.5, 3.5),
                new Point(3.5, 3.5),
                new Point(3.5, 0.5)
            ]));
        });
    });
});
