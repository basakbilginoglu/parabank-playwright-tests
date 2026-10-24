import { test, expect } from './fixtures';
import { AccountPage } from '../pages/AccountPage';

test('UI-01: signed-in user can see identifiable account IDs', async ({ page, loggedInPage }) => {
  void loggedInPage;
  const accounts = new AccountPage(page);
  await accounts.goto();
  await accounts.expectVisibleAccounts();

  const accountIds = await accounts.getAccountIds();
  expect(accountIds.length, 'At least one account ID should be visible').toBeGreaterThan(0);
  expect(new Set(accountIds).size, 'Account IDs should be unique').toBe(accountIds.length);
});
