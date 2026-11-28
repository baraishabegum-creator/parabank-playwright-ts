import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class TransferPage extends BasePage {
  readonly amountInput: Locator;
  readonly fromAccountSelect: Locator;
  readonly toAccountSelect: Locator;
  readonly transferButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly amountError: Locator;

  constructor(page: Page) {
    super(page);
    this.amountInput = page.locator('#amount');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.toAccountSelect = page.locator('#toAccountId');
    this.transferButton = page.getByRole('button', { name: 'Transfer' });
    this.successMessage = page.locator('#showResult');
    this.errorMessage = page.locator('.error');
    this.amountError = page.locator('#amount.error, [id="amount"] + .error');
  }

  async transfer(amount: string, fromAccountId?: string, toAccountId?: string) {
    await this.amountInput.fill(amount);

    if (fromAccountId) {
      await this.fromAccountSelect.selectOption(fromAccountId);
    }

    if (toAccountId) {
      await this.toAccountSelect.selectOption(toAccountId);
    }

    await this.transferButton.click();
  }

  async getSuccessMessage() {
    return this.successMessage.textContent();
  }

  async getErrorMessage() {
    return this.errorMessage.textContent();
  }

  async getFromAccountOptions() {
    return this.fromAccountSelect.locator('option').allTextContents();
  }

  async getToAccountOptions() {
    return this.toAccountSelect.locator('option').allTextContents();
  }

  async getSelectedFromAccount() {
    return this.fromAccountSelect.inputValue();
  }

  async getSelectedToAccount() {
    return this.toAccountSelect.inputValue();
  }
}
