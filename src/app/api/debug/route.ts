// app/api/debug-files/route.ts
import { NextResponse } from "next/server";
import { readdir } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const dir = path.join(process.cwd(), "public", "data", "top14");
  try {
    const files = await readdir(dir);
    return NextResponse.json({ dir, files });
  } catch (e) {
    return NextResponse.json({ dir, error: String(e) }, { status: 500 });
  }
}
