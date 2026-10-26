
import { test, expect } from './fixtures';
import { AccountPage } from '../pages/AccountPage';
import { ActivityPage } from '../pages/ActivityPage';
import { TransferPage } from '../pages/TransferPage';
import {
  chooseDistinctAccounts,
  getTransferTestData,
} from '../test-data/accounts';

test('UI-07: known defect — negative transfer is recorded in transaction history', async ({
  page,
  loggedInPage,
}) => {
  // Known application defect:
  // ParaBank accepts negative transfer amounts and records them in history.
  // The assertions below preserve the expected business rules.
  // test.fail() marks the expected failure so the defect remains visible
  // without making the CI job fail when the defect is reproduced.
  test.fail(
    true,
    'Known application defect: negative transfers are accepted and recorded.',
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

  const activityPage = new ActivityPage(page);
  await activityPage.goto(toAccountId);
  await activityPage.expectTransactionTable();

  const rowsBefore = await activityPage.getTransactionRows().allInnerTexts();

  const transferPage = new TransferPage(page);
  await transferPage.goto();
  await transferPage.transfer('-1.00', fromAccountId, toAccountId);

  // Expected behavior: a negative transfer must not be completed.
  await expect(transferPage.resultHeading).not.toHaveText(
    /Transfer Complete!/i,
  );

  // Expected behavior: a rejected transfer must not create a transaction.
  await activityPage.goto(toAccountId);
  await activityPage.expectTransactionTable();

  const rowsAfter = await activityPage.getTransactionRows().allInnerTexts();

  expect(rowsAfter).toEqual(rowsBefore);
});
