import { Point } from "./Point";

export class Line {
    public start: Point;
    public end: Point;

    constructor(endPoint1: Point, endPoint2: Point) {
        [this.start, this.end] = this.orderPoints(endPoint1, endPoint2);
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

        const [p1MinX, p1MaxX] = this.start.x < this.end.x ? [this.start, this.end] : [this.end, this.start];
        const [p2MinX, p2MaxX] = otherLine.start.x < otherLine.end.x ? [otherLine.start, otherLine.end] : [otherLine.end, otherLine.start];

        if (p1MinX.x < p2MinX.x && p1MaxX.x > p2MaxX.x) {
            return new Line(p2MinX, p2MaxX);
        } else if (p2MinX.x < p1MinX.x && p2MaxX.x > p1MaxX.x) {
            return new Line(p1MinX, p1MaxX);
        } else if (p1MinX.x < p2MinX.x && p1MaxX.x > p2MinX.x) {
            return new Line(p2MinX, p1MaxX);
        } else if (p2MinX.x < p1MinX.x && p2MaxX.x > p1MinX.x) {
            return new Line(p1MinX, p2MaxX);
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