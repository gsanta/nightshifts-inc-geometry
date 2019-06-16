import { Point } from "./Point";

/**
 * An angle is represented as the anticlockwise angle from c to b.
 */
export class Angle {
    public a: Point;
    public b: Point;
    public c: Point;

    constructor(a: Point, b: Point, c: Point) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    public getAngle(): number {
        return Math.atan2(this.b.y - this.a.y, this.b.x - this.a.x) - Math.atan2(this.c.y - this.a.y, this.c.x - this.a.x);
    }


    public isStraightAngle(): boolean {
        return this.getAngle() === 0 || this.getAngle() === Math.PI || this.getAngle() === -Math.PI;
    }
}
