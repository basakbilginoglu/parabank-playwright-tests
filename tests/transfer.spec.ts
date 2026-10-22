
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TransferPage } from '../pages/TransferPage';
import { credentials } from '../test-data/credentials';

test('UI-02: User can transfer funds between accounts', async ({ page }) => {
  const { username, password } = credentials;

  expect(username, 'PARABANK_USERNAME must be configured').toBeTruthy();
  expect(password, 'PARABANK_PASSWORD must be configured').toBeTruthy();

  const loginPage = new LoginPage(page);
  const transferPage = new TransferPage(page);

  await loginPage.goto();
  await loginPage.login(username!, password!);

  await expect(page).toHaveURL(/\/overview\.htm$/);

  await transferPage.goto();
  await expect(transferPage.amountInput).toBeVisible();

  await transferPage.transfer('100', '13566', '13788');

  await expect(transferPage.resultHeading).toHaveText('Transfer Complete!');
  await expect(transferPage.amountResult).toHaveText('$100.00');
  await expect(transferPage.fromAccountResult).toHaveText('13566');
  await expect(transferPage.toAccountResult).toHaveText('13788');
});
