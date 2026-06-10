import { expect, type Page, test } from "@playwright/test";

async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  // The dev server can serve prerendered HTML before client handlers hydrate on a cold compile.
  await page.waitForTimeout(500);
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

test.describe("fluxo interno administrativo", () => {
  test.beforeEach(async ({ page }) => {
    await login(
      page,
      process.env.E2E_ADMIN_EMAIL ?? "benitesjenifer44@gmail.com",
      process.env.E2E_ADMIN_PASSWORD ?? "admin123"
    );
  });

  test("atalho de busca, perfil e notificacao relacionada navegam", async ({ page }) => {
    await page.keyboard.press("Control+K");
    await expect(page.getByPlaceholder("Pesquisar tarefas, projetos...")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByPlaceholder("Pesquisar tarefas, projetos...")).toBeHidden();

    await page.getByRole("link", { name: "Abrir perfil" }).click();
    await expect(page).toHaveURL(/\/profile$/);

    await page.getByRole("button", { name: "Abrir notificacoes" }).click();
    await expect(page.getByText("Projeto atualizado").first()).toBeAttached();
    await page.getByText("Projeto atualizado").first().click();
    await expect(page).toHaveURL(/\/projects\/.+/);
  });

  test("kanban exibe todos os estados do fluxo", async ({ page }) => {
    await page.goto("/kanban");
    await expect(page.getByText("Bloqueada", { exact: true })).toBeVisible();
    await expect(page.getByText("Cancelada", { exact: true })).toBeVisible();
  });

  test("kanban fixa tarefa movida de bloqueada para planejada apos reload", async ({ page }) => {
    await page.goto("/kanban");

    const sourceStatuses = [
      "BLOQUEADA",
      "BACKLOG",
      "EM_DESENVOLVIMENTO",
      "EM_REVISAO",
      "HOMOLOGACAO",
      "CONCLUIDA",
      "CANCELADA",
    ];
    let sourceCard = page.locator("[data-task-id]").first();
    for (const status of sourceStatuses) {
      const candidates = page.locator(`[data-kanban-status="${status}"] [data-task-id]`);
      if ((await candidates.count()) > 0) {
        sourceCard = candidates.first();
        break;
      }
    }
    const plannedColumn = page.locator('[data-kanban-status="PLANEJADA"]');
    const taskId = await sourceCard.getAttribute("data-task-id");
    if (!taskId) throw new Error("Nao foi possivel localizar uma tarefa para mover no Kanban");
    const source = await sourceCard.boundingBox();
    const target = await plannedColumn.boundingBox();
    if (!source || !target) throw new Error("Nao foi possivel localizar cartao ou coluna no Kanban");

    await page.mouse.move(source.x + source.width / 2, source.y + source.height / 2);
    await page.mouse.down();
    await page.mouse.move(source.x + source.width / 2 + 12, source.y + source.height / 2, { steps: 3 });
    await page.mouse.move(target.x + target.width / 2, target.y + 80, { steps: 20 });
    await page.mouse.up();

    await expect(plannedColumn.locator(`[data-task-id="${taskId}"]`)).toBeVisible();
    await page.reload();
    await expect(plannedColumn.locator(`[data-task-id="${taskId}"]`)).toBeVisible();
  });

  test("alternador de ambiente troca a interface para o modo claro", async ({ page }) => {
    const documentRoot = page.locator("html");
    const canvas = page.locator("main");

    await expect(documentRoot).toHaveClass(/dark/);
    const darkBackground = await canvas.evaluate((element) => getComputedStyle(element).backgroundColor);

    await page.getByRole("button", { name: "Ativar modo claro" }).click();

    await expect(documentRoot).toHaveClass(/light/);
    await expect(page.getByRole("button", { name: "Ativar modo escuro" })).toBeVisible();
    const lightBackground = await canvas.evaluate((element) => getComputedStyle(element).backgroundColor);
    expect(lightBackground).not.toBe(darkBackground);
  });

  test("administrador cria projeto sem preencher campos obrigatorios", async ({ page }) => {
    await page.goto("/projects");
    await page.getByRole("button", { name: "Novo Projeto" }).click();
    const dialog = page.getByRole("dialog", { name: "Novo Projeto" });
    await expect(dialog).toBeVisible();

    const createResponsePromise = page.waitForResponse((response) =>
      response.url().endsWith("/api/projects") && response.request().method() === "POST"
    );
    await dialog.getByRole("button", { name: /^Criar Projeto/ }).click();
    const createResponse = await createResponsePromise;
    if (!createResponse.ok()) {
      throw new Error(`Falha ao criar projeto vazio: ${createResponse.status()} ${await createResponse.text()}`);
    }

    await expect(dialog).toBeHidden();
    await expect(page.getByText(/Projeto \d{2}\/\d{2}\/\d{4}/).first()).toBeVisible();
  });

  test("administrador cria epic com dados padrao e visualiza no front", async ({ page, request }) => {
    await page.goto("/epics");
    const session = await page.evaluate(() => JSON.parse(localStorage.getItem("devflow_session") || "null"));
    const headers = { Authorization: `Bearer ${session.token}` };
    const projectsResponse = await request.get("http://localhost:4011/api/projects", { headers });
    expect(projectsResponse.ok()).toBeTruthy();
    const projects = await projectsResponse.json();
    let project = projects[0];
    let projectModule;
    for (const candidate of projects) {
      const modulesResponse = await request.get(`http://localhost:4011/api/projects/${candidate.id}/modules`, { headers });
      expect(modulesResponse.ok()).toBeTruthy();
      const modulesBody = await modulesResponse.json();
      if (modulesBody.modules.length > 0) {
        project = candidate;
        projectModule = modulesBody.modules[0];
        break;
      }
    }
    if (!projectModule) throw new Error("Nenhum modulo disponivel para criar epic");
    const epicName = `Epic E2E ${Date.now()}`;

    const createResponse = await request.post("http://localhost:4011/api/epics", {
      headers,
      data: {
        projectId: project.id,
        moduleId: projectModule.id,
        name: epicName,
      },
    });
    expect(createResponse.ok()).toBeTruthy();

    await page.reload();
    await expect(page.getByText(epicName)).toBeVisible();
  });
});

test("desenvolvedor nao visualiza notificacoes administrativas", async ({ page }) => {
  await login(
    page,
    process.env.E2E_DEVELOPER_EMAIL ?? "benitesjenifer605@gmail.com",
    process.env.E2E_DEVELOPER_PASSWORD ?? "dev123"
  );
  await page.getByRole("button", { name: "Abrir notificacoes" }).click();
  await expect(page.getByText("Projeto atualizado")).toHaveCount(0);
});
