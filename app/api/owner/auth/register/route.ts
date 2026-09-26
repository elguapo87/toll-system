import { prisma } from "@/config/prisma";
import genToken from "@/utils/getToken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ success: false, message: "Missing details" }, { status: 400 });
        }

        const existingOwner = await prisma.owner.findUnique({
            where: {
                email
            }
        });
        if (existingOwner) {
            return NextResponse.json({ success: false, message: "Owner is already registered" }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ success: false, message: "Please enter a strong password" }, { status: 400 });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const owner = await prisma.owner.create({
            data: {
                name,
                email,
                password: hashPassword
            }
        });

        const token = genToken(owner.id);

        const cookieStore = await cookies();

        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60, 
            path: "/"
        });

        return NextResponse.json({
            success: true,
            message: "Registered successfully",
            owner: {
                id: owner.id,
                name: owner.name,
                createdAt: owner.createdAt
            }
        }, {status: 201});

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Failed to register" }, { status: 500 });
    }
}