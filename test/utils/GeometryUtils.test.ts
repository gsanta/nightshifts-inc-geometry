import { GeometryService } from "../../src";
import { Point } from "../../src/shapes/Point";
import { GeometryUtils } from "../../src/utils/GeometryUtils";


describe(`GeometryUtils`, () => {
    const geometryService = new GeometryService();

    describe(`createRectangleFromTwoOppositeSides`, () => {
        it ('creates a rectangle based on the given segments', () => {
            const segment1 = geometryService.factory.edge(new Point(1, 1), new Point(2, 2));
            const segment2 = geometryService.factory.edge(new Point(3, 1), new Point(4, 2));

            const rectangle = GeometryUtils.createRectangleFromTwoOppositeSides(segment1, segment2);

            expect(
                rectangle.equalTo(
                    geometryService.factory.polygon([
                        new Point(1, 1),
                        new Point(2, 2),
                        new Point(4, 2),
                        new Point(3, 1)
                    ])
                )
            ).toBeTruthy();
        });
    });

    describe(`addThicknessToSegment`, () => {
        it ('creates a rectangular `Polygon` via adding thickness to a `Segment` 2', () => {
            const segment = geometryService.factory.edge(new Point(1, 1), new Point(3, 3));
            const rectangle = GeometryUtils.addThicknessToSegment(segment, Math.SQRT2);
            expect(
                rectangle.equalTo(
                    geometryService.factory.polygon([
                        new Point(2, 0),
                        new Point(4, 2),
                        new Point(2, 4),
                        new Point(0, 2),
                    ])
                )
            ).toBeTruthy();
        });
    });
});
