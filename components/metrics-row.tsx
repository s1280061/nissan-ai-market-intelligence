"use client";

import { Gauge, TrendingUp, Target, CalendarRange } from "lucide-react";
import { useFetch } from "@/lib/use-fetch";
import type { Prediction } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export function MetricsRow() {
  const { data, loading } = useFetch<Prediction>("/api/prediction", 0);
  const m = data?.metrics;

  const tiles = [
    { label: "ROC-AUC", value: m ? m.rocAuc.toFixed(3) : "—", icon: Gauge },
    { label: "Sharpe Ratio", value: m ? m.sharpe.toFixed(2) : "—", icon: TrendingUp },
    { label: "Win Rate", value: m ? `${(m.winRate * 100).toFixed(1)}%` : "—", icon: Target },
    {
      label: "Backtest Period",
      value: m ? `${m.backtestYears} Yrs` : "—",
      icon: CalendarRange,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map((t) => (
        <div key={t.label} className="glass p-4">
          <div className="flex items-center gap-1.5 text-white/40">
            <t.icon className="h-3.5 w-3.5" />
            <span className="stat-label">{t.label}</span>
          </div>
          {loading ? (
            <Skeleton className="mt-2 h-7 w-20" />
          ) : (
            <div className="mt-1 text-2xl font-bold tabular-nums text-white">{t.value}</div>
          )}
        </div>
      ))}
    </div>
  );
}
