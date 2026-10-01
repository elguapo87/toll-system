import { prisma } from "@/config/prisma";
import ownerAuth from "@/utils/ownerAuth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const owner = await ownerAuth();

        const collections = await prisma.tollCollection.findMany({
            where: {
                station: {
                    ownerId: owner.id
                }
            },
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
                },

                vehicle: {
                    select: {
                        id: true,
                        type: true,
                        brand: true,
                        model: true,
                        color: true,
                        hasTrailer: true
                    }
                }
            },

            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json({ success: true, collections }, { status: 200 });

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

        return NextResponse.json({ success: true, message: "Failed to fetch collections" }, { status: 500 });
    }
}