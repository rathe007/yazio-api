import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/middleware/auth";
import { handleError } from "@/lib/middleware/error-handler";
import { LogMealSchema } from "@/lib/validation/schemas";
import * as yazioService from "@/lib/yazio/service";

export async function POST(request: NextRequest) {
  const authError = authenticateRequest(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const validated = LogMealSchema.parse(body);

    const result = await yazioService.logMeal(
      validated.date,
      validated.mealType,
      validated.entries
    );

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return handleError(error);
  }
}
