/**
 * GET /api/energy/latest
 * Returns the most recent record
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { queryLatest } from "@/lib/dynamodb";

export async function GET() {
  try {
    const item = await queryLatest();
    return NextResponse.json({ item });
  } catch (err) {
    console.error("[api/energy/latest]", err);
    return NextResponse.json(
      { error: "Failed to fetch latest energy data", details: String(err) },
      { status: 500 }
    );
  }
}
