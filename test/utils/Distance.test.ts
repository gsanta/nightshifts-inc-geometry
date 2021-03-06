import { Distance } from "../../src/utils/Distance";
import { Segment } from "../../src/shapes/Segment";
import { Point } from "../../src/shapes/Point";
import { GeometryService } from '../../src/GeometryService';


describe(`Distance`, () => {
    describe(`pointToSegment`, () => {
        it ('calculates the min distance between the `Point` and the `Segment`', () => {
            const distance = new Distance();
            const geometryService = new GeometryService()

            expect(distance.pointToSegment(new Point(2, 4), geometryService.factory.edge(new Point(0, 5), new Point(0, 3)))).toEqual(2);

            expect(distance.pointToSegment(new Point(3, 5), geometryService.factory.edge(new Point(0, 5), new Point(0, 3)))).toEqual(3);

            expect(distance.pointToSegment(new Point(4, 1), geometryService.factory.edge(new Point(1, 1), new Point(3, 1)))).toEqual(1);
        });
    });

    describe('twoSegments', () => {

        it ('measures the distance between the two segments', () => {
            const segment1 = new Segment(new Point(1, 1), new Point(3, 1));
            const segment2 = new Segment(new Point(1, 5), new Point(3, 5));

            const distance = new Distance();

            expect(distance.twoSegments(segment1, segment2)).toEqual(4);
        });

        it ('returns undefined if the perpendicular line from the center of segment1 do not intersect segment2', () => {
            const segment1 = new Segment(new Point(1, 1), new Point(7, 1));
            const segment2 = new Segment(new Point(5, 5), new Point(10, 5));

            const distance = new Distance();

            expect(distance.twoSegments(segment1, segment2)).toEqual(undefined);
        });

        it ('returns undefined if two segments are perpendicular', () => {
            const segment1 = new Segment(new Point(1, 1), new Point(3, 1));
            const segment2 = new Segment(new Point(2, 0), new Point(2, 5));

            const distance = new Distance();

            expect(distance.twoSegments(segment1, segment2)).toEqual(undefined);
        });
    });
});
