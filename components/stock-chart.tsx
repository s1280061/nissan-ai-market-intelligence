"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Sparkles } from "lucide-react";
import { useFetch } from "@/lib/use-fetch";
import type { HistoryResp, Prediction, Signal, StockResponse } from "@/lib/types";
import { fiveLevel } from "@/lib/signal";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatNumber } from "@/lib/utils";

const RANGES = ["1D", "1W", "1M", "3M", "1Y", "5Y"] as const;

const SIGNAL_COLOR: Record<Signal, string> = {
  "Strong Buy": "#16e0a8",
  Buy: "#16e0a8",
  Neutral: "#e6b450",
  Avoid: "#ff4d5e",
};

export function StockChart() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("1M");
  const { data, loading, error } = useFetch<StockResponse>(`/api/stock?range=${range}`);
  const { data: pred } = useFetch<Prediction>("/api/prediction", 60000);
  const { data: hist } = useFetch<HistoryResp>("/api/history?days=90");

  // 日付 -> その日のAIシグナル色（過去の買い/キープ/売りをチャートに点で重ねる）
  const signalByDate: Record<string, string> = {};
  (hist?.history ?? []).forEach((h) => {
    signalByDate[h.date] = fiveLevel(h.probability).color;
  });
  const showDots = ["1M", "3M", "1Y"].includes(range);

  const candles = data?.candles ?? [];
  const trendUp =
    candles.length > 1 ? candles[candles.length - 1].close >= candles[0].close : true;
  const color = trendUp ? "#16e0a8" : "#ff4d5e";

  // --- AI予測シグナルのオーバーレイ ---
  const last = candles[candles.length - 1];
  const targetReturn = pred?.targetReturn ?? 0.05;
  const targetPrice = last ? last.close * (1 + targetReturn) : 0;
  const signalColor = pred ? SIGNAL_COLOR[pred.signal] : "#e6b450";
  const closes = candles.map((c) => c.close);
  const dataMin = closes.length ? Math.min(...closes) : 0;
  const dataMax = closes.length ? Math.max(...closes) : 0;
  const yDomain: [number, number] = [
    dataMin * 0.99,
    Math.max(dataMax, targetPrice) * 1.01,
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white/80">Price Chart</span>
          <span className="text-xs text-white/40">{data?.quote.symbol}</span>
          {pred && (
            <span
              className="ml-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium"
              style={{
                color: signalColor,
                borderColor: `${signalColor}40`,
                background: `${signalColor}14`,
              }}
            >
              <Sparkles className="h-3 w-3" />
              AI {pred.signal} · {Math.round(pred.probability * 100)}%
            </span>
          )}
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
          <AreaChart data={candles} margin={{ top: 10, right: 56, left: 8, bottom: 0 }}>
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
              domain={yDomain}
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
              dot={
                showDots
                  ? (p: { cx?: number; cy?: number; index?: number; payload?: { date?: string } }) => {
                      const d = (p.payload?.date ?? "").slice(0, 10);
                      const c = signalByDate[d];
                      if (!c || p.cx == null || p.cy == null)
                        return <circle key={p.index} r={0} fill="none" />;
                      return (
                        <circle
                          key={p.index}
                          cx={p.cx}
                          cy={p.cy}
                          r={3}
                          fill={c}
                          stroke="#05070a"
                          strokeWidth={1}
                        />
                      );
                    }
                  : false
              }
            />

            {/* AI予測: +5%ターゲットライン */}
            {pred && last && (
              <ReferenceLine
                y={targetPrice}
                stroke={signalColor}
                strokeDasharray="5 4"
                strokeOpacity={0.7}
                label={{
                  value: `+${Math.round(targetReturn * 100)}% target ¥${formatNumber(targetPrice, 0)}`,
                  position: "insideTopRight",
                  fill: signalColor,
                  fontSize: 10,
                }}
              />
            )}
            {/* AI予測: 直近価格のシグナルマーカー */}
            {pred && last && (
              <ReferenceDot
                x={last.date}
                y={last.close}
                r={5}
                fill={signalColor}
                stroke="#05070a"
                strokeWidth={2}
                isFront
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      )}

      {pred && (
        <p className="mt-3 text-[11px] text-white/35">
          点線は現在値から <span style={{ color: signalColor }}>+{Math.round(targetReturn * 100)}%</span> の目標水準。
          マーカー色はAIシグナル（{pred.signal}・確率 {Math.round(pred.probability * 100)}%・5営業日以内）。
        </p>
      )}
      {showDots && (hist?.history?.length ?? 0) > 0 && (
        <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-white/40">
          <span>各日の点 = その日のAIシグナル:</span>
          <Legend color="#16e0a8" label="買い系" />
          <Legend color="#e6b450" label="キープ" />
          <Legend color="#ff4d5e" label="売り系" />
        </div>
      )}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
