import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// FastAPI の /history（out-of-sample 実績）をプロキシ。
export async function GET(req: Request) {
  const base = process.env.PREDICTION_API_URL;
  const { searchParams } = new URL(req.url);
  const days = searchParams.get("days") || "90";

  if (!base) {
    return NextResponse.json({
      history: [],
      summary: { evaluated: 0, accuracy: null, buySignals: 0, buyHitRate: null, baseRate: null, pending: 0 },
      source: "unavailable",
    });
  }
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 55000);
    const r = await fetch(`${base.replace(/\/$/, "")}/history?days=${days}`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(t);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    return NextResponse.json({ ...data, source: "lightgbm-api" });
  } catch (err) {
    console.error("/api/history error", err);
    return NextResponse.json({
      history: [],
      summary: { evaluated: 0, accuracy: null, buySignals: 0, buyHitRate: null, baseRate: null, pending: 0 },
      source: "error",
    });
  }
}
