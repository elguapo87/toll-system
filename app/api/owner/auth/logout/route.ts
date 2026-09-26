import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        (await cookies()).set("token", "", {
            expires: new Date(0),
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
        });

        return NextResponse.json({ success: true, message: "Logged out successful" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Failed to logout" }, { status: 500 });
    }
}