"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation";

const Sidebar = () => {

    const pathName = usePathname();

    const navLinks = [
        { name: "Dashboard", link: "/admin", icon: "/dashboard.svg" },
        { name: "Toll Stations", link: "/admin/tollStations", icon: "/house.svg" },
        { name: "Workers", link: "/admin/workers", icon: "/worker.svg" },
        { name: "Vehicles", link: "/admin/vehicles", icon: "/vehicle.svg" },
        { name: "Collections", link: "/admin/collections", icon: "/total_money.svg" }
    ];

    return (
        <div className="min-h-fit border-r max-sm:min-w-[15%] border-slate-800 mb-30 md:mb-40">
            <ul className="mt-5">
                {navLinks.map((item) => (
                    <Link
                        key={item.name}
                        href={item.link}
                        className={`flex items-center gap-3 py-5 px-3 md:px-9 md:min-w-62.5 cursor-pointer
                            ${pathName === item.link ? "bg-slate-200" : ""}`}
                    >
                        <Image
                            src={item.icon}
                            alt="Dashboard"
                            width={40}
                            height={40}
                            className="size-8 md:size-10"
                        />
                        <p className="hidden sm:block">{item.name}</p>
                    </Link>
                ))}

            </ul>
        </div>
    )
}

export default Sidebar