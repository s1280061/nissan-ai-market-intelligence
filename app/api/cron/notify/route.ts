import { NextResponse } from "next/server";
import { getPrediction } from "@/lib/prediction-source";
import { getQuote } from "@/lib/yahoo";
import { fiveLevel } from "@/lib/signal";
import { sendNtfy } from "@/lib/notify";
import { formatNumber, formatPct } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TICKER = process.env.NEXT_PUBLIC_TICKER || "7201.T";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nissan-ai-market-intelligence.vercel.app";

/**
 * 毎日(引け後)に Vercel Cron が叩く。その日のシグナルをntfyでスマホへ通知。
 * CRON_SECRET を設定すると Bearer 認証を必須化(Vercel Cronは自動付与)。
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  if (!process.env.NTFY_TOPIC) {
    return NextResponse.json({ error: "NTFY_TOPIC not set" }, { status: 400 });
  }

  const [pred, quote] = await Promise.all([
    getPrediction(),
    getQuote(TICKER).catch(() => null),
  ]);
  const info = fiveLevel(pred.probability);
  const pct = Math.round(pred.probability * 100);
  const topFactor = pred.shap?.[0]?.label ?? "—";

  const priceLine = quote
    ? `現在値 ¥${formatNumber(quote.price)}（前日比 ${formatPct(quote.changePercent)}）`
    : "";
  const body =
    `日産 7201.T\n` +
    `${priceLine}\n` +
    `シグナル: ${info.jp}（5営業日内に+5%上昇 確率 ${pct}% / 確信度 ${pred.confidence}）\n` +
    `主因: ${topFactor}\n` +
    `※これは投資助言ではありません`;

  const res = await sendNtfy({
    level: info.level,
    signalEn: info.en,
    body,
    clickUrl: SITE_URL,
  });

  return NextResponse.json({
    sent: res.ok,
    status: res.status,
    signal: info.jp,
    probability: pct,
  });
}
