import { headers } from "next/headers";
import path from "path";

export default async function readCsv(
  competition: string,
  fileName: string
): Promise<string[]> {
  const host =
    (await headers()).get("x-forwarded-host") || (await headers()).get("host");
  const base = !host?.includes("localhost")
    ? `https://${host}`
    : "http://localhost:3000";
  const csvPath = path.join(base, "data", competition, fileName);

  try {
    const res = await fetch(csvPath, { cache: "force-cache" });
    if (!res.ok) throw new Error(res.statusText);
    const rawFileContent = await res.text();
    return rawFileContent.split("\n");
  } catch (error) {
    throw new Error(`Failed to fetch [csvPath: ${csvPath}]: ${error}`);
  }
}
