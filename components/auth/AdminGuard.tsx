"use client"

import { AdminContext } from "@/context/AdminContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import Loader from "../Loader";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const adminContext = useContext(AdminContext);
    if (!adminContext) throw new Error("AdminGuard must be within AdminContextProvider");
    const { admin, loading } = adminContext;

    const router = useRouter();

    useEffect(() => {
        if (!loading && !admin) {
            router.replace("/");
        }

    }, [admin, loading, router]);

    if (loading || !admin) return <Loader />

    return <>{children}</>
}