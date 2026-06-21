import { NextResponse } from "next/server";
import { getStock } from "@/lib/yahoo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TICKER = process.env.NEXT_PUBLIC_TICKER || "7201.T";
const VALID = ["1D", "1W", "1M", "3M", "1Y", "5Y"] as const;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rangeParam = (searchParams.get("range") || "1M").toUpperCase();
  const range = (VALID as readonly string[]).includes(rangeParam) ? rangeParam : "1M";
  const symbol = searchParams.get("symbol") || TICKER;

  try {
    const { quote, candles } = await getStock(symbol, range as (typeof VALID)[number]);
    return NextResponse.json(
      { quote, candles, range },
      { headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=60" } }
    );
  } catch (err) {
    console.error("/api/stock error", err);
    return NextResponse.json(
      { error: "Failed to fetch stock data", detail: String(err) },
      { status: 502 }
    );
  }
}
