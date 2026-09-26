import { prisma } from "@/config/prisma";
import genToken from "@/utils/getToken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        const owner = await prisma.owner.findUnique({
            where: {
                email
            }
        });

        if (!owner) {
            return NextResponse.json({ success: false, message: "Owner not found" }, { status: 404 });
        }

        const passwordMatch = await bcrypt.compare(password, owner.password);
        if (!passwordMatch) {
            return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
        }

        const token = genToken(owner.id);

        const cookieStore = await cookies();

        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 30 * 60 * 60,
            path: "/"
        });

        return NextResponse.json({
            success: true,
            message: "Logged in successful",
            owner: {
                id: owner.id,
                name: owner.name,
                createdAt: owner.createdAt
            }
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Failed to login" }, { status: 500 });
    }
}