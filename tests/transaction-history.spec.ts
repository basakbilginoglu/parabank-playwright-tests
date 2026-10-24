import { test, expect } from './fixtures';
import { AccountPage } from '../pages/AccountPage';
import { ActivityPage } from '../pages/ActivityPage';
import { TransferPage } from '../pages/TransferPage';
import { chooseDistinctAccounts, getTransferTestData } from '../test-data/accounts';

test('UI-03: a completed transfer is represented in the destination account activity', async ({ page, loggedInPage }) => {
  void loggedInPage;

  // Transfer and history verification are one workflow because the history assertion
  // depends on the transaction created by this test.
  const accountPage = new AccountPage(page);
  await accountPage.goto();
  await accountPage.expectVisibleAccounts();

  const data = getTransferTestData();
  const { fromAccountId, toAccountId } = chooseDistinctAccounts(
    await accountPage.getAccountIds(),
    data.fromAccountId,
    data.toAccountId
  );

  const transferPage = new TransferPage(page);
  await transferPage.goto();
  await transferPage.transfer(data.amount, fromAccountId, toAccountId);
  await transferPage.expectTransferCompleted(data.amount, fromAccountId, toAccountId);

  const activityPage = new ActivityPage(page);
  await activityPage.goto(toAccountId);
  await activityPage.expectTransactionTable();

  const rows = activityPage.getTransactionRows();
  await expect(rows).not.toHaveCount(0);
  await expect(rows.filter({ hasText: data.amount })).not.toHaveCount(0);
});
