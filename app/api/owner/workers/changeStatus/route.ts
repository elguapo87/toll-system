import { prisma } from "@/config/prisma";
import ownerAuth from "@/utils/ownerAuth";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const owner = await ownerAuth();

        const { workerId, email, password } = await req.json();

        if (!workerId || !email || !password) {
            return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
        }

        const worker = await prisma.tollWorker.findUnique({
            where: {
                id: workerId
            },
            select: {
                id: true,
                active: true,

                station: {
                    select: {
                        ownerId: true
                    }
                }
            }
        });

        if (!worker) {
            return NextResponse.json({ success: false, message: "Worker not found" }, { status: 404 });
        }

        if (owner.id !== worker.station.ownerId) {
            return NextResponse.json({ success: false, message: "Forbiden" }, { status: 403 });
        }

        const currentOwner = await prisma.owner.findUnique({
            where: {
                email
            }
        });

        if (!currentOwner) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const matchPassword = await bcrypt.compare(password, currentOwner.password);

        if (!matchPassword) {
            return NextResponse.json({ success: false, message: "Wrong credentials" }, { status: 400 });
        }

        const isActive = worker.active;

        const updatedWorker = await prisma.tollWorker.update({
            where: {
                id: worker.id
            },
            data: {
                active: !isActive
            }
        });

        return NextResponse.json({ 
            success: true,
            active: updatedWorker.active, 
            message: "Active status changed" 
        }, { status: 200 }); 

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

        return NextResponse.json({ success: false, message: "Failed to change status" }, { status: 500 });
    }
}