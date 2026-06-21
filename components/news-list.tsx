"use client";

import { useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { useFetch } from "@/lib/use-fetch";
import type { NewsItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatDate } from "@/lib/utils";

const CATEGORIES = ["All", "Economy", "AI", "Automotive", "EV", "Geopolitics"];

export function NewsList() {
  const [category, setCategory] = useState("All");
  const [q, setQ] = useState("");
  const query = category === "All" ? "" : `category=${category}`;
  const { data, loading } = useFetch<{ items: NewsItem[]; live: boolean }>(
    `/api/news${query ? `?${query}` : ""}`
  );

  const items = (data?.items ?? []).filter(
    (n) =>
      !q ||
      n.title.toLowerCase().includes(q.toLowerCase()) ||
      n.summary.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                category === c
                  ? "bg-white/[0.1] text-white"
                  : "bg-white/[0.03] text-white/50 hover:text-white"
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/35" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search news..."
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:border-accent/40 focus:outline-none sm:w-56"
          />
        </div>
      </div>

      {data && !data.live && (
        <p className="text-[11px] text-white/30">
          ※ NEWS_API_KEY 未設定のためサンプルニュースを表示中
        </p>
      )}

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="py-12 text-center text-sm text-white/40">該当するニュースがありません</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((n) => (
            <a
              key={n.id}
              href={n.url}
              target="_blank"
              rel="noreferrer"
              className="glass glass-hover group flex flex-col p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <Badge variant="accent">{n.category}</Badge>
                <ExternalLink className="h-3.5 w-3.5 text-white/30 transition-colors group-hover:text-accent" />
              </div>
              <h4 className="text-sm font-semibold leading-snug text-white/90">{n.title}</h4>
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/45">
                {n.summary}
              </p>
              <div className="mt-auto flex items-center justify-between pt-3 text-[11px] text-white/35">
                <span>{n.source}</span>
                <span>{formatDate(n.publishedAt)}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
