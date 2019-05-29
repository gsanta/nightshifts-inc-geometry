import { Point } from "./Point";
import { Shape, ShapeOrigin } from './Shape';

export class Line implements Shape {
    public start: Point;
    public end: Point;

    constructor(endPoint1: Point, endPoint2: Point) {
        [this.start, this.end] = this.orderPoints(endPoint1, endPoint2);
    }

    public addX(amount: number): Shape {
        return new Line(this.start.addX(amount), this.end.addX(amount));
    }

    public addY(amount: number): Shape {
        return new Line(this.start.addY(amount), this.end.addY(amount));
    }

    public translate(point: Point): Shape {
        return this.addX(point.x).addY(point.y);
    }

    public negateX(): Shape {
        return new Line(this.start.negateX(), this.end.negateX());
    }

    public negateY(): Shape {
        return new Line(this.start.negateY(), this.end.negateY());
    }

    public mirrorY(): Shape {
        /**
         * For a `Line` negate and mirror means the same
         */
        return this.negateY();
    }

    public getCircumference(): number {
        return 2 * this.getLength();
    }

    public getArea(): number {
        return 0;
    }

    public clone(): Shape {
        return new Line(this.start, this.end);
    }

    public setPosition(point: Point, origin: ShapeOrigin = ShapeOrigin.CENTER): Shape {
        const diff = this.getBoundingCenter().distanceTo(point);

        return new Line(this.start.addX(diff[0]).addY(diff[1]), this.end.addX(diff[0]).addY(diff[1]));
    }

    public getBoundingCenter(): Point {
        return new Point((this.start.x + this.end.x) / 2, (this.start.y + this.end.y) / 2);
    }

    public isVertical() {
        return this.start.x === this.end.x;
    }

    public isHorizontal() {
        return this.start.y === this.end.y;
    }

    /**
     * Returns true if the `Line` segment in the parameter determines the same infinite line.
     */
    public isCoincidentToLine(otherLine: Line) {
        return this.isPointOnTheLine(otherLine.start) && this.isPointOnTheLine(otherLine.end);
    }

    /**
     * Returns true if the `Point` in the parameter lies on the `Line`.
     */
    public isPointOnTheLine(point: Point): boolean {
        const slope = this.getSlope();

        if (slope === undefined) {
            return point.x === this.start.x;
        } else {
            return point.y - this.start.y === this.getSlope() * (point.x - this.start.x)
        }

    }

    /**
     * Determines if the `Line` segment in the parameter overlaps with this `Line`, if so returns the overlap as a `Line` segment,
     * otherwise returns undefined.
     */
    public overlapsLine(otherLine: Line): Line {
        if (!this.isCoincidentToLine(otherLine)) {
            return undefined;
        }

        let [a, b] = [this.start.x, this.start.y];
        let [c, d] = [this.end.x, this.end.y];
        let [e, f] = [otherLine.start.x, otherLine.start.y];
        let [g, h] = [otherLine.end.x, otherLine.end.y];

        if (this.isVertical()) {
            [a, b, c, d] = b < d ? [a, b, c, d] : [c, d, a, b];
            [e, f, g, h] = f < h ? [e, f, g, h] : [g, h, e, f];

            if (b < f && d > h) {
                return new Line(new Point(e, f), new Point(g, h));
            } else if (f < b && h > d) {
                return new Line(new Point(a, b), new Point(c, d));
            } else if (b < f && d > f) {
                return new Line(new Point(e, f), new Point(c, d));
            } else if (f < b && h > b) {
                return new Line(new Point(a, b), new Point(g, h));
            }
        } else {
            [a, b, c, d] = a < c ? [a, b, c, d] : [c, d, a, b];
            [e, f, g, h] = e < g ? [e, f, g, h] : [g, h, e, f];

            if (a < e && c > g) {
                return new Line(new Point(e, f), new Point(g, h));
            } else if (e < a && g > c) {
                return new Line(new Point(a, b), new Point(c, d));
            } else if (a < e && c > e) {
                return new Line(new Point(e, f), new Point(c, d));
            } else if (e < a && g > a) {
                return new Line(new Point(a, b), new Point(g, h));
            }
        }


    }

    /**
     * Calculates the slope of the `Line` or undefined if vertical line.
     */
    public getSlope(): number {
        if (this.start.x === this.end.x) {
            return undefined;
        }
        return (this.end.y - this.start.y) / (this.end.x - this.start.x);
    }

    public scaleX(times: number): Line {
        return new Line(this.start.scaleX(times), this.end.scaleX(times));
    }

    public scaleY(times: number): Line {
        return new Line(this.start.scaleY(times), this.end.scaleY(times));
    }

    public addToEnd(amount: number) {
        if (this.isVertical()) {
            return new Line(this.start, this.end.addY(amount));
        } else {
            return new Line(this.start, this.end.addX(amount));
        }
    }

    public addToStart(amount: number) {
        if (this.isVertical()) {
            return new Line(this.start.addY(amount), this.end);
        } else {
            return new Line(this.start.addX(amount), this.end);
        }
    }

    public equalTo(otherLine: Line): boolean {
        return this.start.equalTo(otherLine.start) && this.end.equalTo(otherLine.end);
    }

    public getLength(): number {
        const xDistance = Math.abs(this.start.x - this.end.x);
        const yDistance = Math.abs(this.start.y - this.end.y);

        return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    }

    private orderPoints(endPoint1: Point, endPoint2: Point): [Point, Point] {
        if (endPoint1.y < endPoint2.y) {
            return [endPoint1, endPoint2];
        } else if (endPoint1.x < endPoint2.x) {
            return [endPoint1, endPoint2];
        } else {
            return [endPoint2, endPoint1];
        }
    }
}