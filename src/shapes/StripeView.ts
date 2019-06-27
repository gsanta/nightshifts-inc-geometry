import { Polygon } from "./Polygon";
import _ from "lodash";


export class StripeView {
    private polygon: Polygon;

    // TODO: check if polygon is really a stripe.
    constructor(polygon: Polygon) {
        this.polygon = polygon;
    }

    public getSlope() {
        return _.maxBy(this.polygon.getEdges(), edge => edge.getLength()).getSlope();
    }
}