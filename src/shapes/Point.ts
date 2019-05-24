
export class Point {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public addX(amount: number): Point {
        return new Point(this.x + amount, this.y);
    }

    public addY(amount: number): Point {
        return new Point(this.x, this.y + amount);
    }

    public scaleX(times: number): Point {
        return new Point(this.x * times, this.y);
    }

    public scaleY(times: number): Point {
        return new Point(this.x, this.y * times);
    }

    public negate(): Point {
        return new Point(-this.x, - this.y);
    }

    /*
     * Returns true if the line through this and the parameter is not
     * vertical and not horizontal
     */
    public isDiagonalTo(otherPoint: Point): boolean {
        return this.x !== otherPoint.x && this.y !== otherPoint.y;
    }

    public absoluteDistanceTo(otherPoint: Point): [number, number] {
        return [
            Math.abs(this.x - otherPoint.x),
            Math.abs(this.y - otherPoint.y)
        ];
    }

    public distanceTo(otherPoint: Point) {
        return [
            this.x - otherPoint.x,
            this.y - otherPoint.y
        ];
    }

    public clone(): Point {
        return new Point(this.x, this.y);
    }

    public equalTo(otherPoint: Point) {
        return this.x === otherPoint.x && this.y === otherPoint.y;
    }
}