import { prisma } from "@/config/prisma";
import adminAuth from "@/utils/adminAuth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await adminAuth();

        const vehicles = await prisma.vehicle.findMany({
            select: {
                id: true,
                licensePlate: true,
                brand: true,
                model: true,
                type: true,

                _count: {
                    select: {
                        collections: true
                    }
                },

                collections: {
                    select: {
                        amount: true,
                        station: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            },

            orderBy: {
                id: "asc"
            }
        });

        const formattedVehicles = vehicles.map((vehicle) => ({
            id: vehicle.id,
            licensePlate: vehicle.licensePlate,
            brand: vehicle.brand,
            model: vehicle.model,
            type: vehicle.type,

            collections: vehicle._count.collections,

            stations: [
                ...new Map(
                    vehicle.collections.map((collection) => [
                        collection.station.id,
                        collection.station
                    ])
                ).values()
            ],

            revenue: vehicle.collections.reduce((total, collection) => total + collection.amount, 0)
        }));

        return NextResponse.json({ success: true, vehicles: formattedVehicles }, { status: 200 });

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

        return NextResponse.json({ success: false, message: "Failed to fetch vehicles" }, { status: 500 });
    }
}