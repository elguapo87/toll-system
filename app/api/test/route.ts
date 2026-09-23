import { Car } from "@/lib/models/Car";
import { TollStation } from "@/lib/stations/TollStation";
import { TollWorker } from "@/lib/workers/TollWorker";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const audi = new Car(
            "Audi",
            "A6",
            "Black"
        );

        const goran = new TollWorker(
            "Goran",
            "Maljkovic"
        );

        const station = new TollStation(
            "Milos Veliki"
        );

        station.addWorker(goran);

        station.collectToll(goran, audi);

        return NextResponse.json({
            success: true,
            worker: goran.getCollectedAmount(),
            station: station.getTotalCollected()
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Failed to fetch data" }, { status: 500 });
    }
}