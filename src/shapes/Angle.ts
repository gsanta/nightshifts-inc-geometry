import { Point } from "./Point";
import * as linear from 'linear-solve';
import { Line } from './Line';

/**
 * An angle is represented as the anticlockwise angle from b to a.
 */
export class Angle {
    private o: Point;
    private a: Point;
    private b: Point;

    private angle: number;

    private constructor(o: Point, a: Point, b: Point) {
        this.o = o;
        this.a = a;
        this.b = b;
        this.angle = this.normalizeAngle(Math.atan2(this.a.y - this.o.y, this.a.x - this.o.x)) - this.normalizeAngle(Math.atan2(this.b.y - this.o.y, this.b.x - this.o.x));
    }

    public getAngle(): number {
        return this.angle;
    }

    public isStraightAngle(): boolean {
        return this.getAngle() === 0 || this.getAngle() === Math.PI || this.getAngle() === -Math.PI;
    }

    public isPointInsideAngle(point: Point) {
        const equation2 = [this.a.y - this.o.y, this.b.y - this.o.y];
        const equation1 = [this.a.x - this.o.x, this.b.x - this.o.x];
        const result = [point.x - this.o.x, point.y - this.o.y];
        const res = linear.solve([equation1, equation2], result);

        return res.length === 2 && res[0] > 0 && res[1] > 0;
    }

    private normalizeAngle(angle: number) {
        return angle < 0 ? angle + 2 * Math.PI : angle;
    }

    static fromRadian(angle: number) {
        const slope = Math.tan(angle);

        const line = Line.fromPointSlopeForm(new Point(0, 0), slope);

        const o = new Point(0, 0);
        const a = slope < 0 ? new Point(-10, line.getY(10)) : new Point(10, line.getY(10));
        const b = new Point(10, 0);

        return new Angle(o, a, b);
    }

    static fromThreePoints(o: Point, a: Point, b: Point) {
        return new Angle(o, a, b);
    }
}

export function toDegree(radian: number) {
    return 180 / Math.PI * radian;
}
