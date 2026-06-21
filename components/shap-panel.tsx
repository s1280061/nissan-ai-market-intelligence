"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { useFetch } from "@/lib/use-fetch";
import type { Prediction } from "@/lib/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ShapPanel() {
  const { data, loading } = useFetch<Prediction>("/api/prediction", 60000);
  const shap = data?.shap ?? [];
  const max = Math.max(...shap.map((s) => Math.abs(s.value)), 0.001);

  const positives = shap.filter((s) => s.direction === "positive");
  const negatives = shap.filter((s) => s.direction === "negative");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Explainable AI · SHAP Top 5</CardTitle>
        <span className="text-[11px] text-white/35">feature contribution</span>
      </CardHeader>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          <Group title="プラス要因" icon={<TrendingUp className="h-3.5 w-3.5 text-up" />}>
            {positives.map((s) => (
              <Bar key={s.feature} label={s.label} value={s.value} max={max} positive />
            ))}
          </Group>
          <Group title="マイナス要因" icon={<TrendingDown className="h-3.5 w-3.5 text-down" />}>
            {negatives.length ? (
              negatives.map((s) => (
                <Bar key={s.feature} label={s.label} value={s.value} max={max} positive={false} />
              ))
            ) : (
              <p className="text-xs text-white/30">該当なし</p>
            )}
          </Group>
        </div>
      )}
    </Card>
  );
}

function Group({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-white/55">
        {icon}
        {title}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Bar({
  label,
  value,
  max,
  positive,
}: {
  label: string;
  value: number;
  max: number;
  positive: boolean;
}) {
  const width = `${(Math.abs(value) / max) * 100}%`;
  return (
    <div className="flex items-center gap-3">
      <div className="w-32 shrink-0 truncate text-xs text-white/70">{label}</div>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className={cn("h-full rounded-full", positive ? "bg-up" : "bg-down")}
          style={{ width }}
        />
      </div>
      <div
        className={cn(
          "w-12 shrink-0 text-right text-xs tabular-nums",
          positive ? "text-up" : "text-down"
        )}
      >
        {value > 0 ? "+" : ""}
        {value.toFixed(3)}
      </div>
    </div>
  );
}
