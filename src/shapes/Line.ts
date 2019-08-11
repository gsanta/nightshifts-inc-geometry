import { Point } from "./Point";
import { Angle } from "./Angle";

export class Line {
    public m: number;
    public b: number;

    constructor(m: number, b: number) {
        this.m = m;
        this.b = b;
    }

    public getSegmentWithCenterPointAndDistance(centerPoint: Point, d: number): [Point, Point] {
        if (this.isHorizontal()) {
            return [new Point(centerPoint.x - d, centerPoint.y), new Point(centerPoint.x + d, centerPoint.y)];
        } else if (this.isVertical()) {
            return [new Point(centerPoint.x, centerPoint.y - d), new Point(centerPoint.x, centerPoint.y + d)];
        } else {
            const x1 = centerPoint.x + d / (Math.sqrt(1 + Math.pow(this.m, 2)));
            const x2 = centerPoint.x - d / (Math.sqrt(1 + Math.pow(this.m, 2)));

            const y1 = this.getY(x1);
            const y2 = this.getY(x2);

            return [new Point(x1, y1), new Point(x2, y2)];
        }
    }

    public getX(y: number): number {
        if (this.isHorizontal()) {
            throw new Error('`getX` not supported for horizontal lines.')
        }
        return (y - this.b) / this.m;
    }

    public getY(x: number): number {
        if (this.isVertical()) {
            throw new Error('`getY` not supported for vertical lines.')
        }
        return this.m * x + this.b;
    }

    public isVertical(): boolean {
        return this.m === undefined;
    }

    public isHorizontal(): boolean {
        return this.m === 0;
    }

    public hasEqualSlope(otherLine: Line): boolean {
        const thisM = this.m === undefined ? Number.MAX_VALUE : this.m;
        const thatM = otherLine.m === undefined ? Number.MAX_VALUE: otherLine.m;

        return Math.abs(thisM - thatM) < 0.1;
    }

    public intersection(otherLine: Line): Point {
        if (this.m === otherLine.m) {
            return undefined;
        }

        let x: number;

        if (this.m === undefined) {
            x = this.b;
        } else if (otherLine.m === undefined) {
            x = otherLine.b;
        } else {
            x = (otherLine.b - this.b) / (this.m - otherLine.m);
        }

        let y: number;
        if (this.m === undefined) {
            y = otherLine.getY(x);
        } else {
            y = this.getY(x);
        }

        return new Point(x, y);
    }

    getAngleToXAxis() {
        if (this.isVertical()) {
            return Angle.fromRadian(Math.PI / 2);
        }

        const xAxis = Line.createHorizontalLine(0);
        // const xAxis = new Segment(new Point(0, 0), new Point(10, 0)).getLine();
        const o = xAxis.intersection(this);

        if (o !== undefined) {
            const a = new Point(o.x + 10, this.getY(o.x + 10));
            const b = new Point(o.x + 10, 0);

            return Angle.fromThreePoints(o, a, b);

        }

        return Angle.fromThreePoints(new Point(0, 0), new Point(0, 0), new Point(0, 0));

    }

    public static createFromPointSlopeForm(point: Point, m: number): Line {
        if (m === undefined) {
            return new Line(undefined, point.x);
        } else if (m === 0) {
            return new Line(0, point.y);
        } else {
            const b = (0 - point.x) * m + point.y;
            return new Line(m, b);
        }
    }

    public static createVerticalLine(x: number) {
        return new Line(undefined, x);
    }

    public static createHorizontalLine(y: number) {
        return new Line(0, y);
    }
}