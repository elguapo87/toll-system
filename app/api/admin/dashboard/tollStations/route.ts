import { prisma } from "@/config/prisma";
import adminAuth from "@/utils/adminAuth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await adminAuth();

        const stations = await prisma.tollStation.findMany({
            select: {
                id: true,
                name: true,

                owner: {
                    select: {
                        name: true
                    }
                },

                _count: {
                    select: {
                        workers: true,
                        collections: true
                    }
                },

                collections: {
                    select: {
                        amount: true
                    }
                }
            },
            orderBy: {
                id: "desc"
            }
        });

        

        const formattedStations = stations.map((station) => ({
            id: station.id,
            name: station.name,
            owner: station.owner.name,
            workers: station._count.workers,
            collections: station._count.collections,
            revenue: station.collections.reduce((total, collection) => total + collection.amount, 0),

        }));

        return NextResponse.json({ success: true, formattedStations }, { status: 200 });


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

        return NextResponse.json({ success: false, message: "Failed to fetch stations" }, { status: 500 });
    }
}