import { prisma } from "@/config/prisma";
import ownerAuth from "@/utils/ownerAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const owner = await ownerAuth();

        const { firstName, lastName, stationId } = await req.json();

        if (!stationId) {
            return NextResponse.json({ success: false, message: "stationId is required" }, { status: 403 });
        }

        const station = await prisma.tollStation.findUnique({
            where: {
                id: stationId
            }
        });

        if (!station) {
            return NextResponse.json({ success: false, message: "Station not found" }, { status: 404 });
        }

        const existingWorker = await prisma.tollWorker.findFirst({
            where: {
                firstName,
                lastName
            }
        });

        if (existingWorker) {
            return NextResponse.json({ success: false, message: "This worker already exists" }, { status: 400 });
        }

        if (owner.id !== station.ownerId) {
             return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 400 });
        }

        await prisma.tollWorker.create({
            data: {
                firstName,
                lastName,
                stationId
            }
        })

        return NextResponse.json({ success: true, message: "Worker added successfully" }, { status: 201 });

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

        return NextResponse.json({ success: false, message: "Failed to add worker" }, { status: 500 });
    }
}