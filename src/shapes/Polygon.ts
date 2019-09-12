import * as turf from '@turf/turf';
import * as _ from 'lodash';
import last from 'lodash/last';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import without from 'lodash/without';
import * as PolyBool from 'polybooljs';
import polylabel from 'polylabel';
import { GeometryService } from '../GeometryService';
import { Point } from './Point';
import { Segment } from './Segment';
import { BoundingInfo, Shape, ShapeOrigin } from './Shape';

export class Polygon implements Shape {
    private points: Point[];
    private orederedPoints: Point[];
    private geometryService: GeometryService;

    constructor(points: Point[], geometryService: GeometryService = new GeometryService) {
        this.points = points;
        this.geometryService = geometryService;
        this.orederedPoints = this.orderPointsToStartAtBottomLeft(this.points);

        if (!this.arePointsClockwise()) {
            this.orederedPoints = this.orderPointsToStartAtBottomLeft(this.orederedPoints.reverse());
        }
    }

    public getPoints(): Point[] {
        return this.orederedPoints;
    }

    public setPoint(index: number, newPoint: Point): Polygon {
        const clonedPoints = [...this.points];
        clonedPoints.splice(index, 1, newPoint);

        return this.geometryService.factory.polygon(clonedPoints);
    }

    public hasPoint(point: Point): boolean {
        return _.find(this.points, p => p.equalTo(point)) !== undefined;
    }

    public getPointsStartingFrom(point: Point) {
        const index = this.getIndexOf(point);

        return [...this.getPoints().slice(index), this.getPoints().slice(0, index)];
    }

    public getIndexOf(point: Point): number {
        return this.orederedPoints.findIndex(p => p.equalTo(point));
    }

    /**
     * The ordering of points within a `Shape` are stable (it is the order by which the `Polygon` was instantiated), and it returns with the previous `Point` based
     * on that order. The `Polygon` is a circular shape so whatever the index is, a valid `Point` will be returned.
     */
    public getPreviousPoint(point: Point): Point {
        const index = this.getIndexOf(point);

        if (index === 0) {
            return this.orederedPoints[this.points.length - 1];
        }

        return this.orederedPoints[index - 1];
    }

    public getNextPoint(point: Point): Point {
        const index = this.getIndexOf(point);
        if (index === this.orederedPoints.length - 1) {
            return this.orederedPoints[0];
        }

        return this.orederedPoints[index + 1];
    }

    public getOrderedIndex(point: Point) {
        return _.findIndex(this.orederedPoints, p => p.equalTo(point));
    }

    public translate(point: Point): Polygon {
        const translatedPoints = this.points.map(p => p.addX(point.x).addY(point.y));
        return this.geometryService.factory.polygon(translatedPoints);
    }

    public negate(axis: 'x' | 'y'): Polygon {
        const translatedPoints = this.points.map(point => this.geometryService.factory.point(axis === 'x' ? -point.x : point.x, axis === 'y' ? -point.y : point.y));
        return this.geometryService.factory.polygon(translatedPoints);
    }

    public getArea() {
        let area = 0;
        let prevIndex = this.points.length - 1;

        for (let i = 0; i < this.points.length; i++) {
            area = area +  (this.points[prevIndex].x + this.points[i].x) * (this.points[prevIndex].y - this.points[i].y);
            prevIndex = i;
        }

        return Math.abs(area / 2);
    }

    public clone(): Polygon {
        const points = this.points.map(point => point.clone());

        const clone = this.geometryService.factory.polygon(points);

        return clone;
    }

    public contains(other: Polygon): boolean {
        const poly1 = turf.polygon([this.toLinearRing().toTwoDimensionalArray()]);
        const poly2 = turf.polygon([other.toLinearRing().toTwoDimensionalArray()]);

        return turf.booleanContains(poly1, poly2);
    }

    public containsPoint(point: Point): boolean {
        const turfPolygon = turf.polygon([this.toLinearRing().toTwoDimensionalArray()]);
        const turfPoint = turf.point([point.x, point.y]);

        return turf.booleanPointInPolygon(turfPoint, turfPolygon);
    }

    /**
     * returns true if this `Polygon` contains more than half of the other `Polygon`s area
     */
    public containsMoreThenHalf(other: Polygon): boolean {
        const poly1 = turf.polygon([this.toLinearRing().toTwoDimensionalArray()]);
        const poly2 = turf.polygon([other.toLinearRing().toTwoDimensionalArray()]);

        const intersection = turf.intersect(poly1, poly2);

        if (intersection) {
            const intersectionPolygon = this.createPolygonFromTurfGeometry(intersection.geometry);

            const intersectionArea = intersectionPolygon.getArea();
            const otherPolygonArea = other.getArea();

            return intersectionArea / otherPolygonArea > 0.5;
        }

        return false;
    }

    public intersect(other: Polygon): boolean {
        const poly1 = turf.polygon([this.toLinearRing().toTwoDimensionalArray()]);
        const poly2 = turf.polygon([other.toLinearRing().toTwoDimensionalArray()]);

        const intersection = turf.intersect(poly1, poly2);

        return !!intersection;
    }

    public scale(scalePoint: Point): Polygon {
        const points = this.points.map(p => p.scaleX(scalePoint.x)).map(p => p.scaleY(scalePoint.y));
        return this.geometryService.factory.polygon(points);
    }

    /**
     * Returns the center `Point` of the bounding `Rectangle`
     */
    public getBoundingCenter(): Point {
        const center = polylabel([this.toTwoDimensionalArray()], 1.0);
        return this.geometryService.factory.point(center[0], center[1]);
    }

    public getBoundingRectangle(): Shape {
        const boudingInfo = this.getBoundingInfo();
        const minX = boudingInfo.min[0];
        const maxX = boudingInfo.max[0];
        const minY = boudingInfo.min[1];
        const maxY = boudingInfo.max[1];

        return this.geometryService.factory.polygon([
            this.geometryService.factory.point(minX, minY),
            this.geometryService.factory.point(minX, maxY),
            this.geometryService.factory.point(maxX, maxY),
            this.geometryService.factory.point(maxX, minY)
        ]);
    }

    public setPosition(point: Point, origin: ShapeOrigin = ShapeOrigin.CENTER): Polygon {
        if (this.points.length !== 4) {
            throw new Error('setPosition is only supported for Rectangles.');
        }

        const boudingInfo = this.getBoundingRectangle().getBoundingInfo();

        const width = boudingInfo.max[0] - boudingInfo.min[0]
        const height = boudingInfo.max[1] - boudingInfo.min[1];

        return this.geometryService.factory.rectangle(point.x - width / 2, point.y - height / 2, width, height);
    }

    public getUnion(otherPolygon: Polygon): Polygon {
        const union = PolyBool.union(
            {
                regions: [[[1, 1], [2, 1], [2, 2], [1, 2], [1, 1]]],
                inverted: false
            },
            {
                regions: [[[1, 2], [2, 2], [2, 3], [1, 3], [1, 2]]],
                inverted: false
            }
        );

        const points = union.regions.map(region => this.geometryService.factory.point(region[0], region[1]));
        return this.geometryService.factory.polygon(points);
    }

    /**
     * @deprecated use `getEdges` instead, it has the same behaviour, but a more unified naming convention
     */
    public getSidesFromBottomLeftClockwise(): Segment[] {
        return this.orederedPoints.map((point, index) => {
            if (index < this.orederedPoints.length - 1) {
                return this.geometryService.factory.edge(point, this.orederedPoints[index + 1]);
            } else {
                return this.geometryService.factory.edge(point, this.orederedPoints[0]);
            }
        });
    }

    /**
     * Determines which sides (if any) of the `Polygon` lies on the same line as the given `Segment` segment.
     * @returns an array of the following structure: the `Segment` segment representing the side of the `Polygon` and the index of that side
     *      being the 0 index the bottom left side and counting clockwise.
     */
    public getCoincidingSidesForLine(line: Segment): [Segment, number][] {
        const sides = this.getSidesFromBottomLeftClockwise();

        return sides
            .filter(side => side.isCoincidentToLine(line))
            .map(side => [side, sides.indexOf(side)]);
    }

    public getCoincidentLineSegment(other: Shape): [Segment, number, number] {
        const otherEdges = other.getEdges();
        const thisEdges = this.getEdges();

        let coincidentSegmentInfos: [Segment, number, number][] = [];
        for (let i = 0; i < otherEdges.length; i++) {
            for (let j = 0; j < thisEdges.length; j++) {
                const coincidentInfo = otherEdges[i].getCoincidentLineSegment(thisEdges[j]);
                if (coincidentInfo) {
                    coincidentSegmentInfos.push([coincidentInfo[0], j, i]);
                }
            }
        }

        return _.maxBy(coincidentSegmentInfos, info => info[0].getLength());
    }

    public getBoundingInfo(): BoundingInfo {
        const minX = minBy(this.points, point => point.x).x;
        const maxX = maxBy(this.points, point => point.x).x;
        const minY = minBy(this.points, point => point.y).y;
        const maxY = maxBy(this.points, point => point.y).y;

        return {
            min: [minX, minY],
            max: [maxX, maxY],
            extent: [maxX - minX, maxY - minY]
        };
    }

    public getEdges(): Segment[] {
        return this.getSidesFromBottomLeftClockwise();
    }

    public equalTo(otherPolygon: Polygon): boolean {
        if (this.points.length !== otherPolygon.points.length) {
            return false;
        }

        return _.every(this.orederedPoints, (point, index) => point.equalTo(otherPolygon.orederedPoints[index]));
    }

    public removeStraightVertices(): Polygon {
        const firstPoint: Point = _.find(this.getPoints(), point => {
            const a = point;
            const b = this.getPreviousPoint(point);
            const c = this.getNextPoint(point);
            return this.geometryService.factory.angleFromThreePoints(a, b, c).isStraightAngle() === false
        });

        const reducedPoints: Point[] = [firstPoint];


        let currentPoint = this.getNextPoint(firstPoint);
        while(currentPoint.equalTo(firstPoint) === false) {
            const a = currentPoint;
            const b = this.getPreviousPoint(currentPoint);
            const c = this.getNextPoint(currentPoint);

            if (this.geometryService.factory.angleFromThreePoints(a, b, c).isStraightAngle() === false) {
                reducedPoints.push(currentPoint);
            }

            currentPoint = this.getNextPoint(currentPoint);
        }

        return this.geometryService.factory.polygon(reducedPoints);
    }

    public toString(): string {
        let str = '['

        this.points.forEach(point => str += point.toString());

        str += ']';

        return str;
    }

    public static createRectangle(left: number, top: number,  width: number, height: number, geometryService: GeometryService = new GeometryService()): Polygon {
        const minX = left;
        const maxX = left + width;
        const minY = top;
        const maxY = top + height;

        return geometryService.factory.polygon([
            geometryService.factory.point(minX, minY),
            geometryService.factory.point(minX, maxY),
            geometryService.factory.point(maxX, maxY),
            geometryService.factory.point(maxX, minY)
        ]);
    }

    private toTwoDimensionalArray(): number[][] {
        return <number[][]> this.points.map(point => [point.x, point.y]);
    }

    private toLinearRing(): Polygon {
        const clone = this.clone();
        clone.points.push(clone.points[0]);
        return clone;
    }

    private createPolygonFromTurfGeometry(geometry: {type: string, coordinates: [[number, number][]]}): Polygon {
        if (geometry.type !== 'Polygon') {
            return this.geometryService.factory.polygon([
                this.geometryService.factory.point(0, 0),
                this.geometryService.factory.point(0, 0),
                this.geometryService.factory.point(0, 0)
            ])
        }

        let points = geometry.coordinates[0];

        points = without(points, last(points));

        const polygon = this.geometryService.factory.polygon(points.map(p => this.geometryService.factory.point(p[0], p[1])));

        return polygon;
    }

    private arePointsClockwise() {
        const edges = this.getEdges();

        const sum = edges.reduce(
            (sum: number, nextEdge) => {
                const point1 = nextEdge.getPoints()[0];
                const point2 = nextEdge.getPoints()[1];
                return sum + (point2.x - point1.x) * (point2.y + point1.y);
            },
            0
        );

        return sum >= 0;
    }

    private orderPointsToStartAtBottomLeft = (points: Point[]) => {
        const minY = _.minBy(points, point => point.y).y;

        const bottomLeftPoint = _.chain(points)
            .filter(point => point.y === minY)
            .minBy(point => point.x)
            .value();

        while (!points[0].equalTo(bottomLeftPoint)) {
            points.push(points.shift());
        }

        return points;
    }
}