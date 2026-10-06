import { prisma } from "@/config/prisma";
import adminAuth from "@/utils/adminAuth";
import ownerAuth from "@/utils/ownerAuth";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: Promise<{ id: number }> }) {
    try {
        await adminAuth();

        const { id } = await context.params;

        if (!id) {
            return NextResponse.json({ success: false, message: "Station id not found" }, { status: 400 });
        }

        const station = await prisma.tollStation.findUnique({
            where: {
                id: Number(id)
            },

            select: {
                name: true,

                owner: {
                    select: {
                        name: true
                    }
                },

                workers: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },

                collections: {
                    select: {
                        amount: true
                    }
                },

                _count: {
                    select: {
                        workers: true,
                        collections: true
                    }
                }
            }
        });

        if (!station) {
            return NextResponse.json({success: false, message: "Station not found"}, {status: 404});
        }

        const formattedStation = {
            name: station.name,
            owner: station.owner.name,
            workers: station.workers.map((worker) => worker.firstName + "" + worker.lastName),
            totalCollected: station.collections.reduce((total, collection) => total + collection.amount, 0),
            workersCount: station._count.workers,
            collectionsCount: station._count.collections
        };

        return NextResponse.json({ success: true, station: formattedStation }, { status: 200 });

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

        return NextResponse.json({ success: false, message: "Failed to fetch station" }, { status: 500 });
    }
}