
import { type Locator, type Page } from '@playwright/test';

export class TransferPage {
  readonly amountInput: Locator;
  readonly fromAccountSelect: Locator;
  readonly toAccountSelect: Locator;
  readonly transferButton: Locator;

  readonly transferResult: Locator;
  readonly resultHeading: Locator;
  readonly amountResult: Locator;
  readonly fromAccountResult: Locator;
  readonly toAccountResult: Locator;

  constructor(private readonly page: Page) {
    this.amountInput = page.locator('#amount');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.toAccountSelect = page.locator('#toAccountId');

    this.transferButton = page.locator(
      'input[type="submit"][value="Transfer"]'
    );

    this.transferResult = page.locator('#showResult');
    this.resultHeading = this.transferResult.locator('h1.title');
    this.amountResult = page.locator('#amountResult');
    this.fromAccountResult = page.locator('#fromAccountIdResult');
    this.toAccountResult = page.locator('#toAccountIdResult');
  }

  async goto(): Promise<void> {
    await this.page.goto('transfer.htm');
  }

  async transfer(
    amount: string,
    fromAccountId: string,
    toAccountId: string
  ): Promise<void> {
    await this.amountInput.fill(amount);
    await this.fromAccountSelect.selectOption(fromAccountId);
    await this.toAccountSelect.selectOption(toAccountId);
    await this.transferButton.click();
  }
}
