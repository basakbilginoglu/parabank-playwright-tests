
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AccountPage } from '../pages/AccountPage';
import { credentials } from '../test-data/credentials';

test('UI-01: User can log in and view account information', async ({ page }) => {
  const username = credentials.username;
  const password = credentials.password;

  expect(username, 'PARABANK_USERNAME must be configured').toBeTruthy();
  expect(password, 'PARABANK_PASSWORD must be configured').toBeTruthy();

  const loginPage = new LoginPage(page);
  const accountPage = new AccountPage(page);

  await loginPage.goto();
  await loginPage.login(username!, password!);

await expect(page).toHaveURL(
  'http://localhost:8080/parabank/overview.htm'
);
  await expect(
    page.getByRole('heading', { name: 'Accounts Overview' })
  ).toBeVisible();

  await expect(accountPage.accountsTable).toBeVisible();
  await expect(accountPage.accountLinks).not.toHaveCount(0);

  // Hesap kimliğini tablodaki gerçek hesap bağlantılarından al.
  const accountIds = await accountPage.accountLinks.allTextContents();
const accountId = accountIds
  .map((id) => id.trim())
  .find((id) => id !== '');

  expect(accountId, 'At least one account ID should be displayed').toBeTruthy();

  const accountLink = accountPage.getAccountLink(accountId!);
  await expect(accountLink).toBeVisible();
  await accountLink.click();

 await expect(page).toHaveURL(
  `http://localhost:8080/parabank/activity.htm?id=${accountId}`
);
});
