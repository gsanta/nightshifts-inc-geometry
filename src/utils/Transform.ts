import { Polygon } from '../shapes/Polygon';
import { Matrix } from './Matrix';
import { Point } from '../shapes/Point';

export class Transform {

    public rotate(polygon: Polygon, degree: number): Polygon {
        const xVector = polygon.getPoints().map(p => p.x);
        const yVector = polygon.getPoints().map(p => p.y);

        const P = [xVector, yVector];

        const center = polygon.getBoundingCenter();

        const xVectorCent: number[] = [];
        const yVectorCent: number[] = [];

        for (let i = 0; i < xVector.length; i++) {
            xVectorCent.push(center.x);
            yVectorCent.push(center.y);
        }

        const C = [xVectorCent, yVectorCent];

        const R = [
            [ Math.cos(degree), - Math.sin(degree) ],
            [ Math.sin(degree), Math.cos(degree) ]
        ]

        const matrix = new Matrix();

        const Pnew = matrix.add(matrix.multiply(R, matrix.subtract(P, C)), C);

        const points: Point[] = [];

        for (let i = 0; i < Pnew[0].length; i++) {
            points.push(new Point(Pnew[0][i], Pnew[1][i]));
        }

        return new Polygon(points);
    }
}