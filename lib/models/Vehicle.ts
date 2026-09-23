export abstract class Vehicle {
    constructor(
        public brand: string,
        public model: string,
        public color: string
    ) { }

    abstract getTollPrice(): number;
}