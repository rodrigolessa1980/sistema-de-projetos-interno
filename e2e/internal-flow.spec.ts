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
    await login(page, "admin@devflow.com", "admin123");
  });

  test("atalho de busca, perfil e notificacao relacionada navegam", async ({ page }) => {
    await page.keyboard.press("Control+K");
    await expect(page.getByPlaceholder("Pesquisar tarefas, projetos...")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByPlaceholder("Pesquisar tarefas, projetos...")).toBeHidden();

    await page.getByRole("link", { name: "Abrir perfil" }).click();
    await expect(page).toHaveURL(/\/profile$/);

    await page.getByRole("button", { name: "Abrir notificacoes" }).click();
    await expect(page.getByText("Projeto atualizado")).toBeAttached();
    const taskNotification = page.getByText("Task atualizada");
    await taskNotification.scrollIntoViewIfNeeded();
    await taskNotification.click();
    await expect(page).toHaveURL(/\/tasks\/task-4$/);
  });

  test("kanban exibe todos os estados do fluxo", async ({ page }) => {
    await page.goto("/kanban");
    await expect(page.getByText("Bloqueada", { exact: true })).toBeVisible();
    await expect(page.getByText("Cancelada", { exact: true })).toBeVisible();
  });

  test("kanban fixa tarefa movida de bloqueada para planejada apos reload", async ({ page }) => {
    await page.goto("/kanban");

    const blockedCard = page.locator('[data-task-id="task-2"]');
    const plannedColumn = page.locator('[data-kanban-status="PLANEJADA"]');
    const source = await blockedCard.boundingBox();
    const target = await plannedColumn.boundingBox();
    if (!source || !target) throw new Error("Nao foi possivel localizar cartao ou coluna no Kanban");

    await page.mouse.move(source.x + source.width / 2, source.y + source.height / 2);
    await page.mouse.down();
    await page.mouse.move(source.x + source.width / 2 + 12, source.y + source.height / 2, { steps: 3 });
    await page.mouse.move(target.x + target.width / 2, target.y + 80, { steps: 20 });
    await page.mouse.up();

    await expect(plannedColumn.locator('[data-task-id="task-2"]')).toBeVisible();
    await page.reload();
    await expect(plannedColumn.locator('[data-task-id="task-2"]')).toBeVisible();
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

  test("administrador cria epic para habilitar novas tarefas", async ({ page }) => {
    await page.goto("/epics");
    await page.getByRole("button", { name: "Novo Epic" }).click();
    const dialog = page.getByRole("dialog", { name: "Novo Epic" });
    await expect(dialog).toBeVisible();

    await dialog.getByRole("combobox").nth(0).click();
    await page.getByRole("option", { name: "Plataforma E-commerce" }).click();
    await dialog.getByRole("combobox").nth(1).click();
    await page.getByRole("option", { name: /Carrinho/ }).click();
    await dialog.getByPlaceholder("Nome do epic").fill("Entrega E2E do fluxo");
    await dialog.getByPlaceholder("Objetivo e escopo do epic").fill("Validar a criacao de tarefas no fluxo interno.");
    await dialog.locator('input[type="date"]').nth(1).fill("2026-06-30");
    await dialog.getByRole("button", { name: "Criar Epic" }).click();

    await expect(page.getByText("Entrega E2E do fluxo")).toBeVisible();
  });
});

test("desenvolvedor nao visualiza notificacoes administrativas", async ({ page }) => {
  await login(page, "ana@devflow.com", "dev123");
  await page.getByRole("button", { name: "Abrir notificacoes" }).click();
  await expect(page.getByText("Projeto atualizado")).toHaveCount(0);
  await expect(page.getByText(/Nova task atribu/)).toBeAttached();
});
