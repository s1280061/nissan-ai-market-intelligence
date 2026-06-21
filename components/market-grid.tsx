"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { useFetch } from "@/lib/use-fetch";
import type { IndexQuote } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatNumber, formatPct } from "@/lib/utils";

export function MarketGrid() {
  const { data, loading } = useFetch<{ indices: IndexQuote[] }>("/api/market", 60000);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {(data?.indices ?? []).map((idx) => {
        const up = idx.changePercent >= 0;
        const color = up ? "#16e0a8" : "#ff4d5e";
        const spark = idx.spark.map((v, i) => ({ i, v }));
        return (
          <div key={idx.symbol} className="glass glass-hover p-4">
            <div className="text-xs font-medium text-white/55">{idx.name}</div>
            <div className="mt-1 text-lg font-semibold tabular-nums">
              {formatNumber(idx.price)}
            </div>
            <div className={cn("text-xs tabular-nums", up ? "text-up" : "text-down")}>
              {formatPct(idx.changePercent)}
            </div>
            <div className="mt-2 h-10">
              {spark.length > 1 && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={spark}>
                    <defs>
                      <linearGradient id={`s-${idx.symbol}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke={color}
                      strokeWidth={1.5}
                      fill={`url(#s-${idx.symbol})`}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
