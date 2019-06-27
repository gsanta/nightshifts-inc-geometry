import { Polygon } from './Polygon';
import { Point } from './Point';
import { expect } from 'chai';
import { Segment } from './Segment';

describe('Polygon', () => {

    describe(`setPoint`, () => {
        it ('sets the given `Point` and returns with the new `Shape`', () => {
            let polygon = new Polygon([new Point(1, 1), new Point(1, 2), new Point(3, 2), new Point(3, 1)]);
            polygon = polygon.setPoint(2, new Point(3, 3));

            expect(polygon.equalTo(new Polygon([new Point(1, 1), new Point(1, 2), new Point(3, 3), new Point(3, 1)]))).to.be.true;
        });
    });

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
            expect(poly1.intersectBorder(poly2).equalTo(new Segment(new Point(3, 1), new Point(3, 4)))).to.be.true
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

    describe('`getCoincidentLineSegment`', () => {
        it ('returns with the common `Segment` segment if the `Polygon` has a common edge with the other `Shape`', () => {
            const poly1 = new Polygon([
                new Point(1, 1),
                new Point(1, 4),
                new Point(3, 4),
                new Point(3, 1)
            ]);

            const poly2 = new Polygon([
                new Point(3, 1),
                new Point(3, 4),
                new Point(4, 4),
                new Point(4, 1)
            ]);

            expect(poly1.getCoincidentLineSegment(poly2)).to.eql([new Segment(new Point(3, 1), new Point(3, 4)), 2, 0]);
        });

        it ('returns undefined if the two `Shape`s don\'t have common edges', () => {
            const poly1 = new Polygon([
                new Point(1, 1),
                new Point(1, 4),
                new Point(3, 4),
                new Point(3, 1)
            ]);

            const poly2 = new Polygon([
                new Point(4, 1),
                new Point(4, 4),
                new Point(5, 4),
                new Point(5, 1)
            ]);

            expect(poly1.getCoincidentLineSegment(poly2)).to.eql(undefined);
        });

        it ('returns undefined if the two `Shape`s touches only at a vertex.', () => {
            const poly1 = new Polygon([
                new Point(1, 1),
                new Point(1, 4),
                new Point(3, 4),
                new Point(3, 1)
            ]);

            const poly2 = new Polygon([
                new Point(3, 4),
                new Point(3, 6),
                new Point(6, 6),
                new Point(6, 4)
            ]);

            expect(poly1.getCoincidentLineSegment(poly2)).to.eql(undefined);
        });
    });

    describe('scaleX', () => {
        it ('scales the polygon on the x axis', () => {
            const polygon = new Polygon([
                new Point(1, 0),
                new Point(1, 2),
                new Point(4, 2),
                new Point(4, 0)
            ]);
            expect(polygon.scaleX(3)).to.eql(new Polygon([
                new Point(3, 0),
                new Point(3, 2),
                new Point(12, 2),
                new Point(12, 0)
            ]));
        });
    });

    describe('scaleY', () => {
        it ('scales the polygon on the y axis', () => {
            const polygon = new Polygon([
                new Point(1, 0),
                new Point(1, 2),
                new Point(4, 2),
                new Point(4, 0)
            ]);
            expect(polygon.scaleY(3)).to.eql(new Polygon([
                new Point(1, 0),
                new Point(1, 6),
                new Point(4, 6),
                new Point(4, 0)
            ]));
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
                new Point(2, 7),
                new Point(4, 7),
                new Point(5, 6),
                new Point(5, 3),
                new Point(2, 3)
            ]);

            const expectedPolygon = new Polygon([
                new Point(2, -3),
                new Point(2, -7),
                new Point(4, -7),
                new Point(5, -6),
                new Point(5, -3),
                new Point(2, -3)
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
                new Point(2, 6),
                new Point(5, 6),
                new Point(5, 3),
                new Point(2, 3)
            ]);

            expect(polygon.getCircumference()).to.eql(12);
        });
    });


    describe('`strechX`', () => {
        it ('stretches the `Polygon` with the given amount on the x axis', () => {
            const polygon = new Polygon([
                new Point(2, 3),
                new Point(2, 6),
                new Point(5, 6),
                new Point(5, 3)
            ]);

            expect(polygon.stretchX(1)).to.eql(new Polygon([
                new Point(1, 3),
                new Point(1, 6),
                new Point(6, 6),
                new Point(6, 3)
            ]));
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


    describe('`getEdges`', () => {
        it ('returns with a `Segment` array representing the `Polygon` sides from bottom left to clockwise', () => {
            const polygon = new Polygon([
                new Point(1, 1),
                new Point(3, 1),
                new Point(3, 3),
                new Point(1, 3)
            ]);
            expect(polygon.getEdges()).to.eql(
                [
                    new Segment(new Point(1, 1), new Point(1, 3)),
                    new Segment(new Point(1, 3), new Point(3, 3)),
                    new Segment(new Point(3, 3), new Point(3, 1)),
                    new Segment(new Point(3, 1), new Point(1, 1)),
                ]
            )
        });
    });

    describe('`getCoincidingSidesForLine`', () => {
        it ('returns the correct side of the `Polygon` and it\'s index which conincides with the `Segment` given as a parameter.', () => {
            const polygon = new Polygon([
                new Point(5, 5),
                new Point(5, 3),
                new Point(4, 3),
                new Point(4, 2),
                new Point(1, 2),
                new Point(1, 5)
            ]);

            const coincidingSides = polygon.getCoincidingSidesForLine(new Segment(new Point(3, 3), new Point(5, 3)));

            expect(coincidingSides.length).to.equal(1);
            expect(coincidingSides[0]).to.eql([new Segment(new Point(5, 3), new Point(4, 3)), 3]);
        });
    });

    describe('`getBoundingRectangle`', () => {
        it ('calculates the `Rectangle` which surrounds the `Polygon`', () => {
            const polygon = new Polygon([
                new Point(1, 1),
                new Point(1, 3),
                new Point(3, 3),
                new Point(3, 5),
                new Point(6, 5),
                new Point(6, 4),
                new Point(5, 4),
                new Point(5, 1)
            ]);

            const boundingRectangle = polygon.getBoundingRectangle();
            expect(boundingRectangle).to.eql(new Polygon([
                new Point(1, 1),
                new Point(1, 5),
                new Point(6, 5),
                new Point(6, 1)
            ]));
        });

        it ('gives back the same shape if the `Polygon` is already a `Rectangle`', () => {
            const polygon = new Polygon([
                new Point(1, 1),
                new Point(1, 3),
                new Point(3, 3),
                new Point(3, 1)
            ]);

            const boundingRectangle = polygon.getBoundingRectangle();
            expect(boundingRectangle).to.eql(polygon);
        });
    });

    describe(`createRectangle`, () => {
        it ('creates a `Polygon` which has the features of a rectangle.', () => {
            const rectangle = Polygon.createRectangle(3, 5, 3, 2);

            expect(rectangle).to.eql(new Polygon([
                new Point(3, 5),
                new Point(3, 7),
                new Point(6, 7),
                new Point(6, 5)
            ]));
        });
    });

    describe(`removeStraightVertices`, () => {
        it ('removes the points from the `Polygon` which form a straight angle between the prev and next `Point`s', () => {
            const polygon = new Polygon([
                new Point(1, 1),
                new Point(1, 3),
                new Point(1, 5),
                new Point(4, 5),
                new Point(6, 5),
                new Point(7, 5),
                new Point(7, 1),
            ]);

            expect(polygon.removeStraightVertices()).to.eql(new Polygon([
                new Point(1, 1),
                new Point(1, 5),
                new Point(7, 5),
                new Point(7, 1),
            ]))
        });
    });

    describe('toString', () => {
        it ('creates a string representation of the `Polygon`', () => {
            const polygon = new Polygon([
                new Point(3, 5),
                new Point(3, 7),
                new Point(6, 7),
                new Point(6, 5)
            ]);

            expect(polygon.toString()).to.eq('[(3,5)(3,7)(6,7)(6,5)]');
        });
    });

    describe('setPosition', () => {
        it ('sets the center of the Polygon to the given position', () => {
            const polygon = Polygon.createRectangle(1, 2, 4, 3);

            expect(polygon.setPosition(new Point(3, 3))).to.eql(Polygon.createRectangle(1, 1.5, 4, 3));
        });
    });
});