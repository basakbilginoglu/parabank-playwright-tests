import { expect, type Locator, type Page } from '@playwright/test';

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
    this.transferButton = page.locator('input[type="submit"][value="Transfer"]');
    this.transferResult = page.locator('#showResult');
    this.resultHeading = this.transferResult.locator('h1.title');
    this.amountResult = page.locator('#amountResult');
    this.fromAccountResult = page.locator('#fromAccountIdResult');
    this.toAccountResult = page.locator('#toAccountIdResult');
  }

  async goto(): Promise<void> {
    await this.page.goto('transfer.htm');
    await expect(this.amountInput).toBeVisible();
    await expect(this.fromAccountSelect).toBeVisible();
    await expect(this.toAccountSelect).toBeVisible();
  }

  async getAccountOptions(): Promise<{ from: string[]; to: string[] }> {
    const values = async (select: Locator): Promise<string[]> =>
      select.locator('option').evaluateAll((options) =>
        options
          .map((option) => (option as HTMLOptionElement).value)
          .filter((value) => value.length > 0)
      );

    return {
      from: await values(this.fromAccountSelect),
      to: await values(this.toAccountSelect)
    };
  }

  async transfer(amount: string, fromAccountId: string, toAccountId: string): Promise<void> {
    await this.amountInput.fill(amount);

    // Assert the exact account options exist before selecting them.
    await expect(
      this.fromAccountSelect.locator(`option[value="${fromAccountId}"]`)
    ).toBeAttached();
    await expect(
      this.toAccountSelect.locator(`option[value="${toAccountId}"]`)
    ).toBeAttached();

    await this.fromAccountSelect.selectOption(fromAccountId);
    await this.toAccountSelect.selectOption(toAccountId);
    await this.transferButton.click();
  }

  async expectTransferCompleted(
    amount: string,
    fromAccountId: string,
    toAccountId: string
  ): Promise<void> {
    await expect(this.resultHeading).toHaveText(/Transfer Complete!/i);
    await expect(this.amountResult).toContainText(amount);
    await expect(this.fromAccountResult).toContainText(fromAccountId);
    await expect(this.toAccountResult).toContainText(toAccountId);
  }
}
