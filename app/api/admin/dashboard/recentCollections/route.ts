import { prisma } from "@/config/prisma";
import adminAuth from "@/utils/adminAuth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await adminAuth();

        const recentCollections = await prisma.tollCollection.findMany({
            select: {
                id: true,
                amount: true,
                createdAt: true,

                worker: {
                    select: {
                        firstName: true,
                        lastName: true

                    }
                },

                 vehicle: {
                    select: {
                        brand: true,
                        model: true
                    }
                },

                 station: {
                    select: {
                        name: true
                    }
                }
            },

            take: 10,
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json({ success: true, recentCollections }, { status: 200 });

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