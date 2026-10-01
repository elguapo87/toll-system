import { prisma } from "@/config/prisma";
import ownerAuth from "@/utils/ownerAuth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const owner = await ownerAuth();

        const [
            stationsCount,
            workersCount

        ] = await Promise.all([
            prisma.tollStation.count({
                where: {
                    ownerId: owner.id
                }
            }),

            prisma.tollWorker.count({
                where: {
                    station: {
                        ownerId: owner.id
                    }
                }
            })
        ]);

        return NextResponse.json({ success: true, stationsCount, workersCount }, { status: 200 });

    } catch (error) {
        console.error(error);

        if (
            error instanceof Error && (
                error.message === "Unauthorized" ||
                error.message === "Invalid token" ||
                error.message === "Owner not found"
            )
        ) {
            return NextResponse.json({ success: false, message: "Unauthorized action" }, { status: 401 });
        }

        return NextResponse.json({ success: false, message: "Failed to fetch stations" }, { status: 500 });
    }
}