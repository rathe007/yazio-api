import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", ".well-known", "openapi.json");
  const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return NextResponse.json(content, {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
