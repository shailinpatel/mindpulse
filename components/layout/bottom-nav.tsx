"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Assessments", href: "#", icon: ClipboardList, comingSoon: true },
  { label: "Settings", href: "#", icon: Settings, comingSoon: true },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-sidebar-border bg-sidebar pb-[env(safe-area-inset-bottom)] lg:hidden">
      {NAV_ITEMS.map((item) => {
        const isActive = !item.comingSoon && (
          item.href === "/" ? pathname === "/" || pathname.startsWith("/patients") : pathname.startsWith(item.href)
        );

        return (
          <Link
            key={item.label}
            href={item.comingSoon ? "#" : item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2 pt-2.5 text-[10px] font-medium transition-colors",
              isActive
                ? "text-teal"
                : item.comingSoon
                  ? "text-muted-foreground/30"
                  : "text-muted-foreground"
            )}
            onClick={(e) => {
              if (item.comingSoon) e.preventDefault();
            }}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
