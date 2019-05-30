import { Point } from "./Point";
import { Line } from "./Line";

export enum ShapeOrigin {
    CENTER
}

export interface Shape {
    points: Point[];
    addX(amount: number): Shape;
    addY(amount: number): Shape;
    /**
     * Returns with the minimum x position of all of the `Shape`'s points.
     */
    minX(): number

    /**
     * Returns with the minimum y position of all of the `Shape`'s points.
     */
    maxX(): number;
    translate(point: Point): Shape;
    negateX(): Shape;
    negateY(): Shape;
    mirrorY(): Shape;
    getCircumference(): number;
    getArea(): number;
    clone(): Shape;
    setPosition(point: Point, origin: ShapeOrigin): Shape;
    getBoundingCenter(): Point;
    /**
     * Determines whether the two `Shape`s have coincident edges, if they have returns the following array structure
     * [the common `Line` segment, the index of the edge in this `Shape`, the index of the edge in the other `Shape`],
     * otherwise returns undefined
     */
    getCoincidentLineSegment(other: Shape): [Line, number, number];
    /**
     * Returns the edges of the shape
     */
    getEdges(): Line[];
}