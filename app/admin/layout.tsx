import AdminNavbar from "@/components/admin/Navbar";
import AdminGuard from "@/components/auth/AdminGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminGuard>
            <AdminNavbar />
            {children}
        </AdminGuard>
    )
}