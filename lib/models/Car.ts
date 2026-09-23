import { Logger } from "../logger/Logger";
import { Vehicle } from "./Vehicle";

export class Car extends Vehicle {
    constructor(
        brand: string,
        model: string,
        color: string
    ) {
        super(brand, model, color);

        Logger.log(`Car created ${brand} ${model} ${color}`)
    }

    getTollPrice(): number {
        return 240;
    }
}