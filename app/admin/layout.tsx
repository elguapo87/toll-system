
import Navbar from "@/components/admin/Navbar";
import Sidebar from "@/components/admin/Sidebar";
import AdminGuard from "@/components/auth/AdminGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminGuard>
            <Navbar />
            <div className="flex mt-23">
                <Sidebar />
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </AdminGuard>
    )
}