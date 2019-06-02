import { Point } from './Point';
import { Segment } from './Segment';
import range from 'lodash/range';
import _ from 'lodash';
import { ShapeOrigin, Shape } from './Shape';
import { Polygon } from '../index';

export class Rectangle implements Shape {
    private polygon: Polygon;
    public points: Point[];
    public left: number;
    public top: number;
    public width: number;
    public height: number;

    constructor(left: number, top: number, width: number, height: number) {
        this.polygon = new Polygon([
            new Point(left, top),
            new Point(left + width, top),
            new Point(left + width, top + height),
            new Point(left, top + height),
        ]);
        this.points = this.polygon.points;
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }

    public minX(): number {
        return this.polygon.minX();
    }

    public maxX(): number {
        return this.polygon.maxX();
    }

    public minY(): number {
        return this.polygon.minY();
    }

    public maxY(): number {
        return this.polygon.maxY();
    }

    public scaleX(times: number): Shape {
        const scaled = this.polygon.scaleX(times);
        return new Rectangle(scaled.maxY(), scaled.minX(), scaled.maxX() - scaled.minX(), scaled.maxY() - scaled.minY());
    }

    public scaleY(times: number): Shape {
        const scaled = this.polygon.scaleY(times);
        return new Rectangle(scaled.maxY(), scaled.minX(), scaled.maxX() - scaled.minX(), scaled.maxY() - scaled.minY());
    }

    /**
     * Stretches the `Rectangle` in the x direction by the given `amount` while keeping the center point
     */
    public stretchX(amount: number): Rectangle {
        return new Rectangle(this.left - amount, this.top, this.width + amount * 2, this.height);
    }

    /**
     * Stretches the `Rectangle` in the x direction by the given `amount` while keeping the center point
     */
    public stretchY(amount: number): Rectangle {
        return new Rectangle(this.left, this.top - amount, this.width, this.height + amount * 2);
    }

    public translate(point: Point): Shape {
        return this.polygon.translate(point).getBoundingRectangle();
    }


    /**
     * Sets the height of the `Rectangle`, the name is general to be able to apply it
     * to other types of shapes as well.
     */
    public setBoundingHeight(newHeight: number): Rectangle {
        return new Rectangle(this.left, this.top, this.width, newHeight);
    }

    /**
     * Sets the width of the `Rectangle`, the name is general to be able to apply it
     * to other types of shapes as well.
     */
    public setBoundingWidth(newWidth: number): Rectangle {
        return new Rectangle(this.left, this.top, newWidth, this.height);
    }

    /**
     * Returns the center `Point` of the `Rectangle`
     */
    public getBoundingCenter(): Point {
        return new Point(this.left + this.width / 2, this.top + this.height / 2);
    }

    public getBoundingRectangle(): Rectangle {
        return this;
    }

    public getCoincidentLineSegment(other: Shape): [Segment, number, number] {
        return this.polygon.getCoincidentLineSegment(other);
    }

    public addX(amount: number): Shape {
        return new Rectangle(this.left + amount, this.top, this.width, this.height);
    }

    public addY(amount: number): Shape {
        return new Rectangle(this.left, this.top + amount, this.width, this.height);
    }

    public negateX(): Shape {
        return new Rectangle(-this.left, this.top, this.width, this.height);
    }

    /**
     * @deprecated not clear why is it useful most of the time `mirrorY` should be used
     */
    public negateY(): Shape {
        return new Rectangle(this.left, -this.top, this.width, this.height);
    }

    public mirrorY(): Shape {
        return new Rectangle(this.left, -(this.top + this.height), this.width, this.height);
    }

    public getCircumference(): number {
        return this.polygon.getCircumference();
    }

    public getArea(): number {
        return this.polygon.getArea();
    }


    public setPosition(point: Point, origin: ShapeOrigin = ShapeOrigin.CENTER): Shape {
        const diff = this.getBoundingCenter().distanceTo(point);

        return this.addX(-diff[0]).addY(-diff[1]);
    }

    /**
     * Returns the two `Segment`s which halve the `Rectangle` into two smaller `Rectangle`s
     * TODO: it only works for `Rectangle`s which are aligned to the x or y axis, but does not work for rotated `Rectangle`s
     */
    public getCenterLines(): Segment[] {
        const centerX = this.left + this.width / 2;
        const centerY = this.top - this.height / 2;
        const line1 = new Segment(new Point(centerX, this.top), new Point(centerX, this.top - this.height));
        const line2 = new Segment(new Point(this.left, centerY), new Point(this.left + this.width, centerY));

        return [line1, line2];
    }

    /**
     * Calculates the two sides that are narrower than the other two or null
     * if it is a square.
     */
    public getNarrowSides(): [Segment, Segment] {
        if (this.width < this.height) {
            return [
                new Segment(this.points[0], this.points[1]),
                new Segment(this.points[3], this.points[2])
            ]
        } else if (this.width > this.height) {
            return [
                new Segment(this.points[1], this.points[2]),
                new Segment(this.points[0], this.points[3])
            ]
        } else {
            return null;
        }
    }

    public clone(): Rectangle {
        return new Rectangle(this.left, this.top, this.width, this.height);
    }

    public getEdges(): Segment[] {
        return this.polygon.getEdges();
    }

}