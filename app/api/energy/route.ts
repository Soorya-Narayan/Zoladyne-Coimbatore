/**
 * GET /api/energy?points=60
 * Returns time-series for charts (last N points, oldest → newest)
 */

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { queryLastNPoints } from "@/lib/dynamodb";

export async function GET(request: NextRequest) {
  try {
    const points = Math.min(
      Math.max(1, parseInt(request.nextUrl.searchParams.get("points") ?? "60", 10)),
      500
    );
    const { items } = await queryLastNPoints(points);
    return NextResponse.json({ items });
  } catch (err) {
    console.error("[api/energy]", err);
    return NextResponse.json(
      { error: "Failed to fetch energy data", details: String(err) },
      { status: 500 }
    );
  }
}
