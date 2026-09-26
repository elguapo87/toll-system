import ownerAuth from "@/utils/ownerAuth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const owner = await ownerAuth();

        return NextResponse.json({ success: true, owner }, { status: 200 });

    } catch (error) {
        console.error(error);

        // GUESTs
        if (
            error instanceof Error && (
                error.message === "Unauthorized" ||
                error.message === "Invalid token" ||
                error.message === "Owner not found"
            )
        ) {
            return NextResponse.json({ success: true, owner: null }, { status: 200 });
        }

        return NextResponse.json({ success: false, message: "Failed to fetch owner" }, { status: 500 });
    }
}