
import { type Locator, type Page } from '@playwright/test';

export class AccountActivityPage {
  readonly transactionsTable: Locator;
  readonly transactionRows: Locator;

  constructor(private readonly page: Page) {
    this.transactionsTable = page.locator('#transactionTable');
    this.transactionRows = this.transactionsTable.locator('tbody tr');
  }

  async goto(accountId: string): Promise<void> {
    await this.page.goto(`activity.htm?id=${accountId}`);
  }

  getSentTransferRowsByDebitAmount(amount: string): Locator {
    return this.transactionRows.filter({
      has: this.page.locator(
        `a[href*="transaction.htm"]:text-is("Funds Transfer Sent")`
      ),
    }).filter({
      has: this.page.locator(`td:nth-child(3):text-is("${amount}")`),
    });
  }


   getReceivedTransferRowsByCreditAmount(amount: string): Locator {
    return this.transactionRows.filter({
      has: this.page.locator(
        'a[href*="transaction.htm"]:text-is("Funds Transfer Received")'
      ),
    }).filter({
      has: this.page.locator(`td:nth-child(4):text-is("${amount}")`),
    });
 }

}
