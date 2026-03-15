import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/middleware/auth";
import { handleError } from "@/lib/middleware/error-handler";
import { DeleteEntrySchema } from "@/lib/validation/schemas";
import * as yazioService from "@/lib/yazio/service";

export async function DELETE(request: NextRequest) {
  const authError = authenticateRequest(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const validated = DeleteEntrySchema.parse(body);

    const deleted = await yazioService.deleteEntry(
      validated.date,
      validated.mealType,
      validated.entryName
    );

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "No matching entry found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    return handleError(error);
  }
}
