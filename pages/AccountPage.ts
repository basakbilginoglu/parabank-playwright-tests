
import { type Page, type Locator } from '@playwright/test';

export class AccountPage {
  readonly page: Page;
  readonly accountsTable: Locator;
  readonly accountLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountsTable = page.locator('#accountTable');
    this.accountLinks = page.locator(
      '#accountTable tbody a[href*="activity.htm?id="]'
    );
  }

  async goto(): Promise<void> {
    await this.page.goto('/overview.htm');
  }

  getAccountLink(accountId: string): Locator {
    return this.page.locator(
      `#accountTable tbody a[href="activity.htm?id=${accountId}"]`
    );
  }
}
