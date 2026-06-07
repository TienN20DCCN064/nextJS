"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TopBar from "@/components/layout/TopBar";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function LayoutWithTopBar({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [showTopBar, setShowTopBar] = useState(true);
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard');

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBar(window.scrollY < 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", flexDirection: "column" }}>
        {!isAdminPage && (
          <div className={showTopBar ? "topbar-wrapper topbar-visible" : "topbar-wrapper topbar-hidden"}>
            <TopBar />
          </div>
        )}
        <Navbar />
      </header>
      <main id="app-content-wrapper" style={{ minHeight: "80vh" }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
