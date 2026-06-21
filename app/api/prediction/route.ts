import { NextResponse } from "next/server";
import { buildPrediction, CURRENT_PROBABILITY } from "@/lib/model";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PREDICTION_API_URL が設定されていれば FastAPI(LightGBM)へプロキシ。
// 例: PREDICTION_API_URL=https://nissan-prediction-api.onrender.com
export async function GET() {
  const base = process.env.PREDICTION_API_URL;
  if (base) {
    const url = `${base.replace(/\/$/, "")}/predict`;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      const r = await fetch(url, { cache: "no-store", signal: controller.signal });
      clearTimeout(timeout);
      if (r.ok) {
        const data = await r.json();
        return NextResponse.json({ ...data, source: "lightgbm-api" });
      }
      console.error(`prediction API ${r.status} from ${url}`);
    } catch (err) {
      console.error("prediction API unreachable, falling back to static", err);
    }
  }
  // フォールバック: 内蔵のバックテスト結果ベースの予測
  return NextResponse.json({ ...buildPrediction(CURRENT_PROBABILITY), source: "static" });
}
