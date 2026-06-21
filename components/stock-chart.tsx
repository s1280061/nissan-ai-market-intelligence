"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useFetch } from "@/lib/use-fetch";
import type { StockResponse } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatNumber } from "@/lib/utils";

const RANGES = ["1D", "1W", "1M", "3M", "1Y", "5Y"] as const;

export function StockChart() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("1M");
  const { data, loading, error } = useFetch<StockResponse>(`/api/stock?range=${range}`);

  const candles = data?.candles ?? [];
  const up =
    candles.length > 1 ? candles[candles.length - 1].close >= candles[0].close : true;
  const color = up ? "#16e0a8" : "#ff4d5e";

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white/80">Price Chart</span>
          <span className="text-xs text-white/40">{data?.quote.symbol}</span>
        </div>
        <div className="flex gap-1 rounded-lg bg-white/[0.04] p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                range === r ? "bg-white/[0.1] text-white" : "text-white/45 hover:text-white"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-[300px] w-full" />
      ) : error ? (
        <div className="grid h-[300px] place-items-center text-sm text-down">
          チャートを取得できませんでした
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={candles} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              minTickGap={40}
              tickFormatter={(v) =>
                new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(v) => formatNumber(v, 0)}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(10,14,20,0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                fontSize: 12,
              }}
              labelStyle={{ color: "rgba(255,255,255,0.6)" }}
              labelFormatter={(v) => new Date(v as string).toLocaleString("ja-JP")}
              formatter={(v: number) => [`¥${formatNumber(v)}`, "Close"]}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke={color}
              strokeWidth={2}
              fill="url(#g)"
              animationDuration={600}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
