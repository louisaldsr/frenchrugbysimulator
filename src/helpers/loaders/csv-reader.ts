import { Competition } from "@/types/Competition";

export default async function readCsv(
  competition: Competition,
  fileName: string
): Promise<string[]> {
  const url = `${
    process.env.NEXT_PUBLIC_URL || ""
  }/data/${competition}/${fileName}`;
  try {
    console.log(`Fetching from: ${url}`);

    const response = await fetch(url, {
      headers: {
        Accept: "text/csv, text/plain, */*",
        "Cache-Control": "no-cache",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      console.error("Fetch failed:", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });

      const text = await response.text();
      console.error("Response body:", text);

      throw new Error(
        `Failed to load ${fileName} for ${competition}. Status: ${response.status}`
      );
    }

    const text = await response.text();

    if (!text || text.trim().length === 0) {
      throw new Error(`Empty response received for ${fileName}`);
    }

    console.log(`Successfully loaded ${fileName} (${text.length} bytes)`);

    return text.split("\n").filter((line) => line.trim().length > 0);
  } catch (error) {
    console.error("CSV loading error:", {
      competition,
      fileName,
      url,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
}
