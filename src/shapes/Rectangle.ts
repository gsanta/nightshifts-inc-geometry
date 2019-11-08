import { GeometryService } from '../GeometryService';
import { Point } from './Point';
import { BoundingInfo, Shape, ShapeOrigin } from './Shape';
import { Segment } from './Segment';

export class Rectangle implements Shape {
    private geometryService: GeometryService;
    topLeft: Point;
    bottomRight: Point;

    constructor(topLeft: Point, bottomRight: Point, geometryService: GeometryService) {
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
        this.geometryService = geometryService;
    }

    setPosition(point: Point, origin?: ShapeOrigin): Shape { throw new Error ('Not implemented'); }
    hasPoint(point: Point): boolean { throw new Error ('Not implemented'); }
    scale(point: Point): Shape { throw new Error ('Not implemented'); }
    translate(point: Point): Shape { throw new Error ('Not implemented'); }
    negate(axis: 'x' | 'y'): Shape { throw new Error ('Not implemented'); }

    getBoundingInfo(): BoundingInfo { throw new Error ('Not implemented'); }
    getBoundingCenter(): Point { throw new Error ('Not implemented'); }
    getBoundingRectangle(): Shape { throw new Error ('Not implemented'); }

    clone(): Shape { throw new Error ('Not implemented'); }
    getCoincidentLineSegment(other: Shape): [Segment, number, number] { throw new Error ('Not implemented'); }
    setPoint(index: number, newPoint: Point): Shape { throw new Error ('Not implemented'); }
    getPoints(): Point[] { throw new Error ('Not implemented'); }
    getEdges(): Segment[] { throw new Error ('Not implemented'); }
    equalTo(otherShape: Shape): boolean { throw new Error ('Not implemented'); }
    toString(): string { throw new Error ('Not implemented'); }
}