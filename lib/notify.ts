import type { Level5 } from "@/lib/signal";

const TAGS: Record<Level5, string> = {
  StrongBuy: "rocket,chart_with_upwards_trend",
  Buy: "chart_with_upwards_trend",
  Hold: "left_right_arrow",
  Sell: "chart_with_downwards_trend",
  StrongSell: "rotating_light,chart_with_downwards_trend",
};
const PRIORITY: Record<Level5, string> = {
  StrongBuy: "4",
  Buy: "3",
  Hold: "2",
  Sell: "3",
  StrongSell: "4",
};

export interface NotifyInput {
  level: Level5;
  signalEn: string;
  body: string;
  clickUrl?: string;
}

/** ntfy.sh のトピックへ通知を送る。Title はASCII、本文(UTF-8)に日本語を入れる。 */
export async function sendNtfy(input: NotifyInput): Promise<{ ok: boolean; status: number }> {
  const topic = process.env.NTFY_TOPIC;
  const server = (process.env.NTFY_SERVER || "https://ntfy.sh").replace(/\/$/, "");
  if (!topic) return { ok: false, status: 0 };

  const headers: Record<string, string> = {
    Title: `Nissan AI · ${input.signalEn}`,
    Tags: TAGS[input.level],
    Priority: PRIORITY[input.level],
    "Content-Type": "text/plain; charset=utf-8",
  };
  if (input.clickUrl) headers["Click"] = input.clickUrl;

  // ntfy トピックに認証(任意)
  if (process.env.NTFY_TOKEN) headers["Authorization"] = `Bearer ${process.env.NTFY_TOKEN}`;

  const r = await fetch(`${server}/${topic}`, {
    method: "POST",
    headers,
    body: input.body,
  });
  return { ok: r.ok, status: r.status };
}
