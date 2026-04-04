"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TopBar from "@/components/layout/TopBar";
import { useEffect, useState } from "react";

export default function LayoutWithTopBar({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [showTopBar, setShowTopBar] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBar(window.scrollY < 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* z-index: 100 → dưới Ant Design Modal (z-index 1000) 
          nên popup/modal sẽ hiện trên header đúng cách */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", flexDirection: "column" }}>
        {/* Dùng CSS transition max-height thay vì mount/unmount để tránh giật */}
        <div className={showTopBar ? "topbar-wrapper topbar-visible" : "topbar-wrapper topbar-hidden"}>
          <TopBar />
        </div>
        <Navbar />
      </header>
      <main id="app-content-wrapper" style={{ minHeight: "80vh" }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
