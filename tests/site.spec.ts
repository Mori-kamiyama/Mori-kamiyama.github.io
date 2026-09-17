import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdirSync } from 'node:fs';
const workRoutes = readdirSync('src/content/works').filter(f=>f.endsWith('.md')).map(f=>`/works/${f.slice(0,-3)}/`);
const blogRoutes = readdirSync('src/content/blog').filter(f=>f.endsWith('.md')).map(f=>`/blog/${f.slice(0,-3)}/`);
const routes = ['/', '/profile/', '/works/', '/blog/', ...workRoutes, ...blogRoutes];

test('skills motion can stop and resume, and reduced motion stays readable', async ({ page }) => {
  await page.goto('/');
  const tracks = page.locator('.marquee-track');
  await expect(tracks).toHaveCount(2);
  expect(await tracks.nth(0).evaluate(el => getComputedStyle(el).animationDirection)).toBe('normal');
  expect(await tracks.nth(1).evaluate(el => getComputedStyle(el).animationDirection)).toBe('reverse');
  await expect(page.locator('.marquee-group[aria-hidden="true"]')).toHaveCount(2);
  await page.getByRole('button', { name: 'スライドを停止', exact: true }).click();
  for (const track of await tracks.all()) expect(await track.evaluate(el => getComputedStyle(el).animationPlayState)).toBe('paused');
  await page.getByRole('button', { name: 'スライドを再開', exact: true }).click();
  for (const track of await tracks.all()) expect(await track.evaluate(el => getComputedStyle(el).animationPlayState)).toBe('running');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.motion-toggle')).toBeHidden();
  for (const track of await tracks.all()) expect(await track.evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  for (const group of await page.locator('.marquee-group[aria-hidden="true"]').all()) await expect(group).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('faded previews keep a visible route to complete content', async ({ page }) => {
  await page.goto('/');
  const preview = page.locator('.works-preview');
  expect(await preview.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);
  await page.keyboard.press('Tab');
  await preview.getByRole('link', { name: 'タスク処理支援LINE Botの詳細を見る' }).focus();
  expect(await preview.evaluate(el => getComputedStyle(el).maxHeight)).toBe('none');
  await expect(preview.getByRole('link', { name: 'タスク処理支援LINE Botの詳細を見る' })).toBeInViewport();
  await page.getByRole('link', { name: 'すべての作品を見る', exact: true }).click();
  await expect(page.locator('.work-card:visible')).toHaveCount(16);
  await page.goto('/blog/');
  const excerpt = page.locator('.blog-excerpt');
  expect(await excerpt.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);
  expect(await excerpt.evaluate(el => Math.abs(el.clientHeight / parseFloat(getComputedStyle(el).lineHeight) - 3))).toBeLessThan(0.05);
  await page.getByRole('link', { name: /続きを読む/ }).click();
  await expect(page).toHaveURL(/\/blog\/programming-with-ai\/$/);
  await expect(page.getByRole('heading', { name: '言語の壁が溶けるとき' })).toBeVisible();
});

test('all pages render, local assets load, and metadata is complete', async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('pageerror', e=>errors.push(e.message));
  page.on('response', response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(),route).toBe(200);
    await expect(page.locator('h1'),route).toHaveCount(1);
    await expect(page).toHaveTitle(/森川結太/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',/.+/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',`https://mori-kamiyama.github.io${route}`);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow on ${route}`).toBe(true);
    for (const image of await page.locator('img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(()=>image.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0),{message:`image failed on ${route}`}).toBe(true);
    }
  }
  expect(errors).toEqual([]);
});

test('category filters show matching works and can reset', async ({ page }) => {
  await page.goto('/works/');
  await expect(page.locator('.work-card:visible')).toHaveCount(16);
  for (const category of ['Program','Design','Management']) {
    await page.getByRole('button',{name:category,exact:true}).click();
    await expect(page.getByRole('button',{name:category,exact:true})).toHaveAttribute('aria-pressed','true');
    const visible = page.locator('.work-card:visible');
    expect(await visible.count()).toBeGreaterThan(0);
    for (const card of await visible.all()) expect((await card.getAttribute('data-categories'))?.split(' ')).toContain(category);
    await expect(page.getByRole('status')).toContainText(category);
  }
  await page.getByRole('button',{name:'All',exact:true}).click();
  await expect(page.locator('.work-card:visible')).toHaveCount(16);
});

test('navigation works with keyboard and the mobile menu closes', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    const toggle = page.getByRole('button',{name:'メニューを開く'});
    await toggle.click();
    await expect(page.locator('#mobile-menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-menu')).toBeHidden();
    await expect(toggle).toBeFocused();
    await toggle.click();
    await page.locator('#mobile-menu').getByRole('link',{name:'Works',exact:true}).click();
    await expect(page).toHaveURL(/\/works\/$/);
    await expect(page.locator('#mobile-menu')).toBeHidden();
  } else {
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link',{name:'本文へ移動'})).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.locator('#site-header')).toBeVisible();
    await page.locator('.desktop-nav').getByRole('link',{name:'Works',exact:true}).click();
    await expect(page).toHaveURL(/\/works\/$/);
  }
});

test('layout fits narrow phones, tablets and desktop', async ({ page }) => {
  test.setTimeout(90_000);
  for (const width of [320,375,412,768,1024,1512]) {
    await page.setViewportSize({width,height:900});
    for (const route of ['/', '/profile/', '/works/', '/works/portfolio/', '/blog/']) {
      await page.goto(route);
      await page.evaluate(()=>document.fonts.ready);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route} at ${width}px`).toBe(true);
    }
  }
});

test('legacy link redirects and not-found page offers recovery', async ({ page }) => {
  await page.goto('/1/');
  await expect(page).toHaveURL(/\/works\/portfolio\/$/);
  await page.goto('/404.html');
  await expect(page.getByRole('heading',{name:'ページが見つかりません。'})).toBeVisible();
  await page.getByRole('link',{name:'Homeに戻る'}).click();
  await expect(page.getByRole('heading',{name:'森川結太',exact:true})).toBeVisible();
});

for (const route of ['/', '/profile/', '/works/', '/works/portfolio/', '/blog/', ...blogRoutes, '/404.html']) {
  test(`accessibility: ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.evaluate(()=>document.fonts.ready);
    const results = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
  });
}
