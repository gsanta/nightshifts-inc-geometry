import { Point } from "./Point";
import { Segment } from "./Segment";

export enum ShapeOrigin {
    CENTER
}

export interface BoundingInfo {
    min: [number, number];
    max: [number, number];
    extent: [number, number];
}

export interface Shape {
    getPoints(): Point[];

    /**
     * Sets the `Point` at the given `index` based on the initial `Point` ordering, and returns with the new `Shape`.
     */
    setPoint(index: number, newPoint: Point): Shape;
    hasPoint(point: Point): boolean;
    getBoundingInfo(): BoundingInfo;

    scale(point: Point): Shape;
    translate(point: Point): Shape;
    negateX(): Shape;
    negateY(): Shape;
    mirrorY(): Shape;
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

    /**
     * Determines whether two shapes are equal
     */
    equalTo(otherShape: Shape): boolean;

    toString(): string;
}