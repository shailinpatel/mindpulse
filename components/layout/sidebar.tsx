"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  BarChart3,
  Settings,
  Activity,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Patients", href: "/", icon: Users },
  { label: "Assessments", href: "#", icon: ClipboardList, comingSoon: true },
  { label: "Analytics", href: "#", icon: BarChart3, comingSoon: true },
  { label: "Settings", href: "#", icon: Settings, comingSoon: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-[15px] font-semibold tracking-tight text-foreground">
              MindPulse
            </span>
            <span className="ml-1.5 inline-flex items-center rounded-full bg-teal-muted px-1.5 py-0.5 text-[10px] font-medium text-teal">
              BETA
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
          Main
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = !item.comingSoon && (
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          );

          return (
            <Link
              key={item.label}
              href={item.comingSoon ? "#" : item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : item.comingSoon
                    ? "cursor-default text-muted-foreground/40"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
              onClick={(e) => {
                if (item.comingSoon) {
                  e.preventDefault();
                }
              }}
            >
              <item.icon className={cn(
                "h-4 w-4",
                isActive ? "text-teal" : item.comingSoon ? "text-muted-foreground/30" : ""
              )} />
              <span className="flex-1">{item.label}</span>
              {item.comingSoon && (
                <Lock className="h-3 w-3 text-muted-foreground/30" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
            SM
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              Dr. Sarah Mitchell
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Psychiatrist
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
