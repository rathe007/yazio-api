import { NextResponse } from "next/server";
import { getConfig } from "@/config";

export async function GET() {
  const config = getConfig();

  return NextResponse.json({
    success: true,
    status: "ok",
    mode: config.useMockYazio ? "mock" : "live",
    timestamp: new Date().toISOString(),
  });
}
