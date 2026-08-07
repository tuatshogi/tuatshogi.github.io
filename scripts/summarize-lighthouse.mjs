import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const profile = process.argv[2];

if (!profile || !["mobile", "desktop"].includes(profile)) {
  throw new Error("Usage: node scripts/summarize-lighthouse.mjs <mobile|desktop>");
}

async function readJson(filePath, fallback) {
  try {
    return { exists: true, value: JSON.parse(await readFile(filePath, "utf8")) };
  } catch {
    return { exists: false, value: fallback };
  }
}

function formatValue(value) {
  return typeof value === "number" && Number.isFinite(value) ? String(value) : "n/a";
}

const assertionReport = await readJson(
  resolve(projectRoot, ".lighthouseci/assertion-results.json"),
  [],
);
const manifestReport = await readJson(resolve(projectRoot, `lhci_reports/${profile}/manifest.json`), []);
const assertions = assertionReport.value;
const manifest = manifestReport.value;
const lines = [`## Lighthouse ${profile}`, ""];

const representativeRuns = manifest.filter((entry) => entry.isRepresentativeRun);
if (representativeRuns.length > 0) {
  lines.push("### Representative scores");
  for (const entry of representativeRuns) {
    const scores = Object.entries(entry.summary)
      .map(([category, score]) => `${category}=${score}`)
      .join(", ");
    lines.push(`- ${entry.url}: ${scores}`);
  }
  lines.push("");
}

if (!manifestReport.exists) {
  lines.push("No Lighthouse reports were generated. Check the Lighthouse log for collection errors.");
} else if (!assertionReport.exists) {
  lines.push("No assertion result was generated. Check the Lighthouse log for assertion errors.");
} else if (assertions.length > 0) {
  lines.push("### Failed assertions");
  for (const assertion of assertions) {
    const property = assertion.auditProperty ? `.${assertion.auditProperty}` : "";
    lines.push(
      `- ${assertion.url} \`${assertion.auditId}${property}\`: ` +
        `actual=${formatValue(assertion.actual)}, expected=${formatValue(assertion.expected)} ` +
        `(${assertion.operator || "?"})`,
    );
  }
} else {
  lines.push("All Lighthouse assertions passed.");
}

const summary = `${lines.join("\n")}\n`;
const qualityResults = resolve(projectRoot, "quality-results");
await mkdir(qualityResults, { recursive: true });
await writeFile(resolve(qualityResults, `lighthouse-${profile}-summary.md`), summary);

if (process.env.GITHUB_STEP_SUMMARY) {
  await appendFile(process.env.GITHUB_STEP_SUMMARY, summary);
}

process.stdout.write(summary);
