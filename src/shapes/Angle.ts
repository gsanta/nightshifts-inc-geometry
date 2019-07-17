import { Point } from "./Point";
import * as linear from 'linear-solve';

/**
 * An angle is represented as the anticlockwise angle from b to a.
 */
export class Angle {
    public o: Point;
    public a: Point;
    public b: Point;

    constructor(o: Point, a: Point, b: Point) {
        this.o = o;
        this.a = a;
        this.b = b;
    }

    public getAngle(): number {
        return Math.atan2(this.a.y - this.o.y, this.a.x - this.o.x) - Math.atan2(this.b.y - this.o.y, this.b.x - this.o.x);
    }

    public isStraightAngle(): boolean {
        return this.getAngle() === 0 || this.getAngle() === Math.PI || this.getAngle() === -Math.PI;
    }

    public isPointInsideAngle(point: Point) {
        const equation1 = [this.a.x - this.o.x, this.b.x - this.o.x];
        const equation2 = [this.a.y - this.o.y, this.b.y - this.o.y];
        const result = [point.x - this.o.x, point.y - this.o.y];
        const res = linear.solve([equation1, equation2], result);

        return res.length === 2 && res[0] > 0 && res[1] > 0;
    }

    private isCCW(a: Point, b: Point, c: Point) {
        return ((a.x - c.x)*(b.y - c.y) - (a.y - c.y)*(b.x - c.x)) > 0;
    }
}
