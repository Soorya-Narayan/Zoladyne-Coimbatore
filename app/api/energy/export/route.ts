import { NextRequest, NextResponse } from "next/server";
import { queryRange } from "@/lib/dynamodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startMs = parseInt(searchParams.get("startMs") || "0", 10);
    const endMs = parseInt(searchParams.get("endMs") || "0", 10);

    if (!startMs || !endMs) {
      return NextResponse.json({ error: "Missing startMs or endMs" }, { status: 400 });
    }

    const { items } = await queryRange(startMs, endMs);
    return NextResponse.json({ items });
  } catch (err) {
    console.error("[api/energy/export]", err);
    return NextResponse.json(
      { error: "Failed to export energy data", details: String(err) },
      { status: 500 }
    );
  }
}
