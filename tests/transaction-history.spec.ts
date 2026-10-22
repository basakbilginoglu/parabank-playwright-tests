
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TransferPage } from '../pages/TransferPage';
import { AccountActivityPage } from '../pages/AccountActivityPage';
import { credentials } from '../test-data/credentials';

test('UI-03: Transferred funds appear in sender and recipient account activity', async ({ page }) => {
  const { username, password } = credentials;

  expect(username, 'PARABANK_USERNAME must be configured').toBeTruthy();
  expect(password, 'PARABANK_PASSWORD must be configured').toBeTruthy();

  const fromAccountId = '13566';
  const toAccountId = '13788';
  const amount = '100';
  const displayedAmount = '$100.00';

  const loginPage = new LoginPage(page);
  const transferPage = new TransferPage(page);
  const activityPage = new AccountActivityPage(page);

  // Log in
  await loginPage.goto();
  await loginPage.login(username!, password!);
  await expect(page).toHaveURL(/\/overview\.htm$/);

  // Count outgoing transfers before the transfer
  await activityPage.goto(fromAccountId);
  await expect(activityPage.transactionsTable).toBeVisible();

  const sentCountBefore = await activityPage
    .getSentTransferRowsByDebitAmount(displayedAmount)
    .count();

  // Count incoming transfers before the transfer
  await activityPage.goto(toAccountId);
  await expect(activityPage.transactionsTable).toBeVisible();

  const receivedCountBefore = await activityPage
    .getReceivedTransferRowsByCreditAmount(displayedAmount)
    .count();

  // Perform the transfer
  await transferPage.goto();
  await transferPage.transfer(amount, fromAccountId, toAccountId);
  await expect(transferPage.resultHeading).toHaveText('Transfer Complete!');

  // Verify the sender's activity
  await activityPage.goto(fromAccountId);

  await expect(
    activityPage.getSentTransferRowsByDebitAmount(displayedAmount)
  ).toHaveCount(sentCountBefore + 1);

  // Verify the recipient's activity
  await activityPage.goto(toAccountId);

  await expect(
    activityPage.getReceivedTransferRowsByCreditAmount(displayedAmount)
  ).toHaveCount(receivedCountBefore + 1);
});
