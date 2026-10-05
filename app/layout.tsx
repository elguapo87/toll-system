import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthContextProvider from "@/context/AuthContext";
import Footer from "@/components/Footer";
import AdminContextProvider from "@/context/AdminContext";

const roboto = Roboto({
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Toll Station System",
  description: "Toll Station Management System"
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
    >
      <body className={`${roboto.className} min-h-full antialiased`}>
        <AdminContextProvider>
          <AuthContextProvider>
            <Toaster />
            <div className="relative min-h-screen">
              {children}
              <Footer />
            </div>
          </AuthContextProvider>
        </AdminContextProvider>
      </body>
    </html>
  );
}
