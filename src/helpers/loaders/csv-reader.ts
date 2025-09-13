import { headers } from "next/headers";

export default async function readCsv(
  competition: string,
  fileName: string
): Promise<string[]> {
  const host =
    (await headers()).get("x-forwarded-host") || (await headers()).get("host");
  const csvUrl = new URL(`/data/${competition}/${fileName}`, `http://${host}`);

  try {
    const res = await fetch(csvUrl, { cache: "force-cache" });
    if (!res.ok) throw new Error(res.statusText);
    const rawFileContent = await res.text();
    return rawFileContent.split("\n");
  } catch (error) {
    throw new Error(
      `Failed to fetch [csvPath: ${csvUrl.toString()}]: ${error}`
    );
  }
}
