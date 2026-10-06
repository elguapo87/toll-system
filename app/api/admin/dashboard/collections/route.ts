import { prisma } from "@/config/prisma";
import adminAuth from "@/utils/adminAuth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await adminAuth();

        const [
            owners,
            stations,
            workers,
            collections,
            totalRevenue

        ] = await Promise.all([
            prisma.owner.count(),
            prisma.tollStation.count(),
            prisma.tollWorker.count(),
            prisma.tollCollection.count(),
            prisma.tollCollection.aggregate({
                _sum: {
                    amount: true
                }
            })
        ]);

        return NextResponse.json({
            success: true,
            owners,
            stations,
            workers,
            collections,
            totalRevenue: totalRevenue._sum.amount ?? 0
        }, { status: 200 });

    } catch (error) {
        console.error(error);

        if (
            error instanceof Error && (
                error.message === "Unauthorized" || 
                error.message === "Invalid admin token"
            )
        ) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({ success: false, message: "Failed to fetch collections" }, { status: 500 });
    }
}