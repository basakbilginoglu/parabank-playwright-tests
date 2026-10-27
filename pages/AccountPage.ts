
import { expect, type Locator, type Page } from '@playwright/test';

export class AccountPage {
  readonly accountsTable: Locator;
  readonly accountLinks: Locator;

  constructor(private readonly page: Page) {
    this.accountsTable = page.locator('#accountTable');
    this.accountLinks = page.locator(
      '#accountTable tbody a[href*="activity.htm?id="]'
    );
  }

  async goto(): Promise<void> {
    await this.page.goto('overview.htm');
  }

  async expectVisibleAccounts(): Promise<void> {
    await expect(this.accountsTable).toBeVisible();

    await expect(
      this.accountLinks,
      'At least one account link should exist'
    ).not.toHaveCount(0, { timeout: 15000 });
  }

  async getAccountIds(): Promise<string[]> {
    await expect(
      this.accountLinks,
      'At least one account link should exist'
    ).not.toHaveCount(0, { timeout: 15000 });

    const hrefs = await this.accountLinks.evaluateAll((links) =>
      links.map((link) =>
        (link as HTMLAnchorElement).getAttribute('href') ?? ''
      )
    );

    return hrefs
      .map((href) => href.match(/[?&]id=(\d+)/)?.[1])
      .filter((id): id is string => Boolean(id));
  }

  getAccountLink(accountId: string): Locator {
    return this.page.locator(
      `#accountTable tbody a[href="activity.htm?id=${accountId}"]`
    );
  }

  async getAccountBalance(accountId: string): Promise<number> {
    const row = this.getAccountLink(accountId).locator('xpath=ancestor::tr[1]');

    await expect(row).toBeVisible();

    const balanceText = await row.locator('td').nth(2).innerText();

    const balance = Number(balanceText.replace(/[$,]/g, '').trim());

    expect(Number.isFinite(balance)).toBeTruthy();

    return balance;
  }
}
