"use client"

import { AuthContext } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useState } from "react";

const Navbar = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("Navbar must be within AuthContextProvider");
    const { owner, logout } = authContext;

    const [menuOpen, setMenuOpen] = useState(false);

    const router = useRouter();

    const pathName = usePathname();

    const workerPathName = pathName.startsWith("/protected/worker/");

    const navItems = [
        { name: "Dashboard", url: "/protected" },
        { name: "Stations", url: "/protected/stations" },
        { name: "Collect Toll", url: "/protected/collectToll" },
        { name: "Add Worker", url: "/protected/addWorker" },
        { name: "Workers", url: "/protected/workers" },
        { name: "Add Station", url: "/protected/addStation" },
        { name: "Collections", url: "/protected/collections" },
    ];

    const handleLogout = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        await logout();
    }

    if (!owner) return null;

    return (
        <nav
            className="bg-white px-6 md:px-12 lg:px-24 xl:px-40 py-4
                flex items-center justify-between relative z-50"
        >
            <div>
                <Image
                    onClick={() => router.push("/protected")}
                    src="/logo.png"
                    alt="Logo"
                    width={80}
                    height={80}
                    className="size-20 translate-y-1/10 cursor-pointer"
                />
            </div>

            {!workerPathName && (
                <div className="hidden md:flex items-center bg-zinc-50 border border-zinc-200 rounded-full px-1 py-1 gap-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.url}
                            className={`px-4 py-1.5 rounded-full text-sm transition-colors 
                                ${pathName === item.url
                                    ? 'bg-white border border-zinc-200 font-medium text-zinc-800 hover:text-zinc-600'
                                    : 'text-zinc-500 hover:text-zinc-400'}`}
                        >
                            {item.name}
                        </Link>

                    ))}
                </div>
            )}

            <div
                className="hidden md:flex items-center gap-2.5 bg-linear-to-r from-zinc-950 to-zinc-500
                    text-zinc-50 hover:text-zinc-200 text-sm font-medium pl-5 pr-2 py-2 rounded-full border-0"
            >
                <p>{owner.name}</p>
                <button
                    onClick={handleLogout}
                    className="size-7 rounded-full bg-white flex items-center justify-center cursor-pointer"
                >
                    <Image
                        src="/logout.svg"
                        alt="Logout"
                        width={20}
                        height={20}
                        className="size-5 hover:scale-105"
                    />
                </button>
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 cursor-pointer bg-transparent border-0 p-1">
                <span className={`block w-6 h-0.5 bg-zinc-800 transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-zinc-800 transition-opacity ${menuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-zinc-800 transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>

            {menuOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-t border-zinc-200
                        flex flex-col p-5 gap-1 md:hidden z-50"
                >
                    <div
                        className="flex items-center justify-center gap-2.5 bg-linear-to-r from-zinc-950
                            to-zinc-500 text-zinc-50 text-sm font-medium pl-5 pr-2 py-2 rounded-full
                             border-0 mt-3 w-fit mb-5"
                    >
                        <p>{owner.name}</p>

                        <button
                            onClick={handleLogout}
                            className="size-7 rounded-full bg-white flex items-center justify-center cursor-pointer"
                        >
                            <Image
                                src="/logout.svg"
                                alt="Logout"
                                width={20}
                                height={20}
                                className="size-5 hover:scale-105"
                            />
                        </button>
                    </div>

                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.url}
                            onClick={() => setMenuOpen(false)}
                            className={`px-4 py-2.5 rounded-lg text-sm 
                                ${pathName === item.url
                                    ? 'bg-zinc-50 font-medium text-zinc-800'
                                    : 'text-zinc-500 hover:bg-zinc-50'}`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    )
}

export default Navbar;
