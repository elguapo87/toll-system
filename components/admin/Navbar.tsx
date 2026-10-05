"use client"

import { AdminContext } from "@/context/AdminContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext } from "react";

const Navbar = () => {
    const adminContext = useContext(AdminContext);
    if (!adminContext) throw new Error("AdminGuard page must be within AdminContextProvider");
    const { logout, adminLoading } = adminContext;

    const router = useRouter();

    const handleLogout = async () => {
        await logout();
    }

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 bg-stone-50 px-6 md:px-12 lg:px-24 xl:px-40
                flex items-center justify-between border-b border-slate-800 pb-1"
        >
            <div className="flex flex-col items-center gap-2">
                <Image
                    onClick={() => router.push("/admin")}
                    src="/logo.png"
                    alt="Logo"
                    width={80}
                    height={80}
                    className="size-20 translate-y-1/10 cursor-pointer"
                />
                <p className="text-sm font-black uppercase">Admin</p>
            </div>

            <button
                onClick={handleLogout}
                className={`flex items-center gap-2.5 bg-linear-to-r from-zinc-950 to-zinc-500 
                    text-zinc-50 hover:text-zinc-200 text-sm font-medium pl-5 pr-2 py-2
                    rounded-full cursor-pointer ${adminLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={adminLoading}
            >
                Logout
                <span className="size-7 rounded-full bg-white flex items-center justify-center">
                    <Image
                        src="/logout.svg"
                        alt="Logout"
                        width={20}
                        height={20}
                        className="size-5 hover:scale-105"
                    />
                </span>
            </button>
        </nav>
    )
}

export default Navbar;
