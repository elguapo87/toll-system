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
                name: true
            }
        });

        return NextResponse.json({ success: true, stations }, { status: 200 });

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

