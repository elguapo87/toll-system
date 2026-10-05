"use client"

import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import Loader from "../Loader";
import { AdminContext } from "@/context/AdminContext";

export default function GuestGuard({ children }: { children: React.ReactNode }) {
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("GuestGuard must be within AuthContextProvider");
    const { owner, loading } = authContext;

    const adminContext = useContext(AdminContext);
    if (!adminContext) throw new Error("GuestGuard must be within AdminContextProvider");
    const { admin, loading: adminLoading } = adminContext;

    const router = useRouter();

    useEffect(() => {
        if (!loading && owner) {
            router.replace("/owner");
        }
    }, [owner, loading, router]);

    useEffect(() => {
        if (!adminLoading && admin) {
            router.replace("/admin");
        }
    }, [admin, adminLoading, router]);

    if (loading || owner) return <Loader />

    if (adminLoading || admin) return <Loader />

    return <>{children}</>
}