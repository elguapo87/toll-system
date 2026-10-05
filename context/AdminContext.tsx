"use client"

import api from "@/utils/axios";
import axios, { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

type Admin = {
    role: "ADMIN";
    email: string;
};

type LoginPayload = {
    email: string;
    password: string;
};

interface AdminContextType {
    admin: Admin | null;
    login: (credentials: LoginPayload) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
    adminLoading: boolean;
};

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

const AdminContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [loading, setLoading] = useState(true);
    const [adminLoading, setAdminLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                setLoading(true);
                const { data } = await api.get("/admin/auth/me");
                if (data.success) {
                    setAdmin(data.admin);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdmin();
    }, []);

    const login = async (credentials: LoginPayload) => {
        try {
            setAdminLoading(true);
            const { data } = await api.post("/admin/auth/login", credentials);
            if (data.success) {
                const meResponse = await api.get("/admin/auth/me");

                if (meResponse.data.success) {
                    setAdmin(meResponse.data.admin);
                    toast.success(data.message);
                    router.replace("/admin");
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        } finally {
            setAdminLoading(false);
        }
    };

    const logout = async () => {
        try {
            setAdminLoading(true);
            const { data } = await api.post("/admin/auth/logout");
            if (data.success) {
                setAdmin(null);
                toast.success(data.message);
                router.replace("/");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        } finally {
            setAdminLoading(false);
        }
    };

    const value = {
        admin,
        login,
        logout,
        loading,
        adminLoading
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    )
};

export default AdminContextProvider;