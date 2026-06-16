const fs = require('fs');
const text = fs.readFileSync('relatorio.md', 'utf8');

const summaryMatch = text.match(/### Por projeto\n\n\| Projeto[\s\S]*?\n\n### Por mes/);
if (!summaryMatch) throw new Error('summary not found');
const rows = summaryMatch[0].split('\n').filter((l) => l.startsWith('|') && !l.includes('---'));
const report = new Map();
for (const row of rows) {
  const cols = row.split('|').map((s) => s.trim()).filter(Boolean);
  if (cols.length < 4 || cols[0] === 'Projeto') continue;
  const name = cols[0].replace(/\s*\([^)]*\)\s*$/, '').trim();
  const hours = parseFloat((cols[3].match(/[\d.]+/) || ['0'])[0]);
  report.set(name, (report.get(name) || 0) + hours);
}

const mapping = [
  ['FiscalMind (IA fiscal)', 'FiscalMind / Fluxograma de Produto'],
  ['Sistema de Projetos Interno', 'Sistema Interno de Tecnologia'],
  ['Controle de EPI', 'Sistema Controle de EPI'],
  ['Dashboard de Transporte / Frota', 'Dashboard Transporte'],
  ['ExpediÃ§Ã£o', 'Exportação de Madeira'],
  ['Expedição', 'Exportação de Madeira'],
  ['Site QuietArt (marketing)', 'QUIET ART'],
  ['Linha de ProduÃ§Ã£o Petkov', null],
  ['Linha de Produção Petkov', null],
  ['Agenda Sala de Reuniao (rodrigolessa1980)', null],
  ['Sala de Reuniao (Monkey-Branch)', null],
  ['Anomalias de Transporte', null],
  ['Rastreio de Container', null],
  ['Voda App', null],
  ['Planilha Dashboard', null],
];

const app = JSON.parse(fs.readFileSync('_app_projects.json', 'utf8'));

console.log('=== COMPARATIVO RELATORIO x DEVFLOW ===\n');
for (const [reportName, appName] of mapping) {
  const rh = report.get(reportName) ?? report.get(reportName.normalize('NFC')) ?? 0;
  if (!rh && !appName) continue;
  const ap = appName ? app.find((p) => p.name === appName) : null;
  const ah = ap?.timeLogHours ?? 0;
  console.log(`${reportName}`);
  console.log(`  Relatorio: ~${rh}h | App: ${ah}h | DevFlow: ${appName ?? 'SEM PROJETO'}`);
  if (ap) console.log(`  Status app: ${ap.status} | Modulos c/ hora: ${ap.modulesWithHours}/${ap.moduleCount}`);
  console.log('');
}

console.log('Projetos ATIVOS no app sem entrada clara no relatorio:');
for (const p of app.filter((x) => x.status === 'ATIVO')) {
  const mapped = mapping.some(([, n]) => n === p.name);
  if (!mapped && !p.name.startsWith('[TEST]')) {
    console.log(`  - ${p.name}: ${p.timeLogHours}h`);
  }
}
