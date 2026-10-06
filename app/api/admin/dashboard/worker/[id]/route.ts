import { prisma } from "@/config/prisma";
import adminAuth from "@/utils/adminAuth";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: Promise<{ id: number }> }) {
    try {
        await adminAuth();

        const { id } = await context.params;

        const worker = await prisma.tollWorker.findUnique({
            where: {
                id: Number(id)
            },
            select: {
                firstName: true,
                lastName: true,
                active: true,
                collectedAmount: true,
                createdAt: true,

                station: {
                    select: {
                        name: true
                    }
                },

                _count: {
                    select: {
                        collections: true
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
            error instanceof Error && (
                error.message === "Unauthorized" ||
                error.message === "Invalid admin token"
            )
        ) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({ success: false, message: "Failed to fetch worker details" }, { status: 500 });
    }
}