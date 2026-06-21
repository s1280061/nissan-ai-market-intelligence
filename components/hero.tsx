"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, ArrowRight, CircleDot } from "lucide-react";
import { useFetch } from "@/lib/use-fetch";
import type { StockResponse } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PredictionCard } from "@/components/prediction-card";
import { cn, formatNumber, formatPct } from "@/lib/utils";

export function Hero() {
  const { data, loading } = useFetch<StockResponse>("/api/stock?range=1M", 30000);
  const q = data?.quote;
  const up = (q?.change ?? 0) >= 0;
  const open = q?.marketState === "REGULAR";

  return (
    <section className="relative overflow-hidden">
      <div className="grid-overlay pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:py-16">
        <div className="animate-fade-up">
          <Badge variant="accent" className="mb-5">
            <CircleDot className="h-3 w-3" />
            AI-Powered Stock Prediction Platform
          </Badge>

          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Nissan AI
            <br />
            <span className="bg-gradient-to-r from-accent via-up to-accent bg-clip-text text-transparent">
              Market Intelligence
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/50 sm:text-base">
            日産自動車(7201.T)のAI予測・説明可能性(SHAP)・世界情勢ニュース・マクロ指標を
            ひとつに統合した、個人投資家／研究者／AIエンジニアのためのダッシュボード。
          </p>

          <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-4">
            <div>
              <div className="stat-label mb-1">Nissan 7201.T</div>
              {loading ? (
                <Skeleton className="h-10 w-40" />
              ) : (
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold tabular-nums">
                    ¥{formatNumber(q?.price ?? 0)}
                  </span>
                  <span
                    className={cn(
                      "flex items-center gap-0.5 text-sm font-semibold tabular-nums",
                      up ? "text-up" : "text-down"
                    )}
                  >
                    {up ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    {formatPct(q?.changePercent ?? 0)}
                  </span>
                </div>
              )}
            </div>
            <div>
              <div className="stat-label mb-1">Market Status</div>
              <Badge variant={open ? "up" : "neutral"}>
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    open ? "animate-pulse-glow bg-up" : "bg-white/40"
                  )}
                />
                {open ? "Open" : q?.marketState ?? "Closed"}
              </Badge>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
            >
              Open Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/research"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:border-white/25"
            >
              Research & Backtest
            </Link>
          </div>
        </div>

        <div className="animate-fade-up [animation-delay:120ms]">
          <PredictionCard />
        </div>
      </div>
    </section>
  );
}
