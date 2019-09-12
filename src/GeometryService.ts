import { Measurements } from './utils/Measurements';
import { GeometryFactory } from './GeometryFactory';
import { Transform } from './utils/Transform';

export class GeometryService {

    measuerments: Measurements;
    transform: Transform;
    factory: GeometryFactory;

    constructor() {
        this.measuerments = new Measurements();
        this.factory = new GeometryFactory(this);
    }
}