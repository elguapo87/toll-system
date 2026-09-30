import { prisma } from "@/config/prisma";
import ownerAuth from "@/utils/ownerAuth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const owner = await ownerAuth();

        const stations = await prisma.tollStation.findMany({
            where: {
                ownerId: owner.id
            },
            select: {
                id: true,
                name: true,

                workers: {
                    select: {
                        firstName: true,
                        lastName: true,
                        collectedAmount: true
                    }
                },

                _count: {
                    select: {
                        collections: true,
                        workers: true
                    }
                },

                collections: {
                    select: {
                        amount: true
                    }
                }
            },

            orderBy: {
                createdAt: "asc"
            }
        });

        const formattedStations = stations.map((station) => ({
            id: station.id,
            name: station.name,
            workers: station.workers.map((worker) => worker.firstName + " " + worker.lastName),
            collections: station._count.collections,
            workersNumber: station._count.workers,
            totalCollected: station.collections.reduce((total, collection) => total + collection.amount, 0)
        }));

        return NextResponse.json({ success: true, formattedStations }, { status: 200 });

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