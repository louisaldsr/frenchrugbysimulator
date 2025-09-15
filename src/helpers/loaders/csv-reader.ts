import { Competition } from "@/types/Competition";
import { url } from "inspector";

export default async function readCsv(
  competition: Competition,
  fileName: string
): Promise<string[]> {
  const url = `${
    process.env.NEXT_PUBLIC_URL || ""
  }/data/${competition}/${fileName}`;
  console.log(url);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load ${fileName} for ${competition}`);
  }

  const text = await response.text();
  return text.split("\n");
}
