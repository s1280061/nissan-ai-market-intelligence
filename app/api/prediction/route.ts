import { NextResponse } from "next/server";
import { getPrediction } from "@/lib/prediction-source";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PREDICTION_API_URL が設定されていれば FastAPI(LightGBM)へプロキシ。
// 未設定・失敗時は内蔵のバックテスト結果にフォールバック。
export async function GET() {
  const pred = await getPrediction();
  return NextResponse.json(pred);
}
