import { Point } from './Point';
import * as turf from '@turf/turf';
import { Segment } from './Segment';
import minBy from 'lodash/minBy';
import maxBy from 'lodash/maxBy';
import without from 'lodash/without';
import last from 'lodash/last';
import polylabel from 'polylabel';
import _ from 'lodash';
import * as PolyBool from 'polybooljs';
import { Shape, ShapeOrigin } from './Shape';

export const orderPointsToStartAtBottomLeft = (points: Point[]) => {
    const minY = _.minBy(points, point => point.y).y;

    const bottomLeftPoint = _.chain(points)
        .filter(point => point.y === minY)
        .minBy(point => point.x)
        .value();

    const separatorIndex = points.indexOf(bottomLeftPoint);
    const orderedPoints = [...points.slice(separatorIndex, points.length), ...points.slice(0, separatorIndex)];

    return orderedPoints;
}

export class Polygon implements Shape {
    public points: Point[];

    constructor(points: Point[]) {
        this.points = orderPointsToStartAtBottomLeft(points);
    }

    public addX(amount: number): Polygon {
        const translatedPoints = this.points.map(point => point.addX(amount));
        return new Polygon(translatedPoints);
    }

    public addY(amount: number): Polygon {
        const translatedPoints = this.points.map(point => point.addY(amount));
        return new Polygon(translatedPoints);
    }

    public translate(point: Point): Polygon {
        return this.addX(point.x).addY(point.y);
    }

    public negateX(): Polygon {
        const translatedPoints = this.points.map(point => new Point(-point.x, point.y));
        return new Polygon(translatedPoints);
    }


    public negateY(): Polygon {
        const translatedPoints = this.points.map(point => new Point(point.x, -point.y));
        return new Polygon(translatedPoints);
    }

    /**
     * TODO: `negateY` is not correct here but seems to be difficult to mirror a `Polygon`
     */
    public mirrorY(): Polygon {
        return this.negateY();
    }

    public getCircumference(): number {
        return this.points.reduce(
            (sum: number, currentItem: Point, index: number) => sum + this.getNthLine(index).getLength(),
            0
        );
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

        const clone = new Polygon(points);

        return clone;
    }

    public contains(other: Polygon): boolean {
        const poly1 = turf.polygon([this.toLinearRing().toTwoDimensionalArray()]);
        const poly2 = turf.polygon([other.toLinearRing().toTwoDimensionalArray()]);

        return turf.booleanContains(poly1, poly2);
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

    /**
     * @deprecated use `getCoincidentLineSegment`
     * Returns true if the two polygons intersect only at a border (but do not overlap)
     */
    public intersectBorder(other: Polygon): Segment {
        const poly1 = turf.polygon([this.toLinearRing().toTwoDimensionalArray()]);
        const poly2 = turf.polygon([other.toLinearRing().toTwoDimensionalArray()]);

        const intersection = turf.intersect(poly1, poly2);

        if (intersection !== null && intersection.geometry.type === 'LineString') {
            // return intersection.geometry.coordinates;
            const coordinates: [[number, number], [number, number]] = intersection.geometry.coordinates;

            return new Segment(new Point(coordinates[0][0], coordinates[0][1]), new Point(coordinates[1][0], coordinates[1][1]));
        }
    }

    public scaleX(times: number): Polygon {
        const points = this.points.map(point => point.scaleX(times));

        return new Polygon(points);
    }

    public scaleY(times: number) {
        const points = this.points.map(point => point.scaleY(times));

        return new Polygon(points);
    }

    /**
     * Stretches or pushes the `Polygon` so that the points min and max y coordinate stretches
     * exactly the new height
     */
    // TODO: implement it
    public setBoundingHeight(newHeight: number): Polygon {
        throw new Error('not implemented');
    }

    /**
     * Stretches or pushes the `Polygon` so that the points min and max x coordinate stretches
     * exactly the new width
     */
    // TODO: implement it
    public setBoundingWidth(newWidth: number): Polygon {
        throw new Error('not implemented');
    }

    /**
     * Returns the center `Point` of the bounding `Rectangle`
     */
    public getBoundingCenter(): Point {
        const center = polylabel([this.toTwoDimensionalArray()], 1.0);
        return new Point(center[0], center[1]);
    }

    public getBoundingRectangle(): Shape {
        const minX = this.minX();
        const maxX = this.maxX();
        const minY = this.minY();
        const maxY = this.maxY();

        return new Polygon([
            new Point(minX, minY),
            new Point(minX, maxY),
            new Point (maxX, maxY),
            new Point(maxX, minY)
        ]);
    }

    public setPosition(point: Point, origin: ShapeOrigin = ShapeOrigin.CENTER): Polygon {
        const diff = this.getBoundingCenter().distanceTo(point);

        const points = this.points.map(point => point.addX(diff[0]).addY(diff[1]));

        return new Polygon(points);
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

        const points = union.regions.map(region => new Point(region[0], region[1]));
        return new Polygon(points);
    }

    /**
     * @deprecated use `getEdges` instead, it has the same behaviour, but a more unified naming convention
     */
    public getSidesFromBottomLeftClockwise(): Segment[] {
        return this.points.map((point, index) => {
            if (index < this.points.length - 1) {
                return new Segment(point, this.points[index + 1]);
            } else {
                return new Segment(point, this.points[0]);
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

        for (let i = 0; i < otherEdges.length; i++) {
            for (let j = 0; j < thisEdges.length; j++) {
                const coincidentInfo = otherEdges[i].getCoincidentLineSegment(thisEdges[j]);
                if (coincidentInfo) {
                    return [coincidentInfo[0], j, i];
                }
            }
        }
    }

    public getEdges(): Segment[] {
        return this.getSidesFromBottomLeftClockwise();
    }


    public xExtent(): number {
        return this.maxX() - this.minX();
    }

    public yExtent(): number {
        return this.maxY() - this.minY();
    }

    /**
     * Returns with the minimum x position of all of the polygon's points
     */
    public minX(): number {
        return minBy(this.points, point => point.x).x;
    }

    /**
     * Returns with the maximum x position of all of the polygon's points
     */
    public maxX(): number {
        return maxBy(this.points, point => point.x).x;
    }

    /**
     * Returns with the minimum y position of all of the polygon's points
     */
    public minY(): number {
        return minBy(this.points, point => point.y).y;
    }

    /**
     * Returns with the maxmium y position of all of the polygon's points
     */
    public maxY(): number {
        return maxBy(this.points, point => point.y).y;
    }

    public stretchX(amount: number): Polygon {
        return this.points.reduce(
            (stretchedPolygon, point, index) => {
            const currentArea = stretchedPolygon.getArea();

                const stretchNeg = point.addX(-amount);
                let clonedPoints = [...stretchedPolygon.points];
                clonedPoints.splice(index, 1, stretchNeg)
                let testPolygonStretchToNeg = new Polygon(clonedPoints);
                if (testPolygonStretchToNeg.getArea() < currentArea) {
                    const stretchPos = point.addX(amount);

                    clonedPoints = [...stretchedPolygon.points];
                    clonedPoints.splice(index, 1, stretchPos)

                    return new Polygon(clonedPoints);
                } else {
                    return testPolygonStretchToNeg;
                }
            },
            this
        );
    }

    public stretchY(amount: number): Polygon {
        return this.points.reduce(
            (stretchedPolygon, point, index) => {
                const currentArea = stretchedPolygon.getArea();

                const stretchNeg = point.addY(-amount);
                let clonedPoints = [...stretchedPolygon.points];
                clonedPoints.splice(index, 1, stretchNeg)
                let testPolygonStretchToNeg = new Polygon(clonedPoints);
                if (testPolygonStretchToNeg.getArea() < currentArea) {
                    const stretchPos = point.addY(amount);

                    clonedPoints = [...stretchedPolygon.points];
                    clonedPoints.splice(index, 1, stretchPos)

                    return new Polygon(clonedPoints);
                } else {
                    return testPolygonStretchToNeg;
                }
            },
            this
        );
    }

    public stretch(xAmount: number, yAmount: number): Polygon {
        return this.stretchX(xAmount).stretchY(yAmount);
    }

    public equalTo(otherPolygon: Polygon): boolean {
        if (this.points.length !== otherPolygon.points.length) {
            return false;
        }

        return _.chain(this.points)
            .map((point, index) => point.equalTo(otherPolygon.points[index]))
            .every(isEqual => isEqual === true)
            .value();
    }

    public static createRectangle(left: number, bottom: number,  width: number, height: number): Polygon {
        const minX = left;
        const maxX = left + width;
        const minY = bottom;
        const maxY = bottom + height;

        return new Polygon([
            new Point(minX, minY),
            new Point(minX, maxY),
            new Point (maxX, maxY),
            new Point(maxX, minY)
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


    private getNthLine(index: number): Segment {
        if (this.points.length - 1 === index) {
            return new Segment(this.points[index], this.points[0]);
        }
        return new Segment(this.points[index], this.points[index + 1]);
    }

    private createPolygonFromTurfGeometry(geometry: {type: string, coordinates: [[number, number][]]}): Polygon {
        if (geometry.type !== 'Polygon') {
            return new Polygon([
                new Point(0, 0),
                new Point(0, 0),
                new Point(0, 0)
            ])
        }

        let points = geometry.coordinates[0];

        points = without(points, last(points));

        const polygon = new Polygon(points.map(p => new Point(p[0], p[1])));

        return polygon;
    }
}