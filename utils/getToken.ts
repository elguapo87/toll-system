import jwt from "jsonwebtoken";

const genToken = (id: number) => {
    const jwtSecret = process.env.JWT_SECRET!
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is missing or not defined in environment variables");
    }

    return jwt.sign({ id }, jwtSecret, { expiresIn: "20d" });
};

export default genToken;