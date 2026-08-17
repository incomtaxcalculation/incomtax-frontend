"use client";

import { useEffect, useState } from "react";
import { useRouter as useNextRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from "@/context/AppContext";
import { ImageModalProvider } from "@/context/ImageModalContext";
import { GlobalImageModal } from "@/components/layout/GlobalImageModal";
import { ThemeProvider } from "@/components/theme-provider";
import { ProgressBar } from "@/components/ProgressBar";
import "../globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import NProgress from "nprogress";

NProgress.configure({ showSpinner: false, trickleSpeed: 200, minimum: 0.3, easing: "ease", speed: 500 });

function useRouter() {
  const router = useNextRouter();
  const push = (href: string) => { NProgress.start(); router.push(href); };
  const replace = (href: string) => { NProgress.start(); router.replace(href); };
  return { ...router, push, replace };
}

function AdminRootContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProgressBar />
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster position="top-right" closeButton />
      <GlobalImageModal />
    </>
  );
}

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login" || pathname === "/admin/login/") {
      setChecked(true);
      return;
    }
    const url =`${process.env.NEXT_PUBLIC_API_URL || ""}/api/admin/refresh-token`;
    fetch(url, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          setChecked(true);
        } else {
          router.replace("/admin/login");
        }
      })
      .catch(() => router.replace("/admin/login"));
  }, [router, pathname]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0d7a7a]" />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AppProvider>
        <ImageModalProvider>
          <AdminRootContent>{children}</AdminRootContent>
        </ImageModalProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
