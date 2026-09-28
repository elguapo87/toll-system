"use client"

import GuestGuard from "@/components/auth/GuestGuard"
import Navbar from "@/components/guest/Navbar"

export default function GuestLayout({ children }: { children: React.ReactNode }) {
    return (
        <GuestGuard>
            <Navbar />
            {children}
        </GuestGuard>
    )
}