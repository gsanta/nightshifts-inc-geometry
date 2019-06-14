
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

    public negateX(): Point {
        return new Point(-this.x, this.y);
    }

    public negateY(): Point {
        return new Point(this.x, -this.y);
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

    public distanceTo(otherPoint: Point): number {
        return this.subtract(otherPoint).distanceToOrigin();
    }

    public distanceToOrigin(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public subtract(otherPoint: Point): Point {
        return new Point(this.x - otherPoint.x, this.y - otherPoint.y);
    }

    public normalize() {
        const length = this.distanceToOrigin();

        return new Point(this.x / length, this.y / length);
    }

    public isNormalized() {
        return this.distanceToOrigin() === 1;
    }

    public angleTo(otherPoint: Point) {
        const norm1 = this.normalize();
        const norm2 = otherPoint.normalize();
        return Math.atan2(norm1.y, norm1.x) - Math.atan2(norm2.y, norm2.x);
    }

    public clone(): Point {
        return new Point(this.x, this.y);
    }

    public equalTo(otherPoint: Point) {
        return this.x === otherPoint.x && this.y === otherPoint.y;
    }

    public toString(): string {
        return `(${this.x},${this.y})`;
    };
}