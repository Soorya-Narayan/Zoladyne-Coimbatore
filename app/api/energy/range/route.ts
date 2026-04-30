/**
 * GET /api/energy/range?start=ms&end=ms
 * Query by timestamp range (milliseconds), handles pagination
 */

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { queryRange } from "@/lib/dynamodb";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startParam = searchParams.get("start");
    const endParam = searchParams.get("end");

    if (!startParam || !endParam) {
      return NextResponse.json(
        { error: "Missing required query params: start, end (epoch ms)" },
        { status: 400 }
      );
    }

    const startMs = parseInt(startParam, 10);
    const endMs = parseInt(endParam, 10);
    if (Number.isNaN(startMs) || Number.isNaN(endMs) || startMs >= endMs) {
      return NextResponse.json(
        { error: "Invalid start/end: must be numeric (ms) with start < end" },
        { status: 400 }
      );
    }

    const { items, lastKey } = await queryRange(startMs, endMs);
    const res: { items: typeof items; lastKey?: Record<string, unknown> } = {
      items,
    };
    if (lastKey) res.lastKey = lastKey;
    return NextResponse.json(res);
  } catch (err) {
    console.error("[api/energy/range]", err);
    return NextResponse.json(
      { error: "Failed to fetch range", details: String(err) },
      { status: 500 }
    );
  }
}
