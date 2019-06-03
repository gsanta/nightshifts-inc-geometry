import { Point } from "./Point";
import { Segment } from "./Segment";

export enum ShapeOrigin {
    CENTER
}

export interface Shape {
    points: Point[];
    addX(amount: number): Shape;
    addY(amount: number): Shape;

    /**
     * A more general term for the 'width' of the `Shape`, that returns `maxX` - `minX`.
     */
    xExtent(): number;
    /**
     * A more general term for the 'height' of the `Shape`, that returns `maxY` - `minY`.
     */
    yExtent(): number;
    /**
     * Returns with the minimum x position of all of the `Shape`'s points.
     */
    minX(): number
    /**
     * Returns with the maximum x position of all of the `Shape`'s points.
     */
    maxX(): number;
    /**
     * Returns with the minimum y position of all of the `Shape`'s points.
     */
    minY(): number

    /**
     * Returns with the maximum y position of all of the `Shape`'s points.
     */
    maxY(): number;
    scaleX(times: number): Shape;
    scaleY(times: number): Shape;
    /**
     * Stretches the `Shape` in the x direction by the given `amount` while keeping the center point
     */
    stretchX(amount: number): Shape;
    /**
     * Stretches the `Shape` in the x direction by the given `amount` while keeping the center point
     */
    stretchY(amount: number): Shape;
    translate(point: Point): Shape;
    negateX(): Shape;
    negateY(): Shape;
    mirrorY(): Shape;
    getCircumference(): number;
    getArea(): number;
    clone(): Shape;
    setPosition(point: Point, origin?: ShapeOrigin): Shape;
    getBoundingCenter(): Point;
    getBoundingRectangle(): Shape;
    /**
     * Determines whether the two `Shape`s have coincident edges, if they have returns the following array structure
     * [the common `Segment` segment, the index of the edge in this `Shape`, the index of the edge in the other `Shape`],
     * otherwise returns undefined
     */
    getCoincidentLineSegment(other: Shape): [Segment, number, number];

    /**
     * Returns the edges of the shape
     */
    getEdges(): Segment[];
}