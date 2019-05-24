import { Polygon } from './Polygon';
import { Point } from './Point';
import { expect } from 'chai';
import { Rectangle } from './Rectangle';
import { Line } from './Line';


describe('Polygon', () => {
    describe('contains', () => {
        it ('returns true if the polygon contains the other', () => {
            const poly1 = new Polygon([
                new Point(1, 1),
                new Point(3, 1),
                new Point(3, 4),
                new Point(1, 4)
            ]);

            const poly2 = new Polygon([
                new Point(2, 1),
                new Point(3, 1),
                new Point(3, 4),
                new Point(2, 4)
            ]);

            expect(poly1.contains(poly2)).to.eql(true);
        });

        it ('returns false if the two polygons overlap', () => {
            const poly1 = new Polygon([
                new Point(1, 1),
                new Point(3, 1),
                new Point(3, 4),
                new Point(1, 4)
            ]);

            const poly2 = new Polygon([
                new Point(2, 1),
                new Point(4, 1),
                new Point(4, 4),
                new Point(2, 4)
            ]);

            expect(poly1.contains(poly2)).to.eql(false);
        });

        it ('returns false if the two polygons do have any common parts', () => {
            const poly1 = new Polygon([
                new Point(1, 1),
                new Point(3, 1),
                new Point(3, 4),
                new Point(1, 4)
            ]);

            const poly2 = new Polygon([
                new Point(4, 1),
                new Point(5, 1),
                new Point(5, 4),
                new Point(4, 4)
            ]);

            expect(poly1.contains(poly2)).to.eql(false);
        });
    });

    describe('intersectBorder', () => {
        it ('returns true if the polygon intersects with the other', () => {
            const poly1 = new Polygon([
                new Point(1, 1),
                new Point(3, 1),
                new Point(3, 4),
                new Point(1, 4)
            ]);

            const poly2 = new Polygon([
                new Point(3, 1),
                new Point(4, 1),
                new Point(4, 4),
                new Point(3, 4)
            ]);

            expect(poly1.intersectBorder(poly2)).to.eql(new Line(new Point(3, 1), new Point(3, 4)));
        });

        it ('returns false if the two polygons do have any common parts', () => {
            const poly1 = new Polygon([
                new Point(1, 1),
                new Point(3, 1),
                new Point(3, 4),
                new Point(1, 4)
            ]);

            const poly2 = new Polygon([
                new Point(4, 1),
                new Point(5, 1),
                new Point(5, 4),
                new Point(4, 4)
            ]);

            expect(poly1.intersectBorder(poly2)).to.eql(undefined);
        });

        it ('returns false if the two polygons overlap', () => {
            const poly1 = new Polygon([
                new Point(1, 1),
                new Point(4, 1),
                new Point(4, 4),
                new Point(1, 4)
            ]);

            const poly2 = new Polygon([
                new Point(5, 1),
                new Point(3, 1),
                new Point(3, 4),
                new Point(5, 4)
            ]);

            expect(poly1.intersectBorder(poly2)).to.eql(undefined);
        });
    });

    describe('scaleX', () => {
        it ('scales the polygon on the x axis', () => {
            const polygon = new Rectangle(1, 2, 3, 2);
            expect(polygon.scaleX(3)).to.eql(new Rectangle(3, 2, 9, 2));
        });
    });

    describe('scaleY', () => {
        it ('scales the polygon on the y axis', () => {
            const polygon = new Rectangle(1, 2, 1, 3);
            expect(polygon.scaleY(3)).to.eql(new Rectangle(1, 6, 1, 9));
        });
    });

    describe('equalTo', () => {
        it ('returns true if all of the points in the polygon are equal', () => {
            const polygon1 = new Polygon([new Point(1, 2), new Point(3, 4), new Point(5, 6)]);
            const polygon2 = new Polygon([new Point(1, 2), new Point(3, 4), new Point(5, 6)]);

            expect(polygon1.equalTo(polygon2)).to.be.true;
        });

        it ('returns false it not all the points are equal', () => {
            const polygon1 = new Polygon([new Point(1, 2), new Point(5, 4), new Point(5, 6)]);
            const polygon2 = new Polygon([new Point(1, 2), new Point(3, 4), new Point(5, 6)]);

            expect(polygon1.equalTo(polygon2)).to.be.false;
        });

        it ('returns false it the two polygons do not have the same number of points', () => {
            const polygon1 = new Polygon([new Point(1, 2), new Point(3, 4)]);
            const polygon2 = new Polygon([new Point(1, 2), new Point(3, 4), new Point(5, 6)]);

            expect(polygon1.equalTo(polygon2)).to.be.false;
        });
    });

    describe('`negateX`', () => {
        it ('negates the x coordinates of the `Polygon`', () => {
            const polygon = new Polygon([
                new Point(2, 3),
                new Point(5, 3),
                new Point(5, 6),
                new Point(4, 7),
                new Point(2, 7)
            ]);

            const expectedPolygon = new Polygon([
                new Point(-2, 3),
                new Point(-5, 3),
                new Point(-5, 6),
                new Point(-4, 7),
                new Point(-2, 7)
            ])

            expect(polygon.negateX().equalTo(expectedPolygon)).to.be.true;
        });
    });

    describe('`negateY`', () => {
        it ('negates the x coordinates of the `Polygon`', () => {
            const polygon = new Polygon([
                new Point(2, 3),
                new Point(5, 3),
                new Point(5, 6),
                new Point(4, 7),
                new Point(2, 7)
            ]);

            const expectedPolygon = new Polygon([
                new Point(2, -3),
                new Point(5, -3),
                new Point(5, -6),
                new Point(4, -7),
                new Point(2, -7)
            ])

            expect(polygon.negateY().equalTo(expectedPolygon)).to.be.true;
        });
    });

    describe('`addX`', () => {
        it ('adds the speficied amount to the x coordinates of the `Polygon`', () => {
            const polygon = new Polygon([
                new Point(2, 3),
                new Point(5, 3),
                new Point(5, 6),
                new Point(4, 7),
                new Point(2, 7)
            ]);

            const expectedPolygon = new Polygon([
                new Point(5, 3),
                new Point(8, 3),
                new Point(8, 6),
                new Point(7, 7),
                new Point(5, 7)
            ]);

            expect(polygon.addX(3).equalTo(expectedPolygon)).to.be.true;
        });
    });

    describe('`addY`', () => {
        it ('adds the speficied amount to the y coordinates of the `Polygon`', () => {
            const polygon = new Polygon([
                new Point(2, 3),
                new Point(5, 3),
                new Point(5, 6),
                new Point(4, 7),
                new Point(2, 7)
            ]);

            const expectedPolygon = new Polygon([
                new Point(2, 0),
                new Point(5, 0),
                new Point(5, 3),
                new Point(4, 4),
                new Point(2, 4)
            ]);

            expect(polygon.addY(-3).equalTo(expectedPolygon)).to.be.true;
        });
    });


    describe('`getCircumference`', () => {
        it ('calculates the circumference of the `Polygon`', () => {
            const polygon = new Polygon([
                new Point(2, 3),
                new Point(5, 3),
                new Point(5, 6),
                new Point(2, 6)
            ]);

            expect(polygon.getCircumference()).to.eql(12);
        });
    });


    describe('`strechX`', () => {
        it ('stretches the `Polygon` with the given amount on the x axis', () => {
            const polygon = new Polygon([
                new Point(2, 3),
                new Point(5, 3),
                new Point(5, 6),
                new Point(2, 6)
            ]);

            const expectedPolygon = new Polygon([
                new Point(1, 3),
                new Point(6, 3),
                new Point(6, 6),
                new Point(1, 6)
            ]);

            expect(polygon.stretchX(1).equalTo(expectedPolygon)).to.be.true;
        });
    });

    describe('`strechY`', () => {
        it ('stretches the `Polygon` with the given amount on the y axis', () => {
            const polygon = new Polygon([
                new Point(2, 1),
                new Point(5, 1),
                new Point(5, 4),
                new Point(2, 4)
            ]);

            const expectedPolygon = new Polygon([
                new Point(2, -1),
                new Point(5, -1),
                new Point(5, 6),
                new Point(2, 6)
            ]);

            expect(polygon.stretchY(2)).to.eql(expectedPolygon);
        });
    });

    describe('getArea', () => {
        it ('calculates the area of the polygon', () => {
            const polygon = new Polygon([
                new Point(4, 6),
                new Point(4, -4),
                new Point(8, -4),
                new Point(8, -8),
                new Point(-4, -8),
                new Point(-4, 6)
            ]);

            expect(polygon.getArea()).to.eql(128);
        });
    });

    describe('`containsMoreThenHalf`', () => {
        it ('returns true if more than half of the other `Polygon`s area is overlapping with the `Polygon`', () => {
            const polygon = new Polygon([
                new Point(1, 1),
                new Point(3, 1),
                new Point(3, 3),
                new Point(1, 3)
            ]);

            const otherPolygon = new Polygon([
                new Point(1, 0),
                new Point(2, 0),
                new Point(2, 3),
                new Point(1, 3)
            ]);

            expect(polygon.containsMoreThenHalf(otherPolygon)).to.be.true;
        });

        it ('returns false if less than half of the other `Polygon` is overlapping', () => {
            const polygon = new Polygon([
                new Point(1, 1),
                new Point(3, 1),
                new Point(3, 3),
                new Point(1, 3)
            ]);

            const otherPolygon = new Polygon([
                new Point(1, 0),
                new Point(2, 0),
                new Point(2, 6),
                new Point(1, 6)
            ]);

            expect(polygon.containsMoreThenHalf(otherPolygon)).to.be.false;
        });

        it ('returns false if only the border lines are overlapping of the two `Polygon`s sides', () => {
            const polygon = new Polygon([
                new Point(1, 1),
                new Point(3, 1),
                new Point(3, 3),
                new Point(1, 3)
            ]);

            const otherPolygon = new Polygon([
                new Point(0, 0),
                new Point(1, 0),
                new Point(1, 3),
                new Point(0, 3)
            ]);

            expect(polygon.containsMoreThenHalf(otherPolygon)).to.be.false;
        });
    });

    describe('`getUnion`', () => {

        const polygon1 = new Polygon([
            new Point(1, 1),
            new Point(3, 1),
            new Point(3, 3),
            new Point(1, 3),
            new Point(1, 1)
        ]);

        const polygon2 = new Polygon([
            new Point(1, 3),
            new Point(3, 3),
            new Point(4, 4),
            new Point(1, 4),
            new Point(1, 3)

        ]);

        const union = polygon1.getUnion(polygon2);

        1
    });

    // describe('getBoundingCenter', () => {
    //     it ('returns the visual center of the polygon', () => {
    //         const map = `
    //             map \`

    //             WWWWWWWWWWWWWW
    //             W---W--------W
    //             W---WWWWWWWWWW
    //             W------------W
    //             W------------W
    //             WWWWWWWWWWWWWW

    //             \`
    //         `;
    //         const worldMapParser = GwmWorldMapParser.createWithCustomWorldItemGenerator(
    //             new CombinedWorldItemParser(
    //                 [
    //                     new RoomInfoParser(),
    //                 ]
    //             ),
    //         );


    //         const rooms = worldMapParser.parse(map);

    //         const center = rooms[0].dimensions.getBoundingCenter();
    //         expect(center).to.eql(new Point(2.5, 3.5));
    //     });
    // });
});