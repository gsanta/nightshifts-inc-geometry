import { Polygon } from "./Polygon";
import _ from "lodash";
import { Segment } from "./Segment";
import { distance } from "@turf/turf";
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

    public getCapEdges(): [Segment, Segment] {
        const sortedEdges = _.sortBy(this.polygon.getEdges(), edge => edge.getLength());

        return [sortedEdges[0], sortedEdges[1]];
    }
}