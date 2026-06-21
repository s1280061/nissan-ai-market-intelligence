import { NextResponse } from "next/server";
import { MOCK_NEWS } from "@/lib/mock-news";
import type { NewsItem } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CATEGORY_QUERIES: Record<string, string> = {
  Economy: "economy OR inflation OR central bank",
  AI: "artificial intelligence OR generative AI",
  Automotive: "automotive OR car manufacturer OR Nissan",
  EV: "electric vehicle OR EV battery",
  Geopolitics: "geopolitics OR trade war OR sanctions",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "";
  const q = (searchParams.get("q") || "").toLowerCase();
  const key = process.env.NEWS_API_KEY;

  let items: NewsItem[] = [];

  if (key) {
    try {
      const query = CATEGORY_QUERIES[category] || q || "Nissan OR automotive OR markets";
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        query
      )}&language=en&sortBy=publishedAt&pageSize=24&apiKey=${key}`;
      const r = await fetch(url, { cache: "no-store" });
      if (r.ok) {
        const data = await r.json();
        items = (data.articles || []).map((a: Record<string, unknown>, i: number) => ({
          id: `live-${i}`,
          title: (a.title as string) || "Untitled",
          summary: (a.description as string) || "",
          source: ((a.source as Record<string, unknown>)?.name as string) || "NewsAPI",
          url: (a.url as string) || "#",
          publishedAt: (a.publishedAt as string) || new Date().toISOString(),
          category: category || "Markets",
        }));
      }
    } catch (err) {
      console.error("NewsAPI failed, using mock", err);
    }
  }

  if (items.length === 0) {
    items = MOCK_NEWS;
  }

  // カテゴリ・検索でフィルタ
  let filtered = items;
  if (category) filtered = filtered.filter((n) => n.category === category);
  if (q) {
    filtered = filtered.filter(
      (n) => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ items: filtered, live: Boolean(key) });
}
