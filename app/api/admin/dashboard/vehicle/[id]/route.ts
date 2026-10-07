import { prisma } from "@/config/prisma";
import adminAuth from "@/utils/adminAuth";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: Promise<{ id: number }> }) {
    try {
        await adminAuth();

        const { id } = await context.params;

        const vehicleId = Number(id);

        if (Number.isNaN(vehicleId)) {
            return NextResponse.json({ success: false, message: "Invalid vehicle ID" }, { status: 400 });
        }

        const vehicle = await prisma.vehicle.findUnique({
            where: {
                id: vehicleId
            },

            select: {
                id: true,
                licensePlate: true,
                brand: true,
                model: true,
                color: true,
                type: true,
                hasTrailer: true,

                collections: {
                    select: {
                        id: true,
                        amount: true,
                        createdAt: true,

                        station: {
                            select: {
                                id: true,
                                name: true
                            }
                        },

                        worker: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true
                            }
                        }
                    },

                    orderBy: {
                        createdAt: "desc"
                    }
                }
            },
        });

        if (!vehicle) {
            return NextResponse.json({ success: false, message: "Vehicle not found" }, { status: 404 });
        }

        const revenue = vehicle.collections.reduce((total, collection) => total + collection.amount, 0);

        const stations = vehicle.collections.reduce(
            (groups, collection) => {
                const stationId = collection.station.id;

                if (!groups[stationId]) {
                    groups[stationId] = {
                        id: collection.station.id,
                        name: collection.station.name,
                        collections: 0,
                        revenue: 0
                    };
                }

                groups[stationId].collections += 1;
                groups[stationId].revenue += collection.amount;

                return groups;
            },
            {} as Record<
                number,
                {
                    id: number;
                    name: string;
                    collections: number;
                    revenue: number;
                }
            >
        );

        const history = vehicle.collections.map((collection) => ({
            id: collection.id,
            amount: collection.amount,
            createdAt: collection.createdAt,
            station: collection.station,
            worker: collection.worker
        }));

        const result = {
            vehicle: {
                id: vehicle.id,
                licensePlate: vehicle.licensePlate,
                brand: vehicle.brand,
                model: vehicle.model,
                color: vehicle.color,
                type: vehicle.type,
                hasTrailer: vehicle.hasTrailer
            },

            collections: vehicle.collections.length,

            revenue,

            stations: Object.values(stations),

            history
        };

        return NextResponse.json({ success: true, result }, { status: 200 });

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