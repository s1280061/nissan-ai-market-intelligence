import type { Candle, Quote, IndexQuote } from "./types";

/**
 * Yahoo Finance の公開チャートJSONエンドポイントを直接叩く。
 * (npm の yahoo-finance2 はビルドにより chart 等が欠落することがあるため不使用)
 */
const BASE = "https://query1.finance.yahoo.com/v8/finance/chart";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

type RangeKey = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y";

const RANGE_MAP: Record<RangeKey, { range: string; interval: string }> = {
  "1D": { range: "1d", interval: "5m" },
  "1W": { range: "5d", interval: "30m" },
  "1M": { range: "1mo", interval: "1d" },
  "3M": { range: "3mo", interval: "1d" },
  "1Y": { range: "1y", interval: "1d" },
  "5Y": { range: "5y", interval: "1wk" },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
async function fetchChart(symbol: string, range: string, interval: string): Promise<any> {
  const url = `${BASE}/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}&includePrePost=false`;
  const res = await fetch(url, { headers: { "User-Agent": UA }, cache: "no-store" });
  if (!res.ok) throw new Error(`Yahoo ${res.status} for ${symbol}`);
  const json = await res.json();
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error(`No chart data for ${symbol}`);
  return result;
}

function quoteFromMeta(symbol: string, meta: any): Quote {
  const price = meta.regularMarketPrice ?? 0;
  const prev = meta.chartPreviousClose ?? meta.previousClose ?? price;
  const change = price - prev;
  const tp = meta.currentTradingPeriod?.regular;
  const now = Date.now() / 1000;
  const marketState = tp && now >= tp.start && now < tp.end ? "REGULAR" : "CLOSED";
  return {
    symbol,
    name: meta.shortName || meta.longName || symbol,
    price,
    change,
    changePercent: prev ? (change / prev) * 100 : 0,
    previousClose: prev,
    volume: meta.regularMarketVolume ?? 0,
    marketCap: null, // chart エンドポイントでは取得不可
    currency: meta.currency || "JPY",
    marketState,
  };
}

function candlesFromResult(result: any): Candle[] {
  const ts: number[] = result.timestamp ?? [];
  const q = result.indicators?.quote?.[0] ?? {};
  const out: Candle[] = [];
  for (let i = 0; i < ts.length; i++) {
    const close = q.close?.[i];
    if (close == null) continue;
    out.push({
      date: new Date(ts[i] * 1000).toISOString(),
      close,
      open: q.open?.[i] ?? undefined,
      high: q.high?.[i] ?? undefined,
      low: q.low?.[i] ?? undefined,
      volume: q.volume?.[i] ?? undefined,
    });
  }
  return out;
}

export async function getQuote(symbol: string): Promise<Quote> {
  const result = await fetchChart(symbol, "5d", "1d");
  return quoteFromMeta(symbol, result.meta);
}

export async function getCandles(symbol: string, range: RangeKey): Promise<Candle[]> {
  const cfg = RANGE_MAP[range] ?? RANGE_MAP["1M"];
  const result = await fetchChart(symbol, cfg.range, cfg.interval);
  return candlesFromResult(result);
}

export async function getStock(symbol: string, range: RangeKey) {
  const cfg = RANGE_MAP[range] ?? RANGE_MAP["1M"];
  const result = await fetchChart(symbol, cfg.range, cfg.interval);
  return { quote: quoteFromMeta(symbol, result.meta), candles: candlesFromResult(result) };
}

const INDEX_SYMBOLS: { symbol: string; name: string }[] = [
  { symbol: "^GSPC", name: "S&P 500" },
  { symbol: "^IXIC", name: "NASDAQ" },
  { symbol: "JPY=X", name: "USD/JPY" },
  { symbol: "^VIX", name: "VIX" },
  { symbol: "^N225", name: "Nikkei 225" },
];

export async function getIndices(): Promise<IndexQuote[]> {
  return Promise.all(
    INDEX_SYMBOLS.map(async ({ symbol, name }) => {
      try {
        const result = await fetchChart(symbol, "5d", "1d");
        const q = quoteFromMeta(symbol, result.meta);
        const spark = candlesFromResult(result).map((c) => c.close);
        return {
          symbol,
          name,
          price: q.price,
          change: q.change,
          changePercent: q.changePercent,
          spark,
        };
      } catch {
        return { symbol, name, price: 0, change: 0, changePercent: 0, spark: [] };
      }
    })
  );
}
