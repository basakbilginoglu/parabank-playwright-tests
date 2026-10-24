import { expect, type Locator, type Page } from '@playwright/test';

export class ActivityPage {
  readonly transactionTable: Locator;
  readonly accountActivityTitle: Locator;

  constructor(private readonly page: Page) {
    this.transactionTable = page.locator('#transactionTable');
    this.accountActivityTitle = page.getByRole('heading', {
    name: 'Account Activity',
    level: 1,
});
  }

  async goto(accountId: string): Promise<void> {
    await this.page.goto(`activity.htm?id=${encodeURIComponent(accountId)}`);
    await expect(this.accountActivityTitle).toBeVisible();
  }

  async expectTransactionTable(): Promise<void> {
    await expect(this.transactionTable).toBeVisible();
  }

  getTransactionRows(): Locator {
    return this.transactionTable.locator('tbody tr');
  }
}
