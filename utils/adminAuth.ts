import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const adminAuth = async () => {
    const token = (await cookies()).get("adminToken")?.value;
    if (!token) {
        throw new Error("Unauthorized");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string, email: string };

        if (decoded.role !== "ADMIN" || decoded.email !== process.env.ADMIN_EMAIL) {
            throw new Error("Unauthorized")
        }

        return decoded;
        
    } catch (error) {
        throw new Error("Invalid admin token");
    }
};

export default adminAuth;