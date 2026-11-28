import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoanPage extends BasePage {
  readonly amountInput: Locator;
  readonly downPaymentInput: Locator;
  readonly fromAccountSelect: Locator;
  readonly applyNowButton: Locator;
  readonly resultSection: Locator;
  readonly loanProviderName: Locator;
  readonly responseDate: Locator;
  readonly loanStatus: Locator;
  readonly loanRequestApproved: Locator;
  readonly loanRequestDenied: Locator;
  readonly approvedMessage: Locator;
  readonly newAccountId: Locator;
  readonly errorMessage: Locator;
  readonly requestLoanError: Locator;

  constructor(page: Page) {
    super(page);
    this.amountInput = page.locator('#amount');
    this.downPaymentInput = page.locator('#downPayment');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.applyNowButton = page.getByRole('button', { name: 'Apply Now' });
    this.resultSection = page.locator('#requestLoanResult');
    this.loanProviderName = page.locator('#loanProviderName');
    this.responseDate = page.locator('#responseDate');
    this.loanStatus = page.locator('#loanStatus');
    this.loanRequestApproved = page.locator('#loanRequestApproved');
    this.loanRequestDenied = page.locator('#loanRequestDenied');
    this.approvedMessage = page.getByText('Congratulations, your loan has been approved.');
    this.newAccountId = page.locator('#newAccountId');
    this.errorMessage = page.locator('#loanRequestDenied p.error');
    this.requestLoanError = page.locator('#requestLoanError');
  }

  async requestLoan(amount: string, downPayment: string, fromAccountId?: string) {
    if (amount === '') {
      await this.amountInput.clear();
    } else {
      await this.amountInput.fill(amount);
    }
    if (downPayment === '') {
      await this.downPaymentInput.clear();
    } else {
      await this.downPaymentInput.fill(downPayment);
    }

    if (fromAccountId) {
      await this.fromAccountSelect.selectOption(fromAccountId);
    }

    await this.applyNowButton.click();
  }

  async getLoanStatus() {
    return this.loanStatus.textContent();
  }

  async getLoanProvider() {
    return this.loanProviderName.textContent();
  }

  async getNewAccountId() {
    return this.newAccountId.textContent();
  }

  async getErrorMessage() {
    return this.errorMessage.textContent();
  }

  async getApprovedMessage() {
    return this.approvedMessage.textContent();
  }
}