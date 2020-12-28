import { SamplingPoint } from './sampling-point';

export class Layer {
    header1: string;
    header2: string;
    header3: string;
    samplingPoints: SamplingPoint[] = [];
    pointsQuantity: number;
    constructor(header1: string, header2: string, header3: string) {
        this.header1 = header1;
        this.header2 = header2;
        this.header3 = header3;
    }
}
