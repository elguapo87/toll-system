"use client"

import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import Loader from "../Loader";

export default function GuestGuard({ children }: { children: React.ReactNode }) {
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("GuestGuard must be within AuthContextProvider");
    const { owner, loading } = authContext;

    const router = useRouter();

    useEffect(() => {
        if (!loading && owner) {
            router.push("/owner");
        }
    }, [owner, loading, router]);

    if (loading || owner) return <Loader />

    return <>{children}</>
}