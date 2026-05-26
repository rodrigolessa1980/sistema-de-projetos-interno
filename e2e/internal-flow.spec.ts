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
