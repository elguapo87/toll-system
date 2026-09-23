import { Vehicle } from "./Vehicle";

export class Bus extends Vehicle {
    getTollPrice(): number {
        return 300;
    }
}