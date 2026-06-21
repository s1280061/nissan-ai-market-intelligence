"use client";

import { Sparkles } from "lucide-react";
import { useFetch } from "@/lib/use-fetch";
import type { Prediction, Signal } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const signalStyle: Record<Signal, { ring: string; text: string; variant: "up" | "gold" | "neutral" | "down" }> = {
  "Strong Buy": { ring: "from-up to-accent", text: "text-up", variant: "up" },
  Buy: { ring: "from-up/70 to-accent/60", text: "text-up", variant: "up" },
  Neutral: { ring: "from-gold/70 to-white/20", text: "text-gold", variant: "gold" },
  Avoid: { ring: "from-down to-down/40", text: "text-down", variant: "down" },
};

export function PredictionCard({ compact = false }: { compact?: boolean }) {
  const { data, loading } = useFetch<Prediction>("/api/prediction", 60000);

  if (loading || !data) {
    return (
      <div className="glass flex flex-col items-center gap-3 p-6">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-6 w-28" />
      </div>
    );
  }

  const pct = Math.round(data.probability * 100);
  const style = signalStyle[data.signal];
  const circumference = 2 * Math.PI * 52;
  const offset = circumference * (1 - data.probability);

  return (
    <div className="glass flex flex-col items-center p-6 text-center">
      <div className="mb-1 flex items-center gap-1.5 text-xs text-white/50">
        <Sparkles className="h-3.5 w-3.5 text-accent" />
        5営業日以内に +5% 上昇する確率
      </div>

      <div className="relative my-4 h-36 w-36">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="url(#grad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)" }}
          />
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#16e0a8" />
              <stop offset="100%" stopColor="#38e8ff" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold tabular-nums">{pct}%</span>
          <span className="text-[10px] uppercase tracking-widest text-white/40">probability</span>
        </div>
      </div>

      <div className={cn("text-xl font-bold", style.text)}>{data.signal}</div>
      <div className="mt-2 flex items-center gap-2">
        <Badge variant={style.variant}>{data.confidence} Confidence</Badge>
        {!compact && <Badge variant="neutral">Horizon {data.horizonDays}d</Badge>}
      </div>

      {!compact && (
        <p className="mt-4 text-xs leading-relaxed text-white/40">
          判定: 0.80↑ Strong Buy / 0.65↑ Buy / 0.45↑ Neutral / それ未満 Avoid
        </p>
      )}
    </div>
  );
}
