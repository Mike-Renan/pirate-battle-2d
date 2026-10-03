import { test, expect } from '@playwright/test';

test.describe('Pirate Battle 2D - Testes de Integração e E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Acessa a aplicação local
    await page.goto('http://localhost:5173');
  });

  test('Deve carregar o Menu Principal com título e opções', async ({ page }) => {
    // Verifica elementos do menu inicial
    await expect(page.getByRole('button', { name: 'PLAY' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'OPTIONS' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'RANKING' })).toBeVisible();
  });

  test('Deve iniciar a partida e permitir a pausa do jogo', async ({ page }) => {
    // Inicia o jogo
    await page.click('text=PLAY');

    // Aguarda montagem do canvas do PixiJS
    await page.waitForTimeout(1000);

    // Clica no botão de pausa no HUD
    const pauseBtn = page.getByRole('button', { name: 'Pause' });
    await expect(pauseBtn).toBeVisible();
    await pauseBtn.click();

    // Valida abertura do Modal de Pausa com as 3 opções
    await expect(page.getByText('PAUSED')).toBeVisible();
    await expect(page.getByRole('button', { name: 'RESUME' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'OPTIONS' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'MAIN MENU' })).toBeVisible();
  });

  test('Deve navegar pelas opções do menu e alterar o tempo de partida', async ({ page }) => {
    await page.click('text=OPTIONS');
    await expect(page.getByText('CONFIGURAÇÕES')).toBeVisible();

    // Altera seleção do tempo de sessão
    const select = page.getByRole('combobox');
    await select.selectOption('120');

    // Retorna ao menu
    await page.click('text=BACK');
    await expect(page.getByRole('button', { name: 'PLAY' })).toBeVisible();
  });

  test('Deve retornar ao menu principal através do modal de pausa', async ({ page }) => {
    await page.click('text=PLAY');
    await page.waitForTimeout(500);

    // Abre a pausa e clica para retornar ao menu
    await page.getByRole('button', { name: 'Pause' }).click();
    await page.click('text=MAIN MENU');

    // Confirma que voltou para a tela inicial do menu
    await expect(page.getByRole('button', { name: 'PLAY' })).toBeVisible();
  });
});