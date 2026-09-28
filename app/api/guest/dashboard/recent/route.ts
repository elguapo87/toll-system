import { prisma } from "@/config/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const recentCollections = await prisma.tollCollection.findMany({
            take: 10,
            orderBy: {
                createdAt: "desc"
            },
            include: {
                worker: true,
                vehicle: true,
                station: true
            }
        });

        return NextResponse.json({ success: true, recentCollections }, { status: 200 });
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Failed to fetch recent collections" }, { status: 500 });
    }
}