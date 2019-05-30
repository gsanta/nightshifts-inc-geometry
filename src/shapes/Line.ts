import { Point } from "./Point";
import { Shape, ShapeOrigin } from './Shape';

export class Line implements Shape {
    public points: [Point, Point] = [null, null];

    constructor(endPoint1: Point, endPoint2: Point) {
        [this.points[0], this.points[1]] = this.orderPoints(endPoint1, endPoint2);
    }

    public addX(amount: number): Shape {
        return new Line(this.points[0].addX(amount), this.points[1].addX(amount));
    }

    public addY(amount: number): Shape {
        return new Line(this.points[0].addY(amount), this.points[1].addY(amount));
    }

    public minX(): number {
        return this.points[0].x < this.points[1].x ? this.points[0].x : this.points[1].x;
    }

    public maxX(): number {
        return this.points[0].x > this.points[1].x ? this.points[0].x : this.points[1].x;
    }

    public minY(): number {
        return this.points[0].y < this.points[1].y ? this.points[0].y : this.points[1].y;

    }

    public maxY(): number {
        return this.points[0].y > this.points[1].y ? this.points[0].y : this.points[1].y;
    }

    public translate(point: Point): Shape {
        return this.addX(point.x).addY(point.y);
    }

    public negateX(): Shape {
        return new Line(this.points[0].negateX(), this.points[1].negateX());
    }

    public negateY(): Shape {
        return new Line(this.points[0].negateY(), this.points[1].negateY());
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
        return new Line(this.points[0], this.points[1]);
    }

    public setPosition(point: Point, origin: ShapeOrigin = ShapeOrigin.CENTER): Shape {
        const diff = this.getBoundingCenter().distanceTo(point);

        return new Line(this.points[0].addX(diff[0]).addY(diff[1]), this.points[1].addX(diff[0]).addY(diff[1]));
    }

    public getBoundingCenter(): Point {
        return new Point((this.points[0].x + this.points[1].x) / 2, (this.points[0].y + this.points[1].y) / 2);
    }

    public isVertical() {
        return this.points[0].x === this.points[1].x;
    }

    public isHorizontal() {
        return this.points[0].y === this.points[1].y;
    }

    public getCoincidentLineSegment(other: Shape): [Line, number, number] {
        const otherEdges = other.getEdges();

        for (let i = 0; i < otherEdges.length; i++) {
            const overlap = this.getCommonLineSegmentIfExists(otherEdges[i]);
            if (overlap) {
                return [overlap, 0, i];
            }
        }
    }

    public getEdges(): Line[] {
        return [this];
    }

    /**
     * Returns true if the `Line` segment in the parameter determines the same infinite line.
     */
    public isCoincidentToLine(otherLine: Line) {
        return this.isPointOnTheLine(otherLine.points[0]) && this.isPointOnTheLine(otherLine.points[1]);
    }

    /**
     * Returns true if the `Point` in the parameter lies on the `Line`.
     */
    public isPointOnTheLine(point: Point): boolean {
        const slope = this.getSlope();

        if (slope === undefined) {
            return point.x === this.points[0].x;
        } else {
            return point.y - this.points[0].y === this.getSlope() * (point.x - this.points[0].x)
        }
    }

    /**
     * Determines if the `Line` segment in the parameter overlaps with this `Line`, if so returns the overlap as a `Line` segment,
     * otherwise returns undefined.
     */
    private getCommonLineSegmentIfExists(otherLine: Line): Line {
        if (!this.isCoincidentToLine(otherLine)) {
            return undefined;
        }

        let [a, b] = [this.points[0].x, this.points[0].y];
        let [c, d] = [this.points[1].x, this.points[1].y];
        let [e, f] = [otherLine.points[0].x, otherLine.points[0].y];
        let [g, h] = [otherLine.points[1].x, otherLine.points[1].y];

        if (this.isVertical()) {
            [a, b, c, d] = b < d ? [a, b, c, d] : [c, d, a, b];
            [e, f, g, h] = f < h ? [e, f, g, h] : [g, h, e, f];

            if (b <= f && d >= h) {
                return new Line(new Point(e, f), new Point(g, h));
            } else if (f <= b && h >= d) {
                return new Line(new Point(a, b), new Point(c, d));
            } else if (b < f && d > f) {
                return new Line(new Point(e, f), new Point(c, d));
            } else if (f < b && h > b) {
                return new Line(new Point(a, b), new Point(g, h));
            }
        } else {
            [a, b, c, d] = a < c ? [a, b, c, d] : [c, d, a, b];
            [e, f, g, h] = e < g ? [e, f, g, h] : [g, h, e, f];

            if (a <= e && c >= g) {
                return new Line(new Point(e, f), new Point(g, h));
            } else if (e <= a && g >= c) {
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
        if (this.points[0].x === this.points[1].x) {
            return undefined;
        }
        return (this.points[1].y - this.points[0].y) / (this.points[1].x - this.points[0].x);
    }

    public scaleX(times: number): Line {
        return new Line(this.points[0].scaleX(times), this.points[1].scaleX(times));
    }

    public scaleY(times: number): Line {
        return new Line(this.points[0].scaleY(times), this.points[1].scaleY(times));
    }

    public addToEnd(amount: number) {
        if (this.isVertical()) {
            return new Line(this.points[0], this.points[1].addY(amount));
        } else {
            return new Line(this.points[0], this.points[1].addX(amount));
        }
    }

    public addToStart(amount: number) {
        if (this.isVertical()) {
            return new Line(this.points[0].addY(amount), this.points[1]);
        } else {
            return new Line(this.points[0].addX(amount), this.points[1]);
        }
    }

    public equalTo(otherLine: Line): boolean {
        return this.points[0].equalTo(otherLine.points[0]) && this.points[1].equalTo(otherLine.points[1]);
    }

    public getLength(): number {
        const xDistance = Math.abs(this.points[0].x - this.points[1].x);
        const yDistance = Math.abs(this.points[0].y - this.points[1].y);

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