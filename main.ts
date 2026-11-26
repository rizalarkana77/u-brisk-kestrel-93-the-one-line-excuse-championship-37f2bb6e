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
  if (line !== line.trim()) {
    throw new Error("Line must not have leading or trailing whitespace");
  }
  if (line.includes("\t")) {
    throw new Error("Line must not contain tab characters");
  }
  if (line.includes("  ")) {
    throw new Error("Line must not contain consecutive spaces");
  }
  for (const ch of line) {
    const code = ch.charCodeAt(0);
    if (code < 32 || code === 127) {
      throw new Error("Line must contain only printable characters");
    }
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
