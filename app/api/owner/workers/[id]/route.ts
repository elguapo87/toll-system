import { prisma } from "@/config/prisma";
import ownerAuth from "@/utils/ownerAuth";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: Promise<{ id: number }> }) {
    try {
        const owner = await ownerAuth();

        const { id } = await context.params;

        const worker = await prisma.tollWorker.findUnique({
            where: {
                id: Number(id),
                station: {
                    ownerId: owner.id
                }
            },

            include: {
                station: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if (!worker) {
            return NextResponse.json({ success: false, message: "Worker not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, worker }, { status: 200 });


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

        return NextResponse.json({ success: false, message: "Failed to fetch worker data" }, { status: 500 });
    }
}