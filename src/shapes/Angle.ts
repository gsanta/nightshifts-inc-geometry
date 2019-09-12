import { Point } from "./Point";
import * as linear from 'linear-solve';
import { Line } from './Line';
import { toRadian } from "../utils/GeometryUtils";
import { Measurements } from '../utils/Measurements';
import { GeometryService } from '../GeometryService';

/**
 * An angle is represented as the anticlockwise angle from b to a.
 */
export class Angle {
    private measurements: Measurements;
    private o: Point;
    private a: Point;
    private b: Point;

    private angle: number;

    private constructor(o: Point, a: Point, b: Point, measurements: Measurements = new Measurements()) {
        this.o = o;
        this.a = a;
        this.b = b;
        this.measurements = measurements;
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

    static fromTwoLines(line1: Line, line2: Line, geometryService: GeometryService = new GeometryService()): Angle {
        if (geometryService.measuerments.linesParallel(line1, line2)) {
            return undefined;
        } else if (line1.isVertical()) {
            return Angle.fromRadian(line2.slope === 0 ? toRadian(90) :  1 / line2.slope);
        } else if (line2.isVertical()) {
            return Angle.fromRadian(line1.slope === 0 ? toRadian(90) :  1 / line1.slope);
        } else {
            const angleBetweenLines = Math.atan((line1.slope - line2.slope) / (1 + line1.slope * line2.slope));
            return Angle.fromRadian(angleBetweenLines);
        }
    }
}

export function toDegree(radian: number) {
    return 180 / Math.PI * radian;
}
