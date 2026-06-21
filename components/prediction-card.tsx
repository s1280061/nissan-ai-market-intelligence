"use client";

import { Sparkles } from "lucide-react";
import { useFetch } from "@/lib/use-fetch";
import type { Prediction } from "@/lib/types";
import { fiveLevel, LEVEL_ORDER, LEVEL_META } from "@/lib/signal";
import { SignalCharacter } from "@/components/signal-character";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function PredictionCard({ compact = false }: { compact?: boolean }) {
  const { data, loading } = useFetch<Prediction>("/api/prediction", 60000);

  if (loading || !data) {
    return (
      <div className="glass flex flex-col items-center gap-4 p-6">
        <Skeleton className="h-[150px] w-[150px] rounded-full" />
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
    );
  }

  const pct = Math.round(data.probability * 100);
  const info = fiveLevel(data.probability);

  return (
    <div
      className="glass relative flex flex-col items-center overflow-hidden p-6 text-center"
      style={{ boxShadow: `0 0 0 1px ${info.color}22, 0 30px 80px -40px ${info.glow}` }}
    >
      {/* 上部グロー */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-24 h-48"
        style={{ background: `radial-gradient(50% 100% at 50% 100%, ${info.glow}, transparent 70%)` }}
      />

      <div className="relative z-10 mb-1 flex items-center gap-1.5 text-xs text-white/55">
        <Sparkles className="h-3.5 w-3.5" style={{ color: info.color }} />
        5営業日以内に +5% 上昇する確率
      </div>

      {/* キャラクター */}
      <div className="relative z-10 my-2">
        <SignalCharacter mood={info.mood} color={info.color} size={compact ? 124 : 150} />
      </div>

      {/* 5段階ラベル */}
      <div
        className="relative z-10 text-3xl font-black tracking-tight"
        style={{ color: info.color, textShadow: `0 0 24px ${info.glow}` }}
      >
        {info.jp}
      </div>
      <div className="relative z-10 mt-0.5 text-xs uppercase tracking-[0.2em] text-white/40">
        {info.en} · {pct}%
      </div>

      {/* 5段階メーター */}
      <FiveLevelMeter activeLevel={info.level} />

      <div className="relative z-10 mt-3 flex items-center gap-2">
        <Badge variant="neutral">{data.confidence} Confidence</Badge>
        <Badge variant="neutral">Horizon {data.horizonDays}d</Badge>
      </div>

      {!compact && (
        <p className="relative z-10 mt-3 max-w-xs text-xs leading-relaxed text-white/45">
          {info.blurb}
        </p>
      )}
    </div>
  );
}

function FiveLevelMeter({ activeLevel }: { activeLevel: string }) {
  return (
    <div className="relative z-10 mt-4 w-full max-w-xs">
      <div className="flex gap-1">
        {LEVEL_ORDER.map((lv) => {
          const meta = LEVEL_META[lv];
          const active = lv === activeLevel;
          return (
            <div key={lv} className="flex-1">
              <div
                className="h-1.5 rounded-full transition-all"
                style={{
                  background: active ? meta.color : "rgba(255,255,255,0.08)",
                  boxShadow: active ? `0 0 12px ${meta.color}` : "none",
                }}
              />
              <div
                className="mt-1.5 text-center text-[9px] leading-tight transition-colors"
                style={{ color: active ? meta.color : "rgba(255,255,255,0.3)", fontWeight: active ? 700 : 400 }}
              >
                {meta.jp}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
