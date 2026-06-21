export interface Quote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  volume: number;
  marketCap: number | null;
  currency: string;
  marketState: string;
}

export interface Candle {
  date: string; // ISO
  close: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
}

export interface StockResponse {
  quote: Quote;
  candles: Candle[];
  range: string;
}

export type Signal = "Strong Buy" | "Buy" | "Neutral" | "Avoid";

export interface ShapFeature {
  feature: string;
  label: string;
  value: number; // SHAP寄与(符号付き)
  direction: "positive" | "negative";
}

export interface Prediction {
  probability: number; // 0..1  「5営業日以内に+5%以上上昇する確率」
  signal: Signal;
  confidence: "High" | "Medium" | "Low";
  horizonDays: number;
  targetReturn: number; // 0.05
  updatedAt: string;
  shap: ShapFeature[];
  metrics: {
    rocAuc: number;
    sharpe: number;
    winRate: number;
    cagr: number;
    maxDrawdown: number;
    backtestYears: number;
  };
}

export interface IndexQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  spark: number[];
}

export interface HistoryRow {
  date: string;
  price: number;
  probability: number;
  futureRet5d: number | null;
  actualUp: number | null;
  correct: boolean | null;
}

export interface HistoryResp {
  history: HistoryRow[];
  summary: {
    evaluated: number;
    accuracy: number | null;
    buySignals: number;
    buyHitRate: number | null;
    baseRate: number | null;
    pending: number;
  };
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  category: string;
}
