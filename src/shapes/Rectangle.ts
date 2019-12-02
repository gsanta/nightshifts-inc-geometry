import { Point } from './Point';
import { Polygon } from './Polygon';

export class Rectangle extends Polygon {
    readonly topLeft: Point;
    readonly bottomRight: Point;

    constructor(topLeft: Point, bottomRight: Point) {
        super([
            topLeft,
            new Point(bottomRight.x, topLeft.y),
            bottomRight,
            new Point(topLeft.x, bottomRight.y)
        ]);

        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
    }
}