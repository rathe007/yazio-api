import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/middleware/auth";
import { handleError } from "@/lib/middleware/error-handler";
import { SearchFoodQuerySchema } from "@/lib/validation/schemas";
import * as yazioService from "@/lib/yazio/service";

export async function GET(request: NextRequest) {
  const authError = authenticateRequest(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const validated = SearchFoodQuerySchema.parse({
      query: searchParams.get("query"),
      limit: searchParams.get("limit") ?? undefined,
    });

    const results = await yazioService.searchFood(
      validated.query,
      validated.limit
    );

    return NextResponse.json({ success: true, results });
  } catch (error) {
    return handleError(error);
  }
}
