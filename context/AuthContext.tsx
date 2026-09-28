"use client"

import api from "@/utils/axios";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

type Owner = {
    id: number;
    name: string;
    createdAt: string | Date;
};

type RegisterPayload = {
    name: string;
    email: string;
    password: string;
};

type LoginPayload = {
    email: string;
    password: string;
};

interface AuthContextType {
    owner: Owner | null;
    setOwner: React.Dispatch<React.SetStateAction<Owner | null>>;
    register: (credentials: RegisterPayload) => Promise<void>;
    login: (credentials: LoginPayload) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
    authLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [owner, setOwner] = useState<Owner | null>(null);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const fetchOwner = async () => {
            try {
                setLoading(true);
                const { data } = await api.get("/owner/auth/me");
                if (data.success) {
                    setOwner(data.owner);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchOwner();
    }, []);

    const register = async (credentials: RegisterPayload) => {
        try {
            setAuthLoading(true);
            const { data } = await api.post("/owner/auth/register", credentials);
            if (data.success) {
                setOwner(data.owner);
                toast.success(data.message);
                router.replace("/owner")
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        } finally {
            setAuthLoading(false);
        }
    };

    const login = async (credentials: LoginPayload) => {
        try {
            setAuthLoading(true);
            const { data } = await api.post("/owner/auth/login", credentials);
            if (data.success) {
                setOwner(data.owner);
                toast.success(data.message);
                router.replace("/owner");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        } finally {
            setAuthLoading(false);
        }
    };

    const logout = async () => {
        try {
            setAuthLoading(true);
            const { data } = await api.post("/owner/auth/logout");
            if (data.success) {
                setOwner(null);
                toast.success(data.message);
                router.replace("/");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        } finally {
            setAuthLoading(false);
        }
    };

    const value = {
        owner, setOwner,
        register,
        login,
        logout,
        loading,
        authLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthContextProvider;