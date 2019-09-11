import { Measurements } from './utils/Measurements';
import { GeometryFactory } from './GeometryFactory';

export class GeometryService {

    measuerments: Measurements;
    factory: GeometryFactory;

    constructor() {
        this.measuerments = new Measurements();
        this.factory = new GeometryFactory(this);
    }
}