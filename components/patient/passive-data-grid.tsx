import type { PassiveMetric, PassiveCategory } from "@/lib/types";
import { PassiveDataChart } from "./passive-data-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Moon, Footprints, Smartphone, MessageCircle,
  Keyboard, Phone, MapPin,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const CATEGORY_META: Record<PassiveCategory, { label: string; icon: LucideIcon }> = {
  sleep: { label: "Sleep", icon: Moon },
  activity: { label: "Activity", icon: Footprints },
  screen_time: { label: "Screen Time", icon: Smartphone },
  social: { label: "Social", icon: MessageCircle },
  typing: { label: "Typing", icon: Keyboard },
  voice: { label: "Voice", icon: Phone },
  mobility: { label: "Mobility", icon: MapPin },
};

interface PassiveDataGridProps {
  metrics: PassiveMetric[];
}

export function PassiveDataGrid({ metrics }: PassiveDataGridProps) {
  // Group metrics by category
  const grouped = metrics.reduce<Record<string, PassiveMetric[]>>((acc, m) => {
    (acc[m.category] = acc[m.category] || []).push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, categoryMetrics]) => {
        const meta = CATEGORY_META[category as PassiveCategory];
        const Icon = meta.icon;
        return (
          <Card key={category} className="border-border/50 bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Icon className="h-4 w-4 text-teal" />
                {meta.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {categoryMetrics.map((metric) => (
                  <PassiveDataChart key={metric.id} metric={metric} />
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
