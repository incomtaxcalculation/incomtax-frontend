"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useRouter } from "@/hooks/useRouter";
import {
  LayoutDashboard,
  FileText,
  Cog,
  Video,
  MoreHorizontal,
  Settings,
  Building2,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  SidebarClose,
  SidebarOpen,
  MessageCircle,
  Mail
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";

interface NavItem {
  to: string;
  label: string;
  icon: any;
  exact?: boolean;
  subItems?: NavItem[];
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const SIDEBAR_CONFIG: NavSection[] = [
  {
    label: "Home",
    items: [
      {
        to: "/admin/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
      { to: "/admin/blogs", label: "Blogs", icon: FileText },
      { to: "/admin/services", label: "Services", icon: Cog },
      { to: "/admin/videos", label: "Videos", icon: Video },
      { to: "/admin/messages", label: "Messages", icon: MessageCircle },
      { to: "/admin/newsletter", label: "Newsletter", icon: Mail },
    ],
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobile: boolean;
}

export function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(false);
    }
  }, [isMobile, setIsCollapsed]);

  useEffect(() => {
    if (isCollapsed) {
      setProfileMenuOpen(false);
    }
  }, [isCollapsed]);

  const handleNavigation = (href: string) => {
    router.push(href);
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const toggleSection = (sectionLabel: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionLabel]: !prev[sectionLabel],
    }));
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "z-40 h-screen border-r bg-muted transition-all duration-300",
          isMobile
            ? isMobileOpen
              ? "fixed left-0 top-0 w-64"
              : "fixed -left-64 w-64"
            : "fixed left-0 top-0 w-64",
          !isMobile && isCollapsed && "w-16",
        )}
      >
        {/* Top Section - Brand/Identity */}
        <div
          className={cn(
            "flex h-16 items-center border-b",
            isCollapsed ? "justify-center px-2" : "px-6",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <span className="text-lg font-semibold text-foreground">
                Admin Panel
              </span>
            )}
          </div>
        </div>

        <div className="flex h-[calc(100vh-4rem)] flex-col">
          {/* Main Navigation */}
          <div
            className={cn(
              "flex-1 space-y-6 overflow-y-auto",
              isCollapsed ? "px-2 py-4" : "p-4",
            )}
          >
            {SIDEBAR_CONFIG.map((section) => (
              <div key={section.label}>
                {!isCollapsed && (
                  <p className="mb-2 px-3 text-xs font-semibold text-muted-foreground">
                    {section.label}
                  </p>
                )}
                <nav className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const hasSubItems =
                      item.subItems && item.subItems.length > 0;
                    const itemActive = isActive(item.to, item.exact);
                    const sectionOpen = openSections[section.label];

                    if (hasSubItems) {
                      return (
                        <Collapsible
                          key={item.to}
                          open={sectionOpen}
                          onOpenChange={() => toggleSection(section.label)}
                        >
                          <CollapsibleTrigger
                            className={cn(
                              "w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-colors",
                              isCollapsed
                                ? "justify-center px-2 py-3"
                                : "px-3 py-2",
                              itemActive
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-primary/10 hover:text-foreground",
                            )}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            {!isCollapsed && (
                              <>
                                <span className="flex-1 text-left">
                                  {item.label}
                                </span>
                                {sectionOpen ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </>
                            )}
                          </CollapsibleTrigger>
                          <CollapsibleContent className="space-y-1 pl-4">
                            {item.subItems?.map((subItem) => {
                              const SubIcon = subItem.icon;
                              const subActive = isActive(
                                subItem.to,
                                subItem.exact,
                              );
                              return (
                                <Link
                                  key={subItem.to}
                                  href={subItem.to}
                                  className={cn(
                                    "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    subActive
                                      ? "bg-primary text-primary-foreground"
                                      : "text-muted-foreground hover:bg-primary/10 hover:text-foreground",
                                  )}
                                >
                                  <SubIcon className="h-4 w-4 shrink-0" />
                                  {!isCollapsed && subItem.label}
                                </Link>
                              );
                            })}
                          </CollapsibleContent>
                        </Collapsible>
                      );
                    }

                    return (
                      <Link
                        key={item.to}
                        href={item.to}
                        className={cn(
                          "w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-colors",
                          isCollapsed
                            ? "justify-center px-2 py-3"
                            : "px-3 py-2",
                          itemActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-primary/10 hover:text-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {!isCollapsed && item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          {/* Bottom Section - Utilities */}
          <div className={cn("border-t", isCollapsed ? "px-2 py-4" : "p-4")}>
            <nav className="space-y-1">
              <Link
                href="/admin/settings"
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-colors",
                  isCollapsed ? "justify-center px-2 py-3" : "px-3 py-2",
                  pathname === "/admin/settings"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-foreground",
                )}
              >
                <Settings className="h-4 w-4 shrink-0" />
                {!isCollapsed && "Settings"}
              </Link>

              {/* Collapse Toggle Button */}
              {!isMobile && (
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-colors",
                    isCollapsed ? "justify-center px-2 py-3" : "px-3 py-2",
                    "text-muted-foreground hover:bg-primary/10 hover:text-foreground",
                  )}
                >
                  {isCollapsed ? (
                    <SidebarClose className="h-4 w-4 shrink-0" />
                  ) : (
                    <>
                      <SidebarOpen className="h-4 w-4 shrink-0" />
                      <span className="flex-1 text-left">Collapse</span>
                    </>
                  )}
                </button>
              )}

              {/* Logout Button - Show when collapsed */}
              {isCollapsed && (
                <Link
                  href="/admin/login"
                  onClick={() => {
                    localStorage.removeItem("adminToken");
                    router.push("/admin/login");
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-colors",
                    "justify-center px-2 py-3",
                    "text-muted-foreground hover:bg-primary/10 hover:text-foreground",
                  )}
                >
                  <X className="h-4 w-4 shrink-0" />
                </Link>
              )}
            </nav>

            {/* Keep mounted when collapsed (hidden) so Radix DropdownMenu Presence is not torn down during collapse */}
            <div
              className={cn(
                "mt-4 flex items-center gap-3 rounded-lg border border-border bg-background p-3",
                isCollapsed && "hidden",
              )}
            >
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-foreground">
                  Admin
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  admin@example.com
                </p>
              </div>
              <DropdownMenu
                open={profileMenuOpen}
                onOpenChange={setProfileMenuOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
