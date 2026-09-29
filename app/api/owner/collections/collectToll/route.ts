import { VehicleType } from "@/config/generated/prisma/enums";
import { prisma } from "@/config/prisma";
import ownerAuth from "@/utils/ownerAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const owner = await ownerAuth();

        const { workerId, vehicle } = await req.json() as {
            workerId: number,
            vehicle: {
                licensePlate: string,
                brand: string,
                model: string,
                color: string,
                type: VehicleType
                hasTrailer?: boolean
            }
        };

        if (!workerId || !vehicle) {
            return NextResponse.json({ success: false, message: "Missing workerId or vehicle" }, { status: 400 });
        }

        const { licensePlate, brand, model, color, type, hasTrailer } = vehicle;

        if (!type || !licensePlate.trim() || !brand.trim() || !model.trim() || !color.trim()) {
            return NextResponse.json({ success: false, message: "Missing vehicle fields" }, { status: 400 });
        }

        if (!Object.values(VehicleType).includes(type)) {
            return NextResponse.json({ success: false, message: "Invalid vehicle type" }, { status: 400 });
        }

        if (type !== VehicleType.TRUCK && hasTrailer !== undefined) {
            return NextResponse.json({ success: false, message: "Only trucks can have trailers" }, { status: 400 });
        }

        const worker = await prisma.tollWorker.findUnique({
            where: {
                id: workerId,
                station: {
                    ownerId: owner.id
                }
            }
        });

        if (!worker) {
            return NextResponse.json({ success: false, message: "Worker not found" }, { status: 404 });
        }

        if (!worker.active) {
            return NextResponse.json({
                success: false,
                message: "Worker is inactive and cannot collect tolls"
            }, { status: 404 });
        }

        let amount = 0;

        switch (type) {
            case VehicleType.BIKE:
                return amount = 240;

            case VehicleType.BUS:
                return amount = 300;

            case VehicleType.TRUCK:
                return hasTrailer ? 450 : 350;

            case VehicleType.BIKE:
                return amount = 200;
        }

        const result = await prisma.$transaction(async (tx) => {
            const existingVehicle = await tx.vehicle.findUnique({
                where: {
                    licensePlate
                }
            });

            let vehicleRecord;

            if (existingVehicle) {
                vehicleRecord = existingVehicle;
            } else {
                vehicleRecord = await tx.vehicle.create({
                    data: {
                        licensePlate,
                        brand,
                        model,
                        color,
                        type,
                        hasTrailer: VehicleType.TRUCK ? hasTrailer : null
                    }
                })
            }

            const collection = await tx.tollCollection.create({
                data: {
                    workerId: worker.id,
                    amount,
                    vehicleId: vehicleRecord.id,
                    stationId: worker.stationId
                }
            })

            await tx.tollWorker.update({
                where: {
                    id: worker.id
                },
                data: {
                    collectedAmount: {
                        increment: amount
                    }
                }
            });

            return {
                vehicleRecord,
                collection
            }
        });

        return NextResponse.json({
            success: true,
            message: "Toll collected successfully.",
            collection: result.collection,
            vehicle: result.vehicleRecord,
            amount
        }, { status: 201 });

    } catch (error) {
        console.error(error);

        if (
            error instanceof (Error) && (
                error.message === "Unauthorized" ||
                error.message === "Invalid token" ||
                error.message === "Owner not found"
            )
        ) {
            return NextResponse.json({ success: false, message: "Unauthorized action" }, { status: 401 });
        }

        return NextResponse.json({ success: false, message: "Failed to collect toll" }, { status: 500 });
    }
}