#!/usr/bin/env node
/**
 * Converte relatorio.md → devlog.json (+ import-preview.md)
 *
 * Uso:
 *   node scripts/relatorio-to-devlog.mjs              # gera devlog.json
 *   node scripts/relatorio-to-devlog.mjs --dry-run    # só preview
 *   node scripts/relatorio-to-devlog.mjs --project="Dashboard Transporte"
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const projectFilter = args.find((a) => a.startsWith('--project='))?.split('=').slice(1).join('=');

const rules = JSON.parse(fs.readFileSync(path.join(ROOT, 'import-rules.json'), 'utf8'));
const mappingConfig = JSON.parse(fs.readFileSync(path.join(ROOT, 'import-mapping.json'), 'utf8'));

const MONTHS = {
  janeiro: 1,
  fevereiro: 2,
  março: 3,
  marco: 3,
  abril: 4,
  maio: 5,
  junho: 6,
  julho: 7,
  agosto: 8,
  setembro: 9,
  outubro: 10,
  novembro: 11,
  dezembro: 12,
};

function normalizeText(value) {
  return mappingConfig.aliases?.[value] ?? value;
}

function resolveMapping(reportProjectName) {
  const normalized = normalizeText(reportProjectName.trim());
  if (mappingConfig.mappings[normalized]) {
    return mappingConfig.mappings[normalized];
  }
  for (const [key, value] of Object.entries(mappingConfig.mappings)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  return null;
}

function parseDayDate(headerLine) {
  const br = headerLine.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (br) {
    const [, dd, mm, yyyy] = br;
    return `${yyyy}-${mm}-${dd}`;
  }
  const named = headerLine.match(/^[^,]+,\s*(\d{1,2})\s+de\s+([a-zç]+)\s+de\s+(\d{4})/i);
  if (named) {
    const day = named[1].padStart(2, '0');
    const monthKey = named[2].toLowerCase();
    const month = MONTHS[monthKey];
    if (!month) return null;
    return `${named[3]}-${String(month).padStart(2, '0')}-${day}`;
  }
  return null;
}

function parseTempoHours(tempoText) {
  const text = tempoText.toLowerCase().trim();
  if (text.includes('min')) {
    const range = text.match(/(\d+)\s*-\s*(\d+)\s*min/);
    if (range) return Math.max(0.25, (Number(range[1]) + Number(range[2])) / 2 / 60);
    const single = text.match(/(\d+)\s*min/);
    if (single) return Math.max(0.25, Number(single[1]) / 60);
    return 0.25;
  }
  if (text.includes('h+') || text.includes('6-8')) return 6;
  const range = text.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*h/);
  if (range) {
    const avg = (Number(range[1]) + Number(range[2])) / 2;
    if (avg <= 2) return 1.5;
    if (avg <= 4) return 3;
    if (avg <= 6) return 5;
    return 6;
  }
  const single = text.match(/(\d+(?:\.\d+)?)\s*h/);
  if (single) return Math.min(6, Number(single[1]));
  return 1;
}

function shouldIgnoreCommit(message, lines) {
  const lower = message.toLowerCase();
  if (lines <= rules.ignoreIfLinesBelow) return true;
  if (lines < rules.minCommitLinesToCount) {
    return rules.ignoreCommitPatterns.some((p) => lower.includes(p.toLowerCase()));
  }
  return rules.ignoreCommitPatterns.some((p) => lower.includes(p.toLowerCase()) && lines < 20);
}

function summarizeMessage(message) {
  const cleaned = message
    .replace(/^\s*(feat|fix|refactor|chore|docs|ci|style|test)(\([^)]+\))?:\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (cleaned.length <= rules.summaryMaxLength) return cleaned;
  return `${cleaned.slice(0, rules.summaryMaxLength - 1)}…`;
}

function moduleStatusForDate(workDate) {
  const end = new Date(`${rules.periodEnd}T12:00:00.000Z`);
  const date = new Date(`${workDate}T12:00:00.000Z`);
  const diffDays = Math.floor((end.getTime() - date.getTime()) / 86400000);
  if (diffDays <= rules.recentDaysInProgress) return 'EM_PROCESSO';
  return 'CONCLUIDO';
}

function parseRelatorio(content) {
  const detailIndex = content.indexOf('## Detalhamento dia a dia');
  if (detailIndex < 0) throw new Error('Seção "## Detalhamento dia a dia" não encontrada.');

  const body = content.slice(detailIndex);
  const dayBlocks = body.split(/^### /m).slice(1);
  const buckets = new Map();

  for (const block of dayBlocks) {
    const lines = block.split(/\r?\n/).map((line) => line.trim());
    const dayHeader = lines[0]?.trim();
    const workDate = parseDayDate(dayHeader);
    if (!workDate) continue;
    if (workDate < rules.periodStart || workDate > rules.periodEnd) continue;

    let currentProject = null;
    let currentRepo = null;
    let commits = [];

    for (const line of lines.slice(1)) {
      const projectMatch = line.match(/^#### (.+?) \("(.+?)"\)\s*$/);
      if (projectMatch) {
        if (currentProject && commits.length) {
          addBucket(buckets, currentProject, currentRepo, workDate, commits);
        }
        currentProject = normalizeText(projectMatch[1]);
        currentRepo = projectMatch[2];
        commits = [];
        continue;
      }

      const commitMatch = line.match(/^- \*\*\[[0-9a-f]+\]\([^)]+\)\*\* - (.+)$/);
      if (commitMatch && currentProject) {
        commits.push({ message: commitMatch[1], lines: 0, hours: 0 });
        continue;
      }

      const linesMatch = line.match(/Linhas:\s*\*\*(\d+)\*\*/);
      const tempoMatch = line.match(/Tempo:\s*\*\*([^*]+)\*\*/);
      if (commits.length && (linesMatch || tempoMatch)) {
        const last = commits[commits.length - 1];
        if (linesMatch) last.lines = Number(linesMatch[1]);
        if (tempoMatch) last.hours = parseTempoHours(tempoMatch[1]);
      }
    }

    if (currentProject && commits.length) {
      addBucket(buckets, currentProject, currentRepo, workDate, commits);
    }
  }

  return buckets;
}

function addBucket(buckets, reportProject, repo, workDate, commits) {
  if (mappingConfig.skipReportProjects.includes(reportProject)) return;

  const mapping = resolveMapping(reportProject);
  if (!mapping) return;

  const devflowName = mapping.devflowName;
  if (projectFilter && devflowName !== projectFilter && !devflowName.includes(projectFilter)) {
    return;
  }

  let hours = 0;
  const validCommits = [];
  for (const commit of commits) {
    if (shouldIgnoreCommit(commit.message, commit.lines || 0)) continue;
    const h = (commit.hours || 0.5) * (rules.globalMultiplier ?? 1);
    hours += h;
    validCommits.push(commit);
  }
  if (validCommits.length === 0) return;

  hours = Math.min(rules.maxHoursPerDay, Math.round(hours * 100) / 100);
  if (hours <= 0) return;

  const key = `${devflowName}::${workDate}`;
  const summary = summarizeMessage(validCommits[0].message);
  const moduleName = `${workDate} — ${summary}`;
  const description = `${validCommits.length} commit(s) em ${workDate} — ${repo}`;

  buckets.set(key, {
    devflowName,
    mapping,
    reportProject,
    workDate,
    hours,
    moduleName,
    description,
    commitCount: validCommits.length,
  });
}

function buildManifest(buckets) {
  const byProject = new Map();

  for (const entry of buckets.values()) {
    if (!byProject.has(entry.devflowName)) {
      byProject.set(entry.devflowName, {
        name: entry.devflowName,
        description: `Importado de relatorio.md (${rules.periodStart} a ${rules.periodEnd})`,
        status: entry.mapping.status ?? rules.defaultProjectStatus,
        color: entry.mapping.color ?? '#6366f1',
        estimatedHours: entry.mapping.estimatedHours ?? 0,
        modules: [],
      });
    }
    const project = byProject.get(entry.devflowName);
    project.modules.push({
      name: entry.moduleName,
      description: entry.description,
      status: moduleStatusForDate(entry.workDate),
      workDate: entry.workDate,
      hours: entry.hours,
    });
  }

  for (const project of byProject.values()) {
    project.modules.sort((a, b) => a.workDate.localeCompare(b.workDate));
    project.modules.forEach((m, i) => {
      m.order = i;
    });
  }

  return {
    cleanupProjects: mappingConfig.cleanupProjects ?? [],
    removeSeedModules: mappingConfig.removeSeedModules ?? false,
    projects: [...byProject.values()].sort((a, b) => a.name.localeCompare(b.name)),
  };
}

function buildPreview(manifest, buckets) {
  const lines = [
    '# Preview de importação — relatorio.md → DevFlow',
    '',
    `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
    `Período: ${rules.periodStart} a ${rules.periodEnd}`,
    `Modo: ${dryRun ? 'dry-run (nenhum dado gravado)' : 'devlog.json gerado'}`,
    '',
    '## Resumo',
    '',
  ];

  let totalHours = 0;
  let totalModules = 0;
  for (const project of manifest.projects) {
    const projectHours = project.modules.reduce((s, m) => s + (m.hours ?? 0), 0);
    totalHours += projectHours;
    totalModules += project.modules.length;
    lines.push(`- **${project.name}**: ${project.modules.length} módulos, **${projectHours.toFixed(1)}h**`);
  }
  lines.push('');
  lines.push(`**Total:** ${totalModules} módulos, **${totalHours.toFixed(1)}h**`);
  lines.push('');

  if (manifest.cleanupProjects?.length) {
    lines.push('## Cleanup');
    for (const name of manifest.cleanupProjects) {
      lines.push(`- Remover projeto: \`${name}\``);
    }
    lines.push('');
  }

  lines.push('## Detalhe por projeto');
  lines.push('');

  for (const project of manifest.projects) {
    lines.push(`### ${project.name}`);
    lines.push('');
    lines.push('| Data | Horas | Módulo |');
    lines.push('|------|-------|--------|');
    for (const mod of project.modules) {
      lines.push(`| ${mod.workDate} | ${mod.hours}h | ${mod.name.replace(/\|/g, '\\|')} |`);
    }
    lines.push('');
  }

  const unmapped = new Set();
  const reportPath = path.join(ROOT, rules.reportPath);
  const raw = fs.readFileSync(reportPath, 'utf8');
  const projectHeaders = [...raw.matchAll(/^#### (.+?) \("/gm)].map((m) => normalizeText(m[1]));
  for (const name of new Set(projectHeaders)) {
    if (!resolveMapping(name) && !mappingConfig.skipReportProjects.includes(name)) {
      unmapped.add(name);
    }
  }
  if (unmapped.size) {
    lines.push('## Projetos no relatório sem mapeamento (ignorados)');
    for (const name of [...unmapped].sort()) {
      lines.push(`- ${name}`);
    }
  }

  return lines.join('\n');
}

function main() {
  const reportPath = path.join(ROOT, rules.reportPath);
  const content = fs.readFileSync(reportPath, 'utf8');
  const buckets = parseRelatorio(content);
  const manifest = buildManifest(buckets);
  const preview = buildPreview(manifest, buckets);

  const previewPath = path.join(ROOT, rules.previewPath);
  fs.writeFileSync(previewPath, preview, 'utf8');
  console.log(`Preview: ${previewPath}`);

  if (manifest.projects.length === 0) {
    console.error('Nenhum módulo gerado. Verifique mapeamento e filtros.');
    process.exit(1);
  }

  if (dryRun) {
    console.log('\n' + preview.split('\n').slice(0, 30).join('\n'));
    console.log('\n... (dry-run — devlog.json não foi escrito)');
    return;
  }

  const outputPath = path.join(ROOT, rules.outputPath);
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`Manifesto: ${outputPath}`);
  console.log(`Projetos: ${manifest.projects.length}`);
  console.log(
    `Módulos: ${manifest.projects.reduce((s, p) => s + p.modules.length, 0)}`,
  );
}

main();
