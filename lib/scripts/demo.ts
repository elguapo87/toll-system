import { Car } from "../models/Car";
import { Truck } from "../models/Truck";
import { TollStation } from "../stations/TollStation";
import { TollWorker } from "../workers/TollWorker";

const audi = new Car (
    "Audi",
    "A6",
    "Black"
);

const man = new Truck (
    "MAN",
    "TGX",
    "White",
    true
) 

const station = new TollStation (
    "Milos Veliki"
);

const goran = new TollWorker (
    "Goran",
    "Maljkovic"
);

station.addWorker(goran);

station.collectToll(goran, audi);
station.collectToll(goran, man);

console.log("\nRESULTS");
console.log("------------------");

console.log(`Goran collected $${goran.getCollectedAmount()}`);
console.log(`Station collected $${station.getTotalCollected()}`);