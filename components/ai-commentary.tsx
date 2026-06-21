"use client";

import { Bot, RefreshCw } from "lucide-react";
import { useFetch } from "@/lib/use-fetch";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface ExplainResp {
  commentary: string;
  source: "groq" | "fallback";
  model: string | null;
  signal: string;
}

export function AICommentary() {
  const { data, loading, reload } = useFetch<ExplainResp>("/api/explain");
  const paragraphs = (data?.commentary ?? "").split(/\n{2,}/).filter(Boolean);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="inline-flex items-center gap-1.5">
            <Bot className="h-4 w-4 text-accent" />
            AI解説 — 今日のシグナルの読み方
          </span>
        </CardTitle>
        <div className="flex items-center gap-2">
          {data && (
            <Badge variant={data.source === "groq" ? "accent" : "neutral"}>
              {data.source === "groq" ? `Groq · ${data.model}` : "ルールベース"}
            </Badge>
          )}
          <button
            onClick={reload}
            disabled={loading}
            className="rounded-lg p-1.5 text-white/40 transition-colors hover:text-white disabled:opacity-40"
            aria-label="再生成"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </CardHeader>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[92%]" />
          <Skeleton className="h-4 w-[78%]" />
          <Skeleton className="mt-3 h-4 w-[88%]" />
        </div>
      ) : (
        <div className="space-y-3">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-white/70">
              {p}
            </p>
          ))}
          {data?.source === "fallback" && (
            <p className="pt-1 text-[11px] text-white/30">
              ※ GROQ_API_KEY 未設定のためルールベース解説です。キーを設定すると生成AIが文章化します。
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
