import { prisma } from "@/config/prisma";
import adminAuth from "@/utils/adminAuth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await adminAuth();

        const collections = await prisma.tollCollection.findMany({
            select: {
                id: true,
                amount: true,
                createdAt: true,

                worker: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                },

                station: {
                    select: {
                        id: true,
                        name: true
                    }
                },

                vehicle: {
                    select: {
                        id: true,
                        licensePlate: true,
                        type: true,
                    }
                },
            },

            orderBy: {
                createdAt: "asc"
            }
        });

        return NextResponse.json({ success: true, collections }, { status: 200 });

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

        return NextResponse.json({ success: false, message: "Failed to fetch collections" }, { status: 500 });
    }
}