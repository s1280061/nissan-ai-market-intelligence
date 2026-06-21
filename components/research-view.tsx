"use client";

import { useFetch } from "@/lib/use-fetch";
import type { Prediction } from "@/lib/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const FEATURES = [
  "ret_1d / 3d / 5d / 10d / 20d",
  "ma5_diff / ma20_diff / ma60_diff",
  "volatility_5d / 20d / 60d",
  "atr_14 / atr_20 / atr_ratio_14 / atr_ratio_20",
  "bb_width / bb_position",
  "volume_ratio_5d / 20d / volume_spike_2x / 3x",
  "rsi_14 / macd / macd_signal / macd_hist",
  "high_low_range / body_size / upper_shadow / lower_shadow",
  "days_since_20d/60d_high / low",
];

export function ResearchView() {
  const { data, loading } = useFetch<Prediction>("/api/prediction", 0);
  const m = data?.metrics;

  const backtest = [
    { label: "ROC-AUC", value: m ? m.rocAuc.toFixed(3) : "—", tone: "" },
    { label: "Sharpe Ratio", value: m ? m.sharpe.toFixed(2) : "—", tone: "up" },
    { label: "CAGR", value: m ? `${(m.cagr * 100).toFixed(1)}%` : "—", tone: "up" },
    {
      label: "Max Drawdown",
      value: m ? `${(m.maxDrawdown * 100).toFixed(1)}%` : "—",
      tone: "down",
    },
    { label: "Win Rate", value: m ? `${(m.winRate * 100).toFixed(1)}%` : "—", tone: "" },
    { label: "Backtest", value: m ? `${m.backtestYears} years` : "—", tone: "" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Model Information</CardTitle>
          </CardHeader>
          <dl className="space-y-3 text-sm">
            <Row k="Model" v="LightGBM (gradient boosting)" />
            <Row k="Task" v="二値分類 · 5営業日後 +5% 上昇" />
            <Row k="Imbalance" v="class_weight = balanced" />
            <Row k="Validation" v="TimeSeriesSplit 5-fold · Walk-Forward" />
            <Row k="Training Period" v="2010-04 〜 2026-06 (≈13.2年)" />
            <Row k="Universe" v="Nissan Motor (7201.T)" />
            <Row k="Data Source" v="Yahoo Finance (OHLCV + 外部指標)" />
          </dl>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Backtest Results</CardTitle>
            <span className="text-[11px] text-white/35">out-of-sample, threshold 0.55</span>
          </CardHeader>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {backtest.map((b) => (
              <div key={b.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="stat-label">{b.label}</div>
                {loading ? (
                  <Skeleton className="mt-2 h-7 w-16" />
                ) : (
                  <div
                    className={cn(
                      "mt-1 text-xl font-bold tabular-nums",
                      b.tone === "up" && "text-up",
                      b.tone === "down" && "text-down"
                    )}
                  >
                    {b.value}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feature Set (38 features)</CardTitle>
          <span className="text-[11px] text-white/35">technical 33 + external 5</span>
        </CardHeader>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f}
              className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2 font-mono text-xs text-white/60"
            >
              {f}
            </div>
          ))}
          <div className="rounded-lg border border-accent/20 bg-accent/[0.05] px-3 py-2 font-mono text-xs text-accent">
            external: sp500 / nikkei / usdjpy / vix
          </div>
        </div>
      </Card>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.04] pb-2 last:border-0">
      <dt className="text-white/40">{k}</dt>
      <dd className="text-right font-medium text-white/80">{v}</dd>
    </div>
  );
}
