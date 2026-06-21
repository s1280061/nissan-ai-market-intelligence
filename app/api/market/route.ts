import { NextResponse } from "next/server";
import { getIndices } from "@/lib/yahoo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const indices = await getIndices();
    return NextResponse.json(
      { indices },
      { headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=60" } }
    );
  } catch (err) {
    console.error("/api/market error", err);
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 502 });
  }
}
