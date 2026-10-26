
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TransferPage } from '../pages/TransferPage';

test('UI-05 - Transfer to the same account', async ({ page }) => {
  const username = process.env.PARABANK_USERNAME;
  const password = process.env.PARABANK_PASSWORD;

  if (!username || !password) {
    throw new Error(
      'Set PARABANK_USERNAME and PARABANK_PASSWORD before running this test.'
    );
  }

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(username, password);
  await loginPage.expectLoggedIn();

  const transferPage = new TransferPage(page);
  await transferPage.goto();

  const accounts = await transferPage.getAccountOptions();
  const accountId = accounts.from.find((id) =>
    accounts.to.includes(id)
  );

  if (!accountId) {
    throw new Error('No common account found in transfer dropdowns.');
  }

  await transferPage.transfer('2.00', accountId, accountId);

  await transferPage.expectTransferCompleted(
    '1.00',
    accountId,
    accountId
  );
});
