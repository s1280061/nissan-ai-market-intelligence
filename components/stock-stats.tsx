"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useFetch } from "@/lib/use-fetch";
import type { StockResponse } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatCompact, formatNumber, formatPct } from "@/lib/utils";

export function StockStats() {
  const { data, loading } = useFetch<StockResponse>("/api/stock?range=1M", 30000);
  const q = data?.quote;
  const up = (q?.change ?? 0) >= 0;

  const items = [
    { label: "Price", value: q ? `¥${formatNumber(q.price)}` : "—" },
    {
      label: "Change",
      value: q ? `${formatPct(q.changePercent)}` : "—",
      tone: up ? "up" : "down",
    },
    { label: "Volume", value: q ? formatCompact(q.volume) : "—" },
    { label: "Market Cap", value: q?.marketCap ? `¥${formatCompact(q.marketCap)}` : "—" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((it) => (
        <div key={it.label} className="glass p-4">
          <div className="stat-label">{it.label}</div>
          {loading ? (
            <Skeleton className="mt-2 h-6 w-20" />
          ) : (
            <div
              className={cn(
                "mt-1 flex items-center gap-1 text-lg font-semibold tabular-nums",
                it.tone === "up" && "text-up",
                it.tone === "down" && "text-down"
              )}
            >
              {it.tone === "up" && <ArrowUpRight className="h-4 w-4" />}
              {it.tone === "down" && <ArrowDownRight className="h-4 w-4" />}
              {it.value}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
