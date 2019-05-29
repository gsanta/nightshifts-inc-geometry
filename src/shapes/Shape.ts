import { Point } from "./Point";
import { Line } from "..";

export enum ShapeOrigin {
    CENTER
}

export interface Shape {
    addX(amount: number): Shape;
    addY(amount: number): Shape;
    translate(point: Point): Shape;
    negateX(): Shape;
    negateY(): Shape;
    mirrorY(): Shape;
    getCircumference(): number;
    getArea(): number;
    clone(): Shape;
    setPosition(point: Point, origin: ShapeOrigin): Shape;
    getBoundingCenter(): Point;
}