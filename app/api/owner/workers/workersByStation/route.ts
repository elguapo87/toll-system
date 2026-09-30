import { prisma } from "@/config/prisma";
import ownerAuth from "@/utils/ownerAuth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const owner = await ownerAuth();

        const workers = await prisma.tollWorker.findMany({
            where: {
                station: {
                    ownerId: owner.id
                }
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                collectedAmount: true,
                active: true,
                
                station: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                id: "asc"
            }
        });

        return NextResponse.json({ success: true, workers }, { status: 200 });

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

        return NextResponse.json({ success: false, message: "Failed to fetch workers" }, { status: 500 });
    }
}