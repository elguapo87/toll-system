import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/config/prisma";

const ownerAuth = async () => {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
        throw new Error("Unauthorized");
    }

    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    } catch (error) {
        throw new Error("Invalid token");
    }

    const owner = await prisma.owner.findUnique({
        where: {
            id: decoded.id
        },
        select: {
            id: true,
            name: true,
            createdAt: true
        }
    });

    if (!owner) {
        throw new Error("Owner not found");
    }

    return owner;
};

export default ownerAuth;