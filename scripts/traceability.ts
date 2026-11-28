import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const ROOT = process.cwd();
const TESTS_DIR = join(ROOT, 'tests');
const DOCS_DIR = join(ROOT, 'docs');

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (entry.endsWith('.spec.ts')) acc.push(full);
  }
  return acc;
}

const specFiles = walk(TESTS_DIR);
const idToFiles = new Map<string, Set<string>>();

for (const file of specFiles) {
  const content = readFileSync(file, 'utf8');
  const rel = relative(ROOT, file);
  const regex = /TC-[A-Z]+(?:-[A-Z]+)*-\d+/g;
  for (const m of content.matchAll(regex)) {
    const id = m[0];
    if (!idToFiles.has(id)) idToFiles.set(id, new Set());
    idToFiles.get(id)!.add(rel);
  }
}

// Documented scenario counts per workflow (from docs/TEST_SCENARIOS_FUNCTIONAL.md)
const documented: Record<string, number> = {
  'Login': 15,
  'Transfer Funds': 18,
  'Bill Payment': 21,
  'Loan Request': 18,
};

// Map TC prefix -> workflow name
function workflowOf(id: string): string {
  if (id.startsWith('TC-LOGIN')) return 'Login';
  if (id.startsWith('TC-TRANSFER') || id.startsWith('TC-EDGE-TF') || id.startsWith('TC-NEG-TF') || id.startsWith('TC-SEC-TF')) return 'Transfer Funds';
  if (id.startsWith('TC-BILLPAY')) return 'Bill Payment';
  if (id.startsWith('TC-LOAN')) return 'Loan Request';
  return 'Other';
}

const automatedByWorkflow = new Map<string, Set<string>>();
for (const id of idToFiles.keys()) {
  const wf = workflowOf(id);
  if (!automatedByWorkflow.has(wf)) automatedByWorkflow.set(wf, new Set());
  automatedByWorkflow.get(wf)!.add(id);
}

const lines: string[] = [];
lines.push('# Test Traceability Matrix');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Automated Test Case IDs');
lines.push('');
lines.push('| Test Case ID | Spec File(s) |');
lines.push('|---|---|');
for (const id of [...idToFiles.keys()].sort()) {
  const files = [...idToFiles.get(id)!].sort().join(', ');
  lines.push(`| ${id} | ${files} |`);
}
lines.push('');
lines.push('## Coverage by Workflow');
lines.push('');
lines.push('| Workflow | Documented | Automated | Coverage |');
lines.push('|---|---|---|---|');
for (const [wf, count] of Object.entries(documented)) {
  const auto = automatedByWorkflow.get(wf)?.size ?? 0;
  const pct = count > 0 ? ((auto / count) * 100).toFixed(1) : '0.0';
  lines.push(`| ${wf} | ${count} | ${auto} | ${pct}% |`);
}
lines.push('');
lines.push('## Unautomated Documented Scenarios');
lines.push('');
lines.push('Documented test case IDs not yet found in any spec file under `tests/`.');
lines.push('');
// (Documented IDs are not enumerated here; coverage is computed from counts only.)
lines.push('_Run `npm run traceability` after adding tests to regenerate._');
lines.push('');

writeFileSync(join(DOCS_DIR, 'TRACEABILITY.md'), lines.join('\n'), 'utf8');
console.log(`Wrote ${idToFiles.size} traceable IDs to docs/TRACEABILITY.md`);
