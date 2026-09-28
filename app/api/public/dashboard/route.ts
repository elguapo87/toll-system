import { prisma } from "@/config/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [
            stations,
            workers,
            vehicles,
            collections,
            totalCollected
        ] = await Promise.all([
            prisma.tollStation.count(),
            prisma.tollWorker.count(),
            prisma.vehicle.count(),
            prisma.tollCollection.count(),
            prisma.tollCollection.aggregate({
                _sum: {
                    amount: true
                }
            })
        ]);

        return NextResponse.json({
            success: true,
            stations,
            workers,
            vehicles,
            collections,
            totalCollected: totalCollected._sum.amount ?? 0
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Failed to fetch dahsboard data" }, { status: 500 });
    }
}