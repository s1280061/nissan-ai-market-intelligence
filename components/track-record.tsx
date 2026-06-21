"use client";

import { Check, X, Clock } from "lucide-react";
import { useFetch } from "@/lib/use-fetch";
import type { HistoryResp } from "@/lib/types";
import { fiveLevel } from "@/lib/signal";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatNumber, formatPct } from "@/lib/utils";

export function TrackRecord() {
  const { data, loading } = useFetch<HistoryResp & { source?: string }>("/api/history?days=90");
  const s = data?.summary;
  const rows = data?.history ?? [];

  const pctOrDash = (v: number | null | undefined) =>
    v === null || v === undefined ? "—" : `${(v * 100).toFixed(1)}%`;

  const accBeatsBase =
    s?.accuracy != null && s?.baseRate != null && s.accuracy > 1 - s.baseRate;

  return (
    <div className="space-y-6">
      {/* サマリー */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="的中率 (out-of-sample)" value={loading ? null : pctOrDash(s?.accuracy)} />
        <Stat
          label="買いシグナルの的中率"
          value={loading ? null : pctOrDash(s?.buyHitRate)}
          sub={s ? `${s.buySignals} 回` : ""}
        />
        <Stat label="評価日数" value={loading ? null : `${s?.evaluated ?? 0} 日`} />
        <Stat
          label="基準(常に下と予測)"
          value={loading ? null : pctOrDash(s?.baseRate != null ? 1 - s.baseRate : null)}
        />
      </div>

      <Card>
        <p className="text-xs leading-relaxed text-white/55">
          <b className="text-white/80">正直な評価方法:</b>{" "}
          各日について「その日より前のデータだけで学習し直したモデル」で予測し、5営業日後に実際 +5%
          到達したかを突き合わせた out-of-sample の実績です（本番モデルそのままだと直近は学習済み＝
          的中率が水増しされるため）。
          {s?.accuracy != null && s?.baseRate != null && (
            <>
              {" "}
              直近90日は{accBeatsBase ? "基準を上回っています" : "下落トレンドで+5%上昇が稀だったため、" +
                "「常に下」と言う基準（" + pctOrDash(1 - s.baseRate) + "）の方が高くなっています"}
              。
            </>
          )}
        </p>
      </Card>

      {/* 履歴テーブル */}
      <Card className="overflow-hidden p-0">
        <div className="max-h-[520px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-bg-soft/95 backdrop-blur">
              <tr className="border-b border-white/[0.06] text-left text-xs text-white/40">
                <th className="px-4 py-3 font-medium">日付</th>
                <th className="px-4 py-3 text-right font-medium">終値</th>
                <th className="px-4 py-3 text-right font-medium">上昇確率</th>
                <th className="px-4 py-3 font-medium">シグナル</th>
                <th className="px-4 py-3 text-right font-medium">5日後</th>
                <th className="px-4 py-3 text-center font-medium">結果</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/[0.04]">
                      <td className="px-4 py-3" colSpan={6}>
                        <Skeleton className="h-4 w-full" />
                      </td>
                    </tr>
                  ))
                : rows.map((r) => {
                    const info = fiveLevel(r.probability);
                    return (
                      <tr key={r.date} className="border-b border-white/[0.04] last:border-0">
                        <td className="px-4 py-2.5 text-white/70">{r.date}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums">¥{formatNumber(r.price)}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums">
                          {Math.round(r.probability * 100)}%
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-medium"
                            style={{ color: info.color }}
                          >
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ background: info.color }}
                            />
                            {info.jp}
                          </span>
                        </td>
                        <td
                          className={cn(
                            "px-4 py-2.5 text-right tabular-nums",
                            r.futureRet5d == null
                              ? "text-white/30"
                              : r.futureRet5d >= 0
                                ? "text-up"
                                : "text-down"
                          )}
                        >
                          {r.futureRet5d == null ? "—" : formatPct(r.futureRet5d * 100)}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          {r.correct == null ? (
                            <Clock className="mx-auto h-4 w-4 text-white/30" />
                          ) : r.correct ? (
                            <Check className="mx-auto h-4 w-4 text-up" />
                          ) : (
                            <X className="mx-auto h-4 w-4 text-down" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </Card>
      <p className="text-[11px] text-white/30">
        ○=的中 / ×=外れ / <Clock className="inline h-3 w-3" />=判定待ち（5営業日後に確定）。
        研究目的の記録であり、投資助言ではありません。
      </p>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string | null; sub?: string }) {
  return (
    <div className="glass p-4">
      <div className="stat-label">{label}</div>
      {value === null ? (
        <Skeleton className="mt-2 h-7 w-16" />
      ) : (
        <div className="mt-1 text-2xl font-bold tabular-nums text-white">
          {value}
          {sub && <span className="ml-1 text-xs font-normal text-white/40">{sub}</span>}
        </div>
      )}
    </div>
  );
}
