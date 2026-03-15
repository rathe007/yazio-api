import { NextRequest, NextResponse } from "next/server";
import { getConfig } from "@/config";

export function authenticateRequest(
  request: NextRequest
): NextResponse | null {
  const config = getConfig();

  if (!config.apiSecret) {
    return NextResponse.json(
      { success: false, error: "Server misconfigured: API_SECRET not set" },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, error: "Missing or invalid Authorization header" },
      { status: 401 }
    );
  }

  const token = authHeader.slice(7);
  if (token !== config.apiSecret) {
    return NextResponse.json(
      { success: false, error: "Invalid API key" },
      { status: 403 }
    );
  }

  return null; // Auth passed
}
