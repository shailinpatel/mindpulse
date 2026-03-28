"use client";

import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TopBarProps {
  title: string;
  subtitle?: string;
  alertCount?: number;
}

export function TopBar({ title, subtitle, alertCount = 0 }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div>
        <h1 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            className="h-9 w-64 bg-secondary pl-9 text-sm"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4 text-muted-foreground" />
          {alertCount > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-risk-critical px-1 text-[10px] font-bold text-white">
              {alertCount}
            </Badge>
          )}
        </Button>
      </div>
    </header>
  );
}
