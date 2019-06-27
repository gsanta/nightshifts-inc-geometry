import { Point } from "./Point";
import { Shape, ShapeOrigin } from './Shape';
import * as _ from "lodash";
import { Polygon } from './Polygon';
import { Line } from './Line';

export class Segment implements Shape {
    private points: [Point, Point] = [null, null];
    private orderedPoints: [Point, Point] = [null, null];

    constructor(endPoint1: Point, endPoint2: Point) {
        [this.points[0], this.points[1]] = [endPoint1, endPoint2];
    //    this.orderedPoints = this.orderPoints(...this.points);
        this.orderedPoints = this.points;
    }

    public getPoints(): Point[] {
        return this.orderedPoints;
    }

    public getIndexedPoints(): [Point, number][] {
        return this.points.map((point, index) => [point, index]);
    }

    public setPoint(index: number, newPoint: Point): Shape {
        const clonedPoints = [...this.points];
        clonedPoints.splice(index, 1, newPoint);

        return new Polygon(clonedPoints);
    }

    public hasPoint(point: Point): boolean {
        return _.find(this.points, p => p.equalTo(point)) !== undefined;
    }

    public addX(amount: number): Shape {
        return new Segment(this.points[0].addX(amount), this.points[1].addX(amount));
    }

    public addY(amount: number): Shape {
        return new Segment(this.points[0].addY(amount), this.points[1].addY(amount));
    }

    public xExtent(): number {
        return this.maxX() - this.minX();
    }

    public yExtent(): number {
        return this.maxY() - this.minY();
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
        return new Segment(this.points[0].negateX(), this.points[1].negateX());
    }

    public negateY(): Shape {
        return new Segment(this.points[0].negateY(), this.points[1].negateY());
    }

    public mirrorY(): Shape {
        /**
         * For a `Segment` negate and mirror means the same
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
        return new Segment(this.points[0], this.points[1]);
    }

    public setPosition(point: Point, origin: ShapeOrigin = ShapeOrigin.CENTER): Shape {
        const diff = this.getBoundingCenter().subtract(point);

        return new Segment(this.points[0].addX(diff.x).addY(diff.y), this.points[1].addX(diff.x).addY(diff.y));
    }

    public getBoundingRectangle(): Shape {
        let [x1, x2] = [this.points[0].x, this.points[1].x];
        let [y1, y2] = [this.points[0].y, this.points[1].y];

        [x1, x2] = x1 < x2 ? [x1, x2] : [x2, x1];
        [y1, y2] = y1 < y2 ? [y1, y2] : [y2, y1];

        return new Polygon([new Point(x1, y1), new Point(x1, y2), new Point(x2, y2), new Point(x2, y1)]);
    }

    public getBoundingCenter(): Point {
        return new Point((this.orderedPoints[0].x + this.orderedPoints[1].x) / 2, (this.orderedPoints[0].y + this.orderedPoints[1].y) / 2);
    }

    public isVertical() {
        return this.points[0].x === this.points[1].x;
    }

    public isHorizontal() {
        return this.points[0].y === this.points[1].y;
    }

    public getCoincidentLineSegment(other: Shape): [Segment, number, number] {
        const otherEdges = other.getEdges();

        for (let i = 0; i < otherEdges.length; i++) {
            const overlap = this.getCommonLineSegmentIfExists(otherEdges[i]);
            if (overlap) {
                return [overlap, 0, i];
            }
        }
    }

    public getEdges(): Segment[] {
        return [this];
    }

    /**
     * Returns true if the `Segment` segment in the parameter determines the same infinite line.
     */
    public isCoincidentToLine(otherLine: Segment) {
        return this.isPointOnTheLine(otherLine.points[0]) && this.isPointOnTheLine(otherLine.points[1]);
    }

    /**
     * Returns true if the `Point` in the parameter lies on the `Segment`.
     */
    public isPointOnTheLine(point: Point): boolean {
        const slope = this.getSlope();

        if (slope === undefined) {
            return point.x === this.points[0].x;
        } else {
            return point.y - this.points[0].y === this.getSlope() * (point.x - this.points[0].x)
        }
    }

    public getPerpendicularBisector(): Line {
        let slope = this.getSlope();
        if (slope === 0) {
            return Line.createFromPointSlopeForm(this.getBoundingCenter(), undefined);
        } else if (slope === undefined) {
            return Line.createFromPointSlopeForm(this.getBoundingCenter(), 0);
        } else {
            return Line.createFromPointSlopeForm(this.getBoundingCenter(), -this.getSlope());
        }
    }

    /**
     * Determines if the `Segment` segment in the parameter overlaps with this `Segment`, if so returns the overlap as a `Segment` segment,
     * otherwise returns undefined.
     */
    private getCommonLineSegmentIfExists(otherLine: Segment): Segment {
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
                return new Segment(new Point(e, f), new Point(g, h));
            } else if (f <= b && h >= d) {
                return new Segment(new Point(a, b), new Point(c, d));
            } else if (b < f && d > f) {
                return new Segment(new Point(e, f), new Point(c, d));
            } else if (f < b && h > b) {
                return new Segment(new Point(a, b), new Point(g, h));
            }
        } else {
            [a, b, c, d] = a < c ? [a, b, c, d] : [c, d, a, b];
            [e, f, g, h] = e < g ? [e, f, g, h] : [g, h, e, f];

            if (a <= e && c >= g) {
                return new Segment(new Point(e, f), new Point(g, h));
            } else if (e <= a && g >= c) {
                return new Segment(new Point(a, b), new Point(c, d));
            } else if (a < e && c > e) {
                return new Segment(new Point(e, f), new Point(c, d));
            } else if (e < a && g > a) {
                return new Segment(new Point(a, b), new Point(g, h));
            }
        }


    }

    /**
     * Calculates the slope of the `Segment` or undefined if vertical line.
     */
    public getSlope(): number {
        if (this.points[0].x === this.points[1].x) {
            return undefined;
        }
        return (this.points[1].y - this.points[0].y) / (this.points[1].x - this.points[0].x);
    }

    public scaleX(times: number): Segment {
        return new Segment(this.points[0].scaleX(times), this.points[1].scaleX(times));
    }

    public scaleY(times: number): Segment {
        return new Segment(this.points[0].scaleY(times), this.points[1].scaleY(times));
    }

    public stretchX(amount: number): Segment {
        const minByX = _.minBy(this.points, point => point.x);
        const maxByX = _.maxBy(this.points, point => point.x);
        return new Segment(new Point(minByX.x - amount, minByX.y), new Point(maxByX.x + amount, maxByX.y));
    }

    public stretchY(amount: number): Segment {
        const minByY = _.minBy(this.points, point => point.y);
        const maxByY = _.maxBy(this.points, point => point.y);
        return new Segment(new Point(minByY.x, minByY.y - amount), new Point(maxByY.x, maxByY.y + amount));
    }

    public addToEnd(amount: number) {
        if (this.isVertical()) {
            return new Segment(this.points[0], this.points[1].addY(amount));
        } else {
            return new Segment(this.points[0], this.points[1].addX(amount));
        }
    }

    public addToStart(amount: number) {
        if (this.isVertical()) {
            return new Segment(this.points[0].addY(amount), this.points[1]);
        } else {
            return new Segment(this.points[0].addX(amount), this.points[1]);
        }
    }

    public equalTo(otherLine: Segment): boolean {
        return _.some(otherLine.getPoints(), point => point.equalTo(this.getPoints()[0])) && _.some(otherLine.getPoints(), point => point.equalTo(this.getPoints()[1]));
    }

    public getLength(): number {
        const xDistance = Math.abs(this.points[0].x - this.points[1].x);
        const yDistance = Math.abs(this.points[0].y - this.points[1].y);

        return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    }

    public getB(): Point {
        return new Point(0, this.points[0].y - this.getSlope() * this.points[0].x);
    }

    public getLine(): Line {
        return Line.createFromPointSlopeForm(this.points[0], this.getSlope());
    }

    public stretch(amount: number, end: 'END_0' | 'END_1' | 'END_BOTH' = 'END_BOTH'): Segment {
        const radius = this.getLength() / 2 + amount;

        if (radius <= 0) {
            throw new Error(`Can not stretch segment by ${amount} unit because the resulting length would be <= 0.`);
        }

        if (end !== 'END_BOTH') {
            throw new Error(`shorten by ${end} is not implemented yet.`);
        }

        const [point1, point2] = this.getLine().getSegmentWithCenterPointAndDistance(this.getBoundingCenter(), radius);

        return new Segment(point1, point2);
    }

    public toString(): string {
        return `[${this.points[0].toString()},${this.points[1].toString()}]`;
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