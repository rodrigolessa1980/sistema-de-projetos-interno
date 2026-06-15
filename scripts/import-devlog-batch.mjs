#!/usr/bin/env node
/** Importa devlog.json projeto a projeto (mais estável em DB remoto). */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const backendRoot = path.join(root, 'backend');

const build = spawnSync('npm', ['run', 'build', '--silent'], {
  cwd: backendRoot,
  stdio: 'inherit',
  shell: true,
});
if (build.status !== 0) process.exit(build.status ?? 1);

const manifest = JSON.parse(fs.readFileSync(path.join(root, 'devlog.json'), 'utf8'));

let isFirstBatch = true;
for (const project of manifest.projects) {
  const slice = {
    cleanupProjects: isFirstBatch ? (manifest.cleanupProjects ?? []) : [],
    removeSeedModules: isFirstBatch ? manifest.removeSeedModules : false,
    removeSeedModulesForProjects: isFirstBatch && manifest.removeSeedModules
      ? manifest.projects.map((p) => p.name)
      : undefined,
    ownerEmail: manifest.ownerEmail,
    projects: [project],
  };
  isFirstBatch = false;
  const tempPath = path.join(root, '.devlog-partial.json');
  fs.writeFileSync(tempPath, JSON.stringify(slice, null, 2));

  console.log(`\n=== Importando: ${project.name} (${project.modules.length} módulos) ===`);
  const result = spawnSync(
    'node',
    ['dist/scripts/import-devlog.js'],
    {
      cwd: backendRoot,
      env: { ...process.env, DEVLOG_PATH: tempPath },
      stdio: 'inherit',
      shell: true,
    },
  );
  if (result.status !== 0) {
    console.error(`Falha em ${project.name}`);
    process.exit(result.status ?? 1);
  }
}

fs.unlinkSync(path.join(root, '.devlog-partial.json'));
console.log('\nImportação por projeto concluída.');
