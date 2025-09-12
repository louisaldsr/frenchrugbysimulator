import { promises as fs } from "fs";
import path from "path";

export default async function readCsv(
  competition: string,
  fileName: string
): Promise<string[]> {
  const csvPath = path.join(
    process.cwd(),
    "public",
    "data",
    competition,
    fileName
  );
  const rawFileContent = await fs.readFile(csvPath, "utf-8");
  return rawFileContent.split("\n");
}
