import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ success: false, message: "Invalid Credentials" }, { status: 401 });
        }

        const token = jwt.sign({ role: "ADMIN", email }, process.env.JWT_SECRET!, { expiresIn: "1d" });

        const cookieStore = await cookies();

        cookieStore.set("adminToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60,
            path: "/"
        });

        return NextResponse.json({ success: true, message: "Admin login successful" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Failed to login" }, { status: 500 });
    }
}