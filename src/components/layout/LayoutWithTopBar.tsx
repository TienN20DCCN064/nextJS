"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TopBar from "@/components/layout/TopBar";
import { useEffect, useState } from "react";

export default function LayoutWithTopBar({ children }: Readonly<{ children: React.ReactNode }>) {
  const [showTopBar, setShowTopBar] = useState(true);
  useEffect(() => {
    const handleScroll = () => {
      setShowTopBar(window.scrollY < 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <>
      {showTopBar && <TopBar />}
      <div style={{ position: 'relative', zIndex: 1000 }}>
        <Navbar fixedTop={showTopBar} />
      </div>
      <main style={{ minHeight: '80vh' }}>{children}</main>
      <Footer />
    </>
  );
}
