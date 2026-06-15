#!/usr/bin/env node
/**
 * Verifica se o que o relatorio.md (via devlog.json) descreve está 100% no banco.
 * Compara devlog.json (esperado) x _snapshot_live.json (estado real do banco).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function readJson(p) {
  let buf = fs.readFileSync(p);
  // snapshot pode estar em UTF-16 LE (saída do PowerShell/Node no Windows)
  if (buf[0] === 0xff && buf[1] === 0xfe) {
    return JSON.parse(buf.toString('utf16le'));
  }
  // remove BOM UTF-8 se houver
  let text = buf.toString('utf8');
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  return JSON.parse(text);
}

const expected = readJson(path.join(ROOT, 'devlog.json'));
const live = readJson(path.join(ROOT, '_snapshot_live.json'));

const dbProjects = new Map(live.projects.map((p) => [p.name, p]));

const round = (n) => Math.round((n ?? 0) * 100) / 100;

let totalModExpected = 0;
let totalModOk = 0;
const problems = [];
const projectReport = [];

for (const proj of expected.projects) {
  const db = dbProjects.get(proj.name);
  const r = { name: proj.name, expectedModules: proj.modules.length, found: 0, missing: [], mismatch: [] };
  if (!db) {
    r.projectMissing = true;
    problems.push(`PROJETO AUSENTE no banco: "${proj.name}"`);
    projectReport.push(r);
    totalModExpected += proj.modules.length;
    continue;
  }
  const dbModulesByDate = new Map();
  const dbModulesByName = new Map();
  for (const m of db.modules) {
    if (m.workDate) dbModulesByDate.set(m.workDate, m);
    dbModulesByName.set(m.name, m);
  }

  for (const mod of proj.modules) {
    totalModExpected++;
    // casa por workDate (chave de idempotência principal) ou por nome
    const dbMod = dbModulesByName.get(mod.name) || dbModulesByDate.get(mod.workDate);
    if (!dbMod) {
      r.missing.push(`${mod.workDate} (${mod.hours}h) — ${mod.name}`);
      problems.push(`MODULO AUSENTE: [${proj.name}] ${mod.workDate} — ${mod.name}`);
      continue;
    }
    r.found++;
    const issues = [];
    if (round(dbMod.loggedHours) !== round(mod.hours)) {
      issues.push(`horas esperado=${round(mod.hours)} banco=${round(dbMod.loggedHours)}`);
    }
    if (dbMod.status !== mod.status) {
      issues.push(`status esperado=${mod.status} banco=${dbMod.status}`);
    }
    if (dbMod.name !== mod.name) {
      issues.push(`nome esperado="${mod.name}" banco="${dbMod.name}"`);
    }
    if (dbMod.workDate !== mod.workDate) {
      issues.push(`data esperado=${mod.workDate} banco=${dbMod.workDate}`);
    }
    if (issues.length) {
      r.mismatch.push(`${mod.workDate}: ${issues.join(' | ')}`);
      problems.push(`DIVERGENCIA: [${proj.name}] ${mod.workDate} — ${issues.join(' | ')}`);
    } else {
      totalModOk++;
    }
  }

  // horas totais esperadas x banco
  r.expectedHours = round(proj.modules.reduce((s, m) => s + (m.hours ?? 0), 0));
  r.dbActualHours = round(db.actualHours);
  r.dbTimeLogHours = round(db.timeLogHours);
  r.dbModuleCount = db.modules.length;
  projectReport.push(r);
}

console.log('=================================================================');
console.log(' VERIFICACAO relatorio.md (devlog.json) x BANCO DE DADOS');
console.log('=================================================================\n');

for (const r of projectReport) {
  const status = r.projectMissing
    ? '❌ PROJETO AUSENTE'
    : r.missing.length || r.mismatch.length
      ? '⚠️  DIVERGENTE'
      : '✅ OK';
  console.log(`${status}  ${r.name}`);
  if (r.projectMissing) continue;
  console.log(`     modulos esperados=${r.expectedModules} | encontrados=${r.found} | banco tem=${r.dbModuleCount}`);
  console.log(`     horas esperadas=${r.expectedHours}h | actualHours=${r.dbActualHours}h | timeLogs=${r.dbTimeLogHours}h`);
  for (const m of r.missing) console.log(`       - AUSENTE: ${m}`);
  for (const m of r.mismatch) console.log(`       - DIFERE:  ${m}`);
  console.log('');
}

// projetos no banco que não vieram do relatório
const expectedNames = new Set(expected.projects.map((p) => p.name));
const extraActive = live.projects.filter(
  (p) => !expectedNames.has(p.name) && !p.name.startsWith('[TEST]'),
);
if (extraActive.length) {
  console.log('--- Projetos no banco fora do relatorio (informativo) ---');
  for (const p of extraActive) {
    console.log(`     ${p.name} [${p.status}] ${round(p.timeLogHours)}h, ${p.modules.length} mod`);
  }
  console.log('');
}

const testLeftover = live.projects.filter((p) => p.name.startsWith('[TEST]'));
if (testLeftover.length) {
  console.log('⚠️  Projetos [TEST] ainda no banco (deveriam ser removidos):');
  for (const p of testLeftover) console.log(`     ${p.name}`);
  console.log('');
}

console.log('=================================================================');
console.log(` RESULTADO: ${totalModOk}/${totalModExpected} modulos batem 100%`);
console.log(` Problemas encontrados: ${problems.length}`);
console.log('=================================================================');
if (problems.length === 0 && totalModOk === totalModExpected) {
  console.log('\n✅ 100% — o relatorio.md está integralmente refletido no banco.');
} else {
  console.log('\n❌ NAO está 100%. Veja as divergencias acima.');
}
process.exit(problems.length === 0 ? 0 : 2);
