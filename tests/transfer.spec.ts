import { test, expect } from './fixtures';
import { AccountPage } from '../pages/AccountPage';
import { TransferPage } from '../pages/TransferPage';
import { chooseDistinctAccounts, getTransferTestData } from '../test-data/accounts';

test('UI-02: transfer reports the selected accounts and amount', async ({ page, loggedInPage }) => {
  void loggedInPage;
  const accountPage = new AccountPage(page);
  await accountPage.goto();
  await accountPage.expectVisibleAccounts();

  const data = getTransferTestData();
  const accounts = chooseDistinctAccounts(
    await accountPage.getAccountIds(),
    data.fromAccountId,
    data.toAccountId
  );

  const transferPage = new TransferPage(page);
  await transferPage.goto();

  const options = await transferPage.getAccountOptions();
  expect(options.from, 'Source account dropdown should contain account options').toContain(accounts.fromAccountId);
  expect(options.to, 'Destination account dropdown should contain account options').toContain(accounts.toAccountId);

  await transferPage.transfer(data.amount, accounts.fromAccountId, accounts.toAccountId);
  await transferPage.expectTransferCompleted(data.amount, accounts.fromAccountId, accounts.toAccountId);
});
