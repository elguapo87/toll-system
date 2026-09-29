import { prisma } from "@/config/prisma";
import ownerAuth from "@/utils/ownerAuth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const owner = await ownerAuth();

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const [
            stations,
            workers,
            totalRevenue,
            todayRevenue,
            recentCollections

        ] = await Promise.all([
            prisma.tollStation.count({
                where: {
                    ownerId: owner.id
                }
            }),

            prisma.tollWorker.count({
                where: {
                    station: {
                        ownerId: owner.id
                    }
                }
            }),

            prisma.tollCollection.aggregate({
                where: {
                    station: {
                        ownerId: owner.id
                    }
                },
                _sum: {
                    amount: true
                }
            }),

            prisma.tollCollection.aggregate({
                where: {
                    station: {
                        ownerId: owner.id
                    },
                    createdAt: {
                        gte: today
                    }
                },
                _sum: {
                    amount: true
                }
            }),

            prisma.tollCollection.findMany({
                where: {
                    station: {
                        ownerId: owner.id
                    }
                },
                select: {
                    id: true,
                    amount: true,
                    createdAt: true,

                    worker: {
                        select: {
                            firstName: true,
                            lastName: true,
                        }
                    },

                    vehicle: {
                        select: {
                            brand: true,
                            model: true,
                        }
                    },

                    station: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: 10
            })
        ]);

        return NextResponse.json({
            success: true,
            stations,
            workers,
            totalRevenue: totalRevenue._sum.amount ?? 0,
            todayRevenue: todayRevenue._sum.amount ?? 0,
            recentCollections
        }, { status: 200 });


    } catch (error) {
        console.error(error);

        if (
            error instanceof(Error) && (
                error.message === "Unauthorized" ||
                error.message === "Invalid token" ||
                error.message === "Owner not found" 
            )
        ) {
            return NextResponse.json({ success: false, message: "Unauthorized action" }, { status: 401 });
        }

        return NextResponse.json({ success: false, message: "Failed to fetch dashboard data" }, { status: 500 });
    }
}