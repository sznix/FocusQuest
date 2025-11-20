import { test, expect } from '@playwright/test';

test.describe('FocusQuest Flow', () => {
  test('should allow creating, moving, and deleting a quest', async ({ page }) => {
    // 1. Navigate to home
    await page.goto('/');

    // 2. Verify title
    await expect(page.getByRole('heading', { name: 'FocusQuest' })).toBeVisible();

    // 3. Create a new quest
    // Note: The label logic might need specific targeting if "Quest Title" text is inside a span
    // but Playwright usually finds it if it's associated via nesting or `for` attribute.
    // Our QuestForm has <label> ... <span>Quest Title</span> <input ...> </label> which is valid.
    await page.getByLabel('Quest Title').fill('Test Quest 1');
    await page.getByLabel('Details').fill('Test Description');

    await page.getByRole('button', { name: 'Embark' }).click();

    // 4. Verify it appears in Backlog (Column Title: "Quest Board")
    const backlogColumn = page.locator('article').filter({ hasText: 'Quest Board' });
    await expect(backlogColumn.getByText('Test Quest 1')).toBeVisible();
    await expect(backlogColumn.getByText('Test Description')).toBeVisible();

    // 5. Move to Doing (Button: "Accept")
    await backlogColumn.getByRole('button', { name: 'Accept' }).click();

    // Column Title: "Current Adventure"
    const doingColumn = page.locator('article').filter({ hasText: 'Current Adventure' });
    await expect(doingColumn.getByText('Test Quest 1')).toBeVisible();
    await expect(backlogColumn.getByText('Test Quest 1')).not.toBeVisible();

    // 6. Move to Done (Button: "Conquer")
    await doingColumn.getByRole('button', { name: 'Conquer' }).click();

    // Column Title: "Conquered Legends"
    const doneColumn = page.locator('article').filter({ hasText: 'Conquered Legends' });
    await expect(doneColumn.getByText('Test Quest 1')).toBeVisible();

    // 7. Delete (Button: "Abandon")
    await doneColumn.getByRole('button', { name: 'Abandon' }).click();
    await expect(doneColumn.getByText('Test Quest 1')).not.toBeVisible();
  });
});
