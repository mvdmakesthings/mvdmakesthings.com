import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ['/', '/projects/', '/writing/', '/writing/how-this-site-is-built/', '/art/', '/resume/', '/404/'];

const explode = (page: Page) =>
  page.locator('[data-teardown]').evaluate((el) => Number(getComputedStyle(el).getPropertyValue('--explode')));

test('home renders the hero and the catalog', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('I take things apart');
  await expect(page.getByRole('img', { name: /Exploded view of a TV remote/ })).toBeVisible();
  await expect(page.locator('#made-title + ul > li')).toHaveCount(8);
  await expect(page.getByRole('link', { name: 'Work with me' }).first()).toHaveAttribute('href', '/resume/');
});

test('main navigation reaches every section', async ({ page, isMobile }) => {
  await page.goto('/');
  for (const [label, path, heading] of [
    ['Projects', '/projects/', 'Projects'],
    ['Writing', '/writing/', 'Writing'],
    ['Art', '/art/', 'Art'],
    ['Resume', '/resume/', 'Michael VanDyke'],
  ]) {
    if (isMobile) await page.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: label }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
  }
});

test('theme toggle persists across reloads and navigation', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'light');
  await page.locator('.site-header [data-theme-toggle]').click();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await page.goto('/projects/');
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('.site-header [data-theme-toggle]')).toHaveAttribute('aria-pressed', 'true');
});

test('the remote power button toggles the theme and blinks the LED', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  // The blink lasts 420ms, so record it rather than racing it.
  await page.locator('[data-led]').evaluate((led) => {
    new MutationObserver(() => {
      if (led.classList.contains('blink')) document.documentElement.dataset.blinked = 'yes';
    }).observe(led, { attributes: true });
  });
  // Hovering changes the explode amount, which moves the key; let it settle first.
  await page.waitForTimeout(1000);
  await page.locator('[data-power]').hover();
  await page.waitForTimeout(800);
  await page.locator('[data-power]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveAttribute('data-blinked', 'yes');
});

test('the teardown follows the pointer', async ({ page, isMobile }) => {
  test.skip(isMobile, 'pointer drives the desktop variant');
  await page.goto('/');
  await page.waitForTimeout(1100); // the one-time assembly
  const hero = (await page.locator('[data-hero]').boundingBox())!;
  await page.mouse.move(hero.x + hero.width * 0.95, hero.y + hero.height / 2, { steps: 4 });
  await expect.poll(() => explode(page)).toBeGreaterThan(0.9);
  await page.mouse.move(hero.x + 10, hero.y + hero.height / 2, { steps: 4 });
  await expect.poll(() => explode(page)).toBeLessThan(0.1);
});

test('the teardown follows scroll on touch screens', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'scroll drives the touch variant');
  await page.goto('/');
  await page.waitForTimeout(1100);
  const before = await explode(page);
  await page.locator('[data-teardown]').scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 300);
  await expect.poll(() => explode(page)).toBeGreaterThan(Math.max(before, 0.5));
});

test('reduced motion renders the teardown still and partly apart', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await explode(page)).toBeCloseTo(0.6, 2);
  await page.locator('[data-power]').click();
  await expect(page.locator('[data-led]')).not.toHaveClass(/blink/);
});

test('lightbox opens, moves with arrow keys, and closes with Escape', async ({ page }) => {
  await page.goto('/art/');
  const dialog = page.locator('[data-lightbox]');
  const first = page.locator('[data-gallery] a').first();
  await first.click();
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.lb-count')).toHaveText('1 of 3');
  await page.keyboard.press('ArrowRight');
  await expect(dialog.locator('.lb-count')).toHaveText('2 of 3');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await expect(dialog.locator('.lb-count')).toHaveText('3 of 3');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(first).toBeFocused();
});

test('unknown pages get the 404 page', async ({ page }) => {
  await page.goto('/no-such-part/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Missing part');
});

for (const path of pages) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${path} has no axe violations and no sideways scroll (${theme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' ')}`)).toEqual([]);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
}
