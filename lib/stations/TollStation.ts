import { Logger } from "../logger/Logger";
import { Vehicle } from "../models/Vehicle";
import { TollWorker } from "../workers/TollWorker";

export class TollStation {
    private totalCollected = 0;
    private workers: TollWorker[] = [];

    constructor(
        public name: string
    ) {}

    public addWorker(worker: TollWorker): void {
        this.workers.push(worker);
    }

    public collectToll(worker: TollWorker, vehicle: Vehicle): void {
        const amount = vehicle.getTollPrice();

        worker.addCollection(amount);

        this.totalCollected += amount;

        Logger.log(`${worker.firstName} ${worker.lastName} collected $${amount} for ${vehicle.brand} ${vehicle.model}`);
    }

    public getTotalCollected(): number {
        return this.totalCollected;
    }

    public getWorkers(): TollWorker[] {
        return this.workers;
    }
}