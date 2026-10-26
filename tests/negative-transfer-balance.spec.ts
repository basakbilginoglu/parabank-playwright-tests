
import { test, expect } from './fixtures';
import { AccountPage } from '../pages/AccountPage';
import { TransferPage } from '../pages/TransferPage';
import {
  chooseDistinctAccounts,
  getTransferTestData,
} from '../test-data/accounts';

test('UI-06: known defect — negative transfer changes account balances', async ({
  page,
  loggedInPage,
}) => {
  test.fail(
    true,
    'Known application defect: negative transfers change account balances.',
  );

  void loggedInPage;

  const accountPage = new AccountPage(page);
  await accountPage.goto();
  await accountPage.expectVisibleAccounts();

  const data = getTransferTestData();
  const { fromAccountId, toAccountId } = chooseDistinctAccounts(
    await accountPage.getAccountIds(),
    data.fromAccountId,
    data.toAccountId,
  );

  const fromBalanceBefore =
    await accountPage.getAccountBalance(fromAccountId);
  const toBalanceBefore =
    await accountPage.getAccountBalance(toAccountId);

  const transferPage = new TransferPage(page);
  await transferPage.goto();
  await transferPage.transfer('-1.00', fromAccountId, toAccountId);

  await accountPage.goto();

  const fromBalanceAfter =
    await accountPage.getAccountBalance(fromAccountId);
  const toBalanceAfter =
    await accountPage.getAccountBalance(toAccountId);

  // Expected behavior: a rejected negative transfer must not change balances.
  expect(fromBalanceAfter).toBe(fromBalanceBefore);
  expect(toBalanceAfter).toBe(toBalanceBefore);
});
