import { prisma } from "@/config/prisma";
import adminAuth from "@/utils/adminAuth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await adminAuth();

        const workers = await prisma.tollWorker.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                active: true,

                station: {
                    select: {
                        name: true,
                        owner: {
                            select: {
                                name: true
                            }
                        }
                    }
                },

                collections: {
                    select: {
                        amount: true
                    }
                }
            },

            orderBy: {
                id: "asc"
            }
        });

        const formattedWorkers = workers.map((worker) => ({
            id: worker.id,
            worker: worker.firstName + " " + worker.lastName,
            station: worker.station.name,
            owner: worker.station.owner.name,
            status: worker.active,
            collected: worker.collections.reduce((total, collection) => total + collection.amount, 0)
        }));

        return NextResponse.json({ success: true, workers: formattedWorkers }, { status: 200 });

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