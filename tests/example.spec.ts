import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole('heading', { name: 'Installation' })
  ).toBeVisible();
});

test('Redirect to next.js docs', async ({ page }) => {
  await page.goto('/');

  const newPagePromise = page.waitForEvent('popup');

  await page.getByRole('link', { name: 'Documentation' }).click();

  const newPage = await newPagePromise;

  await expect(newPage).toHaveURL(
    'https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
  );
});
