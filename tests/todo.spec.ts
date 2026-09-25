import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('Can create todo', async ({ page }) => {
  const todoInput = page.locator('#new-todo-input');

  await todoInput.click();
  await todoInput.pressSequentially('Do 10 push ups');

  await page.getByRole('button', { name: 'Add' }).click();

  await expect(page.getByText('Do 10 push ups')).toBeVisible();
});

test('Can delete specific todo', async ({ page }) => {
  const todoInput = page.locator('#new-todo-input');

  await todoInput.click();
  await todoInput.pressSequentially('Do 10 push ups');
  await page.getByRole('button', { name: 'Add' }).click();

  expect(page.getByText('Do 10 push ups')).toBeVisible();

  await page.getByRole('button', { name: 'Delete' }).click();

  expect(page.getByText('Do 10 push ups')).not.toBeVisible();
});

test('filter todos by status', async ({ page }) => {
  const todoInput = page.locator('#new-todo-input');

  // Add First todo
  await todoInput.click();
  await todoInput.pressSequentially('Do 10 push ups');
  await page.getByRole('button', { name: 'Add' }).click();

  // Add Second todo
  await todoInput.click();
  await todoInput.pressSequentially('Learn about ER models');
  await page.getByRole('button', { name: 'Add' }).click();

  // Check all todos
  expect(page.getByText('Do 10 push ups')).toBeVisible();
  expect(page.getByText('Learn about ER models')).toBeVisible();

  // Complete 'Do 10 push ups' todo
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Do 10 push ups' })
    .getByRole('checkbox')
    .check();

  // Check active tabs
  await page.getByRole('button', { name: 'Active' }).click();

  expect(page.getByText('Do 10 push ups')).not.toBeVisible();
  expect(page.getByText('Learn about ER models')).toBeVisible();

  // Check completed tabs
  await page.getByRole('button', { name: 'Completed', exact: true }).click();
  page
    .getByRole('listitem')
    .filter({ hasText: 'Do 10 push ups' })
    .getByRole('checkbox')
    .check();

  await page.getByRole('button', { name: 'Completed', exact: true }).click();

  expect(page.getByText('Do 10 push ups')).toBeVisible();
  expect(page.getByText('Learn about ER models')).not.toBeVisible();
});
