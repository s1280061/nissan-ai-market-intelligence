import { buildPrediction, CURRENT_PROBABILITY } from "@/lib/model";
import type { Prediction } from "@/lib/types";

/**
 * 予測の取得を一元化。PREDICTION_API_URL があれば FastAPI(/predict)、
 * 無ければ内蔵のバックテスト結果ベースの値を返す。
 */
export async function getPrediction(): Promise<Prediction & { source: string }> {
  const base = process.env.PREDICTION_API_URL;
  if (base) {
    try {
      const controller = new AbortController();
      // Render無料枠のコールドスタート(最大~50s)でもフォールバックに落とさず実値を返す
      const t = setTimeout(() => controller.abort(), 55000);
      const r = await fetch(`${base.replace(/\/$/, "")}/predict`, {
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(t);
      if (r.ok) {
        const data = (await r.json()) as Prediction;
        return { ...data, source: "lightgbm-api" };
      }
    } catch {
      /* フォールバックへ */
    }
  }
  return { ...buildPrediction(CURRENT_PROBABILITY), source: "static" };
}
