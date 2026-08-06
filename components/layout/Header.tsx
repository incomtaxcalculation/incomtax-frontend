"use client";

import { useRouter } from "@/hooks/useRouter";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { House } from "lucide-react";

export function Header({ isCollapsed }: { isCollapsed: boolean }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  return (
    <header className={`fixed top-0 right-0 z-30 h-16 border-b bg-muted ${isCollapsed ? "w-[calc(100%-4rem)]" : "w-[calc(100%-16rem)]"}`}>
      <div className="flex h-full items-center justify-end gap-4 px-6">
        <Link href="/" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="gap-2">
            <House className="h-4 w-4" />
            Home Page
          </Button>
        </Link>
        <ThemeToggle />
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
