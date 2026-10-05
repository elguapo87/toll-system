import adminAuth from "@/utils/adminAuth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const admin = await adminAuth();

        return NextResponse.json({ success: true, admin: { role: admin.role, email: admin.email } }, { status: 200 });

    } catch (error) {
        if (
            error instanceof Error && (
                error.message === "Unauthorized" ||
                error.message === "Invalid admin token"
            )
        ) {
            return NextResponse.json({ success: true, admin: null }, { status: 200 });
        }

        console.error(error);
        return NextResponse.json({ success: false, message: "Failed to fetch admin" }, { status: 500 });
    }
};