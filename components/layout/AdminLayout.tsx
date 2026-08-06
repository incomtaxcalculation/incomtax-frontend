"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
    setIsCollapsed(savedCollapsed);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebarCollapsed", String(isCollapsed));
    }
  }, [isCollapsed, mounted]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Sidebar
        isCollapsed={mounted ? isCollapsed : false}
        setIsCollapsed={setIsCollapsed}
        isMobile={isMobile}
      />
      <Header isCollapsed={mounted ? isCollapsed : false} />
      <main
        className={cn(
          "mt-16 p-6 flex-1 transition-all duration-300",
          isMobile ? "ml-0" : isCollapsed ? "ml-16" : "ml-64",
        )}
      >
        {children}
      </main>
      <footer
        className={cn(
          "border-t bg-muted/50 py-4 px-6 text-center text-sm text-muted-foreground transition-all duration-300",
          isMobile ? "ml-0" : isCollapsed ? "ml-16" : "ml-64",
        )}
      >
        2026 Admin Panel. All rights reserved.
      </footer>
    </div>
  );
}
