import { prisma } from "@/config/prisma";
import ownerAuth from "@/utils/ownerAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const owner = await ownerAuth();

        const { name } = await req.json();

        const existingStation = await prisma.tollStation.findFirst({
            where: {
                name
            }
        });

        if (existingStation) {
            return NextResponse.json({
                success: false,
                message: "Toll station with this name already exists"
            }, { status: 400 });
        }

        const station = await prisma.tollStation.create({
            data: {
                name,
                ownerId: owner.id
            }
        })

        return NextResponse.json({ success: true, station }, { status: 201 });

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

        return NextResponse.json({ success: false, message: "Failed to add station" }, { status: 500 });
    }
}