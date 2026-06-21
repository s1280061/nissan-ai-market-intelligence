import { NextResponse } from "next/server";
import { getPrediction } from "@/lib/prediction-source";
import { getQuote } from "@/lib/yahoo";
import { fiveLevel } from "@/lib/signal";
import { formatNumber, formatPct } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const TICKER = process.env.NEXT_PUBLIC_TICKER || "7201.T";
// Groq Cloud (OpenAI互換)。xAI Grok を使う場合は BASE_URL/MODEL を上書き。
const BASE_URL = process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1";
const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

export async function GET() {
  const [pred, quote] = await Promise.all([
    getPrediction(),
    getQuote(TICKER).catch(() => null),
  ]);
  const info = fiveLevel(pred.probability);
  const pct = Math.round(pred.probability * 100);

  const ctx = {
    price: quote ? `¥${formatNumber(quote.price)}` : "—",
    change: quote ? formatPct(quote.changePercent) : "—",
    signalJp: info.jp,
    signalEn: info.en,
    probability: `${pct}%`,
    confidence: pred.confidence,
    target: "5営業日以内に+5%上昇",
    shap: pred.shap
      .map((s) => `${s.label}(${s.direction === "positive" ? "上昇方向に寄与" : "下落方向に寄与"}, ${s.value})`)
      .join(", "),
    asOf: (pred as { asOf?: string }).asOf || "最新",
  };

  const key = process.env.GROQ_API_KEY;
  if (key) {
    try {
      const commentary = await callLLM(key, ctx);
      if (commentary) {
        return NextResponse.json({ commentary, source: "groq", model: MODEL, signal: info.jp });
      }
    } catch (err) {
      console.error("Groq call failed, using fallback", err);
    }
  }
  return NextResponse.json({
    commentary: fallback(ctx),
    source: "fallback",
    model: null,
    signal: info.jp,
  });
}

type Ctx = Record<string, string>;

async function callLLM(key: string, ctx: Ctx): Promise<string | null> {
  const system =
    "あなたは日産自動車(7201.T)の株式AIアナリストです。専門用語はやさしく噛み砕き、" +
    "断定や投資勧誘は避け、最後に必ず「これは投資助言ではありません」と一言添えます。" +
    "日本語で、見出し記号(#)は使わず、2〜3個の短い段落で簡潔に書いてください。";
  const user =
    `以下のAIモデルの本日の予測データをもとに、(1)今日の状況、(2)なぜこのシグナルなのか、` +
    `(3)注意点、を解説してください。\n\n` +
    `- 現在値: ${ctx.price} (前日比 ${ctx.change})\n` +
    `- 予測ターゲット: ${ctx.target}\n` +
    `- 上昇確率: ${ctx.probability} (確信度 ${ctx.confidence})\n` +
    `- 5段階シグナル: ${ctx.signalJp} (${ctx.signalEn})\n` +
    `- 主要因(SHAP上位): ${ctx.shap}\n` +
    `- 基準日: ${ctx.asOf}\n\n` +
    `SHAPの「上昇方向に寄与」は確率を押し上げ、「下落方向に寄与」は押し下げています。` +
    `どの指標が効いているかに触れて、なぜ「${ctx.signalJp}」なのかを説明してください。`;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 20000);
  const r = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.5,
      max_tokens: 600,
    }),
    signal: controller.signal,
  });
  clearTimeout(t);
  if (!r.ok) {
    console.error("Groq HTTP", r.status, await r.text().catch(() => ""));
    return null;
  }
  const data = await r.json();
  return data?.choices?.[0]?.message?.content?.trim() || null;
}

// キー未設定時: データから決定的に解説を組み立てる(LLMなしでも機能する)
function fallback(ctx: Ctx): string {
  const top = ctx.shap.split(", ").slice(0, 3).join("、");
  return (
    `本日の日産は ${ctx.price}（前日比 ${ctx.change}）。` +
    `AIモデルが見積もる「${ctx.target}」確率は ${ctx.probability}（確信度 ${ctx.confidence}）で、` +
    `5段階シグナルは「${ctx.signalJp}」です。\n\n` +
    `この判断に最も効いている要因は ${top} です。` +
    `本モデルはボラティリティ（変動の大きさ）が高まる局面で大きな上昇が出やすい、という関係を学習しており、` +
    `上記の指標がその方向を示しているため「${ctx.signalJp}」と評価されています。\n\n` +
    `確率は日々の株価データから自動更新されますが、地政学・決算・為替などの突発要因までは織り込めません。` +
    `これは投資助言ではありません。`
  );
}
