export class Samplingpoint {
    coordinates: number[] = [];
    data: number;
    constructor(firstCoordinate: number, secondCoordinate: number, data: number) {
        this.coordinates.push(firstCoordinate);
        this.coordinates.push(secondCoordinate);
        this.data = data;
    }
}
