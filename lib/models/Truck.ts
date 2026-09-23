import { Logger } from "../logger/Logger";
import { Vehicle } from "./Vehicle";

export class Truck extends Vehicle {
    constructor(
        brand: string,
        model: string,
        color: string,
        public hasTrailer?: boolean
    ) {
        super(brand, model, color);

        Logger.log(`Truck created ${brand} ${model}`);
    }

    getTollPrice(): number {
        return this.hasTrailer ? 450 : 350;
    }
}