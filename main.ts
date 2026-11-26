import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE = "I did not hallucinate that citation; I generated it at temperature 0.7 and then cited myself as the source.";

function getLine(): string {
  return LINE;
}

function validate(line: string): void {
  if (line.length === 0 || line.length > 140) {
    throw new Error(`Line length ${line.length} outside 1..140`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("Line must be a single line without newline characters");
  }
  if (line.trim().length === 0) {
    throw new Error("Line must not be only whitespace");
  }
}

function main(): void {
  const line = getLine();
  validate(line);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "out";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, line, "utf8");
  const readBack = readFileSync(outPath, "utf8");
  if (readBack !== line) {
    throw new Error("Read-back verification failed");
  }
  const sha256 = createHash("sha256").update(readBack, "utf8").digest("hex");
  console.log(sha256);
}

main();
