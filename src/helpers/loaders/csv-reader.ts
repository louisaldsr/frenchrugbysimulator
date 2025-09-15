import { Competition } from "@/types/Competition";

export default async function readCsv(
  competition: Competition,
  fileName: string
): Promise<string[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL || ""}/data/${competition}/${fileName}`
  );

  if (!response.ok) {
    throw new Error(`Failed to load ${fileName} for ${competition}`);
  }

  const text = await response.text();
  return text.split("\n");
}
