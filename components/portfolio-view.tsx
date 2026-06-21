"use client";

import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { useFetch } from "@/lib/use-fetch";
import type { StockResponse } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatCompact, formatNumber, formatPct } from "@/lib/utils";

// 仮想ポートフォリオ(デモ用の保有)
const HOLDINGS = [
  { symbol: "7201.T", name: "Nissan Motor", shares: 500, avgCost: 410 },
];

export function PortfolioView() {
  const { data, loading } = useFetch<StockResponse>("/api/stock?range=1M", 30000);
  const price = data?.quote.price ?? 0;

  const rows = HOLDINGS.map((h) => {
    const value = price * h.shares;
    const cost = h.avgCost * h.shares;
    const pnl = value - cost;
    const pnlPct = cost ? (pnl / cost) * 100 : 0;
    return { ...h, price, value, cost, pnl, pnlPct };
  });

  const totalValue = rows.reduce((s, r) => s + r.value, 0);
  const totalCost = rows.reduce((s, r) => s + r.cost, 0);
  const totalPnl = totalValue - totalCost;
  const totalPnlPct = totalCost ? (totalPnl / totalCost) * 100 : 0;
  const up = totalPnl >= 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <div className="flex items-center gap-1.5 text-white/40">
            <Wallet className="h-3.5 w-3.5" />
            <span className="stat-label">Total Value</span>
          </div>
          {loading ? (
            <Skeleton className="mt-2 h-8 w-32" />
          ) : (
            <div className="mt-1 text-2xl font-bold tabular-nums">
              ¥{formatCompact(totalValue)}
            </div>
          )}
        </Card>
        <Card>
          <span className="stat-label">Unrealized P&L</span>
          {loading ? (
            <Skeleton className="mt-2 h-8 w-32" />
          ) : (
            <div
              className={cn(
                "mt-1 flex items-center gap-1 text-2xl font-bold tabular-nums",
                up ? "text-up" : "text-down"
              )}
            >
              {up ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
              ¥{formatCompact(Math.abs(totalPnl))}
            </div>
          )}
        </Card>
        <Card>
          <span className="stat-label">Cumulative Return</span>
          {loading ? (
            <Skeleton className="mt-2 h-8 w-24" />
          ) : (
            <div className={cn("mt-1 text-2xl font-bold tabular-nums", up ? "text-up" : "text-down")}>
              {formatPct(totalPnlPct)}
            </div>
          )}
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-left text-xs text-white/40">
              <th className="px-5 py-3 font-medium">Symbol</th>
              <th className="px-5 py-3 text-right font-medium">Shares</th>
              <th className="px-5 py-3 text-right font-medium">Avg Cost</th>
              <th className="px-5 py-3 text-right font-medium">Price</th>
              <th className="px-5 py-3 text-right font-medium">Value</th>
              <th className="px-5 py-3 text-right font-medium">P&L</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const rUp = r.pnl >= 0;
              return (
                <tr key={r.symbol} className="border-b border-white/[0.04] last:border-0">
                  <td className="px-5 py-4">
                    <div className="font-semibold">{r.symbol}</div>
                    <div className="text-xs text-white/40">{r.name}</div>
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums">{r.shares}</td>
                  <td className="px-5 py-4 text-right tabular-nums">¥{formatNumber(r.avgCost)}</td>
                  <td className="px-5 py-4 text-right tabular-nums">
                    {loading ? "—" : `¥${formatNumber(r.price)}`}
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums">¥{formatCompact(r.value)}</td>
                  <td
                    className={cn(
                      "px-5 py-4 text-right tabular-nums font-medium",
                      rUp ? "text-up" : "text-down"
                    )}
                  >
                    {formatPct(r.pnlPct)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      <p className="text-[11px] text-white/30">
        ※ デモ用の仮想ポートフォリオです。実際の保有・約定とは無関係です。
      </p>
    </div>
  );
}
