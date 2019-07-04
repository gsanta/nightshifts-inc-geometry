import { Polygon } from "./Polygon";
import _ from "lodash";
import { Segment } from "./Segment";
import { GeometryUtils } from '../utils/GeometryUtils';


export class StripeView {
    private polygon: Polygon;

    // TODO: check if polygon is really a stripe.
    constructor(polygon: Polygon) {
        this.polygon = polygon;
    }

    public getSlope() {
        return _.maxBy(this.polygon.getEdges(), edge => edge.getLength()).getSlope();
    }

    public merge(otherStripe: StripeView): Polygon {
        const [edge1, edge2] = this.getCapEdges();
        const [edge3, edge4] = otherStripe.getCapEdges();

        const distances: [number, [Segment, Segment]][] = [
            [edge1.getBoundingCenter().distanceTo(edge3.getBoundingCenter()), [edge1, edge3]],
            [edge1.getBoundingCenter().distanceTo(edge4.getBoundingCenter()), [edge1, edge4]],
            [edge2.getBoundingCenter().distanceTo(edge3.getBoundingCenter()), [edge2, edge3]],
            [edge2.getBoundingCenter().distanceTo(edge4.getBoundingCenter()), [edge2, edge4]]
        ];

        const maxDistance = _.maxBy(distances, distance => distance[0]);

        const [segment1, segment2] = maxDistance[1];

        return GeometryUtils.createRectangleFromTwoOppositeSides(segment1, segment2);
    }

    /**
     * Returns with the overlapping `Segment` and the index of the ovelapping edge of the `StripeView` if there is an ovelap,
     * undefined otherwise
     * TODO: better naming of the function
     */
    public overlaps(segment: Segment): [Segment, number] {
        const longEdges = this.getLongEdges();
        const allEdges = this.polygon.getEdges();

        for (let i = 0; i < longEdges.length; i++) {
            const coincidentInfo = segment.getCoincidentLineSegment(longEdges[i]);
            if (coincidentInfo) {
                return [coincidentInfo[0], _.findIndex(allEdges, edge => edge.equalTo(longEdges[i]))];
            }
        }
    }

    public getLongEdges(): [Segment, Segment] {
        const sortedEdges = _.sortBy(this.polygon.getEdges(), edge => edge.getLength());

        return [sortedEdges[2], sortedEdges[3]];
    }

    public getCapEdges(): [Segment, Segment] {
        const sortedEdges = _.sortBy(this.polygon.getEdges(), edge => edge.getLength());

        return [sortedEdges[0], sortedEdges[1]];
    }
}