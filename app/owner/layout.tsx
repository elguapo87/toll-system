import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/owner/Navbar";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <Navbar />
            {children}
        </AuthGuard>
    )
}