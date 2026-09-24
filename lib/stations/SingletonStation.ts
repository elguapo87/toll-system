import { Vehicle } from "../models/Vehicle";
import { TollWorker } from "../workers/TollWorker";

export class SingletonTollStation {
    private static instance: SingletonTollStation;
    
    private totalCollected = 0;
    private workers: TollWorker[] = [];

    private constructor() {}

    public static getInstance(): SingletonTollStation {
        if (!SingletonTollStation.instance) {
            SingletonTollStation.instance = new SingletonTollStation();
        }

        return SingletonTollStation.instance;
    }

    public addWorker(worker: TollWorker): void {
        this.workers.push(worker);
    }

    public collectToll(worker: TollWorker, vehicle: Vehicle): void {
        const amount = vehicle.getTollPrice();

        worker.addCollection(amount);

        this.totalCollected += amount;
    }

    public getTotalCollected(): number {
        return this.totalCollected;
    }

    public getWorkers(): TollWorker[] {
        return this.workers;
    }
}