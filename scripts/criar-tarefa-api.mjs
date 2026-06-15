#!/usr/bin/env node
/**
 * Teste prático: criar uma tarefa no DevFlow via API, usando um token df_...
 *
 * Pré-requisitos:
 *   - Backend rodando (padrão http://localhost:4011/api)
 *   - Um token de API criado em /profile → aba "API" (com escopo tasks:create
 *     e, para a descoberta automática, projects:read, modules:read, epics:read,
 *     users:read — ou marque "Usar todas as minhas permissões").
 *
 * Uso (PowerShell):
 *   $env:DEVFLOW_TOKEN="df_xxxxx"; node scripts/criar-tarefa-api.mjs            # cria 1 tarefa de teste
 *   $env:DEVFLOW_TOKEN="df_xxxxx"; node scripts/criar-tarefa-api.mjs --listar   # só lista IDs disponíveis
 *
 * Uso (bash):
 *   DEVFLOW_TOKEN=df_xxxxx node scripts/criar-tarefa-api.mjs
 *
 * Variáveis opcionais:
 *   DEVFLOW_API     base da API           (padrão http://localhost:4011/api)
 *   DEVFLOW_PROJECT nome (ou parte) do projeto alvo (padrão: primeiro projeto)
 *   DEVFLOW_TITULO  título da tarefa      (padrão: "Tarefa via API - <timestamp>")
 */

const API = (process.env.DEVFLOW_API ?? 'http://localhost:4011/api').replace(/\/$/, '');
const TOKEN = process.env.DEVFLOW_TOKEN ?? process.argv.find((a) => a.startsWith('df_'));
const LISTAR = process.argv.includes('--listar');
const PROJECT_FILTER = process.env.DEVFLOW_PROJECT;

if (!TOKEN) {
  console.error('\n❌ Faltou o token. Defina DEVFLOW_TOKEN ou passe df_... como argumento.\n');
  console.error('   Ex (PowerShell):  $env:DEVFLOW_TOKEN="df_xxx"; node scripts/criar-tarefa-api.mjs');
  process.exit(1);
}

async function call(method, path, body) {
  const res = await fetch(`${API}/${path.replace(/^\//, '')}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const msg = data?.message ?? data ?? res.statusText;
    throw new Error(`${method} ${path} → ${res.status}: ${Array.isArray(msg) ? msg.join('; ') : msg}`);
  }
  return data;
}

function pick(arr, label) {
  if (!arr || arr.length === 0) throw new Error(`Nenhum ${label} encontrado/acessível com este token.`);
  return arr;
}

async function main() {
  console.log(`\n🔗 API: ${API}`);
  console.log(`🔑 Token: ${TOKEN.slice(0, 12)}…\n`);

  // 1) Projetos
  const projects = pick(await call('GET', 'projects'), 'projeto');
  const project = PROJECT_FILTER
    ? projects.find((p) => p.name.toLowerCase().includes(PROJECT_FILTER.toLowerCase()))
    : projects[0];
  if (!project) throw new Error(`Projeto contendo "${PROJECT_FILTER}" não encontrado.`);
  console.log(`📁 Projeto: ${project.name}  (${project.id})`);

  // 2) Módulos do projeto
  const modulesResp = await call('GET', `projects/${project.id}/modules`);
  const modules = pick(modulesResp.modules ?? modulesResp, 'módulo');
  const module = modules[0];
  console.log(`📦 Módulo:  ${module.name}  (${module.id})`);

  // 3) Épicos do projeto (a tarefa exige epicId)
  const epicsResp = await call('GET', `projects/${project.id}/epics`);
  const epics = pick(epicsResp.epics ?? epicsResp, 'épico');
  const epic = epics.find((e) => e.moduleId === module.id) ?? epics[0];
  console.log(`🏷️  Épico:   ${epic.name}  (${epic.id})`);

  // 4) Usuário (assignee/reporter)
  const usersResp = await call('GET', 'users');
  const users = pick(usersResp.users ?? usersResp, 'usuário');
  const assignee = users[0];
  console.log(`👤 Responsável: ${assignee.name}  (${assignee.id})`);

  if (LISTAR) {
    console.log('\n✅ Modo --listar: nenhuma tarefa foi criada. IDs acima prontos para uso.\n');
    return;
  }

  // 5) Criar a tarefa
  const titulo = process.env.DEVFLOW_TITULO ?? `Tarefa via API - ${new Date().toISOString()}`;
  const payload = {
    projectId: project.id,
    moduleId: module.id,
    epicId: epic.id,
    title: titulo,
    description: 'Tarefa criada automaticamente pelo script de teste da API.',
    assigneeId: assignee.id,
    reporterId: assignee.id,
    complexity: 1,
    estimatedHours: 1,
    status: 'BACKLOG',
  };

  console.log('\n📤 POST /tasks com:');
  console.log(JSON.stringify(payload, null, 2));

  const task = await call('POST', 'tasks', payload);
  console.log('\n✅ Tarefa criada com sucesso!');
  console.log(`   id:     ${task.id}`);
  console.log(`   título: ${task.title}`);
  console.log(`   status: ${task.status}`);
  console.log(`\n   Veja na interface em: /tasks/${task.id}\n`);
}

main().catch((err) => {
  console.error(`\n❌ ${err.message}\n`);
  process.exit(1);
});
