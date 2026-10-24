import { test, expect } from './fixtures';
import { TransferPage } from '../pages/TransferPage';
import { AccountPage } from '../pages/AccountPage';
import { chooseDistinctAccounts, getTransferTestData } from '../test-data/accounts';

test('UI-04: negative transfer amount must not be reported as completed', async ({ page, loggedInPage }) => {
  test.fail(true, 'Known bug: ParaBank accepts negative transfer amounts.');
  void loggedInPage;

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
  await transferPage.transfer('-1.00', fromAccountId, toAccountId);

  // Business rule: a negative transfer must not be reported as completed.
  await expect(transferPage.resultHeading).not.toHaveText(/Transfer Complete!/i);
});