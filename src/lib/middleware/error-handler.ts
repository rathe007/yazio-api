import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function handleError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    const messages = error.errors.map(
      (e) => `${e.path.join(".")}: ${e.message}`
    );
    return NextResponse.json(
      { success: false, error: `Validation error: ${messages.join(", ")}` },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    console.error("API Error:", error.message);

    if (error.message.includes("Food not found")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }

    if (error.message.includes("YAZIO API error")) {
      return NextResponse.json(
        { success: false, error: "YAZIO service unavailable" },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  console.error("Unknown error:", error);
  return NextResponse.json(
    { success: false, error: "Internal server error" },
    { status: 500 }
  );
}
