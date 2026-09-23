import { Vehicle } from "./Vehicle";

export class Bike extends Vehicle {
    getTollPrice(): number {
        return 200;
    }
}