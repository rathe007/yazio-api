import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/middleware/auth";
import { handleError } from "@/lib/middleware/error-handler";
import { DaySummaryQuerySchema } from "@/lib/validation/schemas";
import * as yazioService from "@/lib/yazio/service";

export async function GET(request: NextRequest) {
  const authError = authenticateRequest(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const validated = DaySummaryQuerySchema.parse({
      date: searchParams.get("date"),
    });

    const result = await yazioService.getDaySummary(validated.date);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return handleError(error);
  }
}
