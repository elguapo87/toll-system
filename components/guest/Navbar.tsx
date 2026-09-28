"use client"

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
    const pathName = usePathname();
    const authPathName = pathName.startsWith("/login");
    const adminPathName = pathName.startsWith("/adminLogin");

    const router = useRouter();

    return (
        <nav className="bg-white px-6 md:px-12 lg:px-24 xl:px-40 py-4 flex items-center justify-between relative">
            <div>
                <Image
                    onClick={() => router.push("/")}
                    src="/logo.png"
                    alt="Logo"
                    width={80}
                    height={80}
                    className="size-20 translate-y-1/10 cursor-pointer"
                />
            </div>

            <div className="flex items-center flex-col md:flex-row gap-1 md:gap-5">
                {!adminPathName && !authPathName && (
                    <Link
                        href="/adminLogin"
                        className="flex items-center gap-2.5 bg-linear-to-r from-zinc-950 to-zinc-500 text-zinc-50
                     hover:text-zinc-200 text-sm font-medium pl-5 pr-2 py-2 rounded-full cursor-pointer border-0"
                    >
                        Login as Admin
                        <span className="size-7 rounded-full bg-white flex items-center justify-center">
                            <Image 
                                src="/admin.svg"
                                alt="Admin"
                                width={26}
                                height={26}
                            />
                        </span>
                    </Link>
                )}

                {!authPathName && !adminPathName && (
                    <Link
                        href="/login"
                        className="flex items-center gap-2.5 bg-linear-to-r from-zinc-950 to-zinc-500 text-zinc-50
                     hover:text-zinc-200 text-sm font-medium pl-5 pr-2 py-2 rounded-full cursor-pointer border-0"
                    >
                        Login/register
                        <span className="size-7 rounded-full bg-white flex items-center justify-center">
                            <svg
                                width="12" height="10"
                                viewBox="0 0 12 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M.6 4.602h10m-4-4 4 4-4 4"
                                    stroke="#3f3f47"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                    </Link>
                )}
            </div>

        </nav>
    )
}

export default Navbar;
