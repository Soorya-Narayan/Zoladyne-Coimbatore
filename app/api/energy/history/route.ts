/**
 * GET /api/energy/history?start=YYYY-MM-DD&end=YYYY-MM-DD&limit=N
 * Query by date range (UTC midnight), supports pagination via LastEvaluatedKey
 */

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { queryHistory } from "@/lib/dynamodb";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const limit = Math.min(
      Math.max(1, parseInt(searchParams.get("limit") ?? "100", 10)),
      500
    );

    if (!start || !end) {
      return NextResponse.json(
        { error: "Missing required query params: start, end (YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    const { items, lastKey } = await queryHistory(start, end, limit);
    const res: { items: typeof items; lastKey?: Record<string, unknown> } = {
      items,
    };
    if (lastKey) res.lastKey = lastKey;
    return NextResponse.json(res);
  } catch (err) {
    console.error("[api/energy/history]", err);
    return NextResponse.json(
      { error: "Failed to fetch history", details: String(err) },
      { status: 500 }
    );
  }
}
