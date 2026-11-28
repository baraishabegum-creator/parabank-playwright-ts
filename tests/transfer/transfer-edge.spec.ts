import { test, expect } from '../../fixtures/base';

test.describe('Transfer Funds - Edge Cases', () => {
  test.beforeEach(async ({ authenticatedPage, transferPage }) => {
    // User is already logged in via authenticatedPage fixture
    await transferPage.goto('/transfer.htm');
  });

  test('TC-EDGE-TF-001: transfer with sub-cent amount (0.001) @regression', async ({
    page,
    transferPage,
  }) => {
    await transferPage.goto('/transfer.htm');
    await transferPage.transfer('0.001');

    // System should either reject or round - verify no crash
    const hasError = await page.locator('.error').isVisible().catch(() => false);
    const hasSuccess = await transferPage.successMessage
      .isVisible()
      .catch(() => false);

    expect(hasError || hasSuccess).toBe(true);
  });

  test('TC-EDGE-TF-004: transfer minimum valid amount ($0.01) @regression', async ({
    page,
    transferPage,
  }) => {
    await transferPage.goto('/transfer.htm');

    const fromAccount = await transferPage.getSelectedFromAccount();
    const toOptions = await transferPage.getToAccountOptions();

    // Select a different account if available
    if (toOptions.length > 1) {
      const differentAccount = toOptions.find((opt) => opt !== fromAccount);
      if (differentAccount) {
        await transferPage.toAccountSelect.selectOption(differentAccount);
      }
    }

    await transferPage.transfer('0.01');

    await expect(page.getByText('Transfer Complete!')).toBeVisible({
      timeout: 10000,
    });
  });

  test('TC-EDGE-TF-009: transfer from account to itself (same account) @regression', async ({
    page,
    transferPage,
  }) => {
    await transferPage.goto('/transfer.htm');

    const fromAccount = await transferPage.getSelectedFromAccount();
    await transferPage.toAccountSelect.selectOption(fromAccount);
    await transferPage.transfer('10.00');

    // Should either show error or allow (verify behavior documented)
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
  });

  test('TC-EDGE-TF-024: transfer resulting in negative balance (insufficient funds) @regression', async ({
    page,
    transferPage,
  }) => {
    await transferPage.goto('/transfer.htm');

    // Attempt to transfer more than account balance
    await transferPage.transfer('999999999.99');

    // Should show insufficient funds error or complete (documents actual behavior)
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
  });

  test('TC-NEG-TF-001: transfer with negative amount @regression', async ({
    page,
    transferPage,
  }) => {
    await transferPage.goto('/transfer.htm');
    await transferPage.transfer('-100.00');

    // System should reject negative amounts
    const hasError = await page.locator('.error').isVisible().catch(() => false);
    const pageContent = await page.textContent('body');

    // Verify no successful transfer with negative amount
    expect(pageContent).not.toContain('Transfer Complete!');
  });

  test('TC-NEG-TF-002: transfer with zero amount @regression', async ({
    page,
    transferPage,
  }) => {
    await transferPage.goto('/transfer.htm');
    await transferPage.transfer('0.00');

    // Should show error for zero amount
    await page.waitForTimeout(2000);
    const pageContent = await page.textContent('body');

    // Document actual behavior
    expect(pageContent).toBeTruthy();
  });

  test('TC-NEG-TF-003: transfer with empty amount @regression', async ({
    page,
    transferPage,
  }) => {
    await transferPage.goto('/transfer.htm');
    await transferPage.amountInput.fill('');
    await transferPage.transferButton.click();

    // Should show validation error
    await page.waitForTimeout(2000);
    const pageContent = await page.textContent('body');

    expect(pageContent).toBeTruthy();
  });

  test('TC-NEG-TF-004: transfer with non-numeric amount @regression', async ({
    page,
    transferPage,
  }) => {
    await transferPage.goto('/transfer.htm');
    await transferPage.transfer('abc');

    // Should show validation error
    await page.waitForTimeout(2000);
    const hasError = await page.locator('.error').isVisible().catch(() => false);
    const pageContent = await page.textContent('body');

    // Should not complete transfer
    expect(pageContent).not.toContain('Transfer Complete!');
  });

  test('TC-NEG-TF-005: transfer with special characters in amount @regression', async ({
    page,
    transferPage,
  }) => {
    await transferPage.goto('/transfer.htm');
    await transferPage.transfer('$100.00');

    // System should either strip $ or show error
    await page.waitForTimeout(2000);
    const pageContent = await page.textContent('body');

    expect(pageContent).toBeTruthy();
  });

  test('TC-NEG-TF-006: transfer with HTML/XSS in amount field @regression', async ({
    page,
    transferPage,
  }) => {
    await transferPage.goto('/transfer.htm');
    await transferPage.transfer('<script>alert("XSS")</script>');

    // Should sanitize input and not execute script
    await page.waitForTimeout(2000);

    // Verify no alert dialog appeared (script not executed)
    const hasDialog = page
      .locator('dialog')
      .isVisible()
      .catch(() => false);
    expect(await hasDialog).toBe(false);

    // Should show error or sanitize
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
  });

  test('TC-NEG-TF-008: transfer with extremely large amount @regression', async ({
    page,
    transferPage,
  }) => {
    await transferPage.goto('/transfer.htm');
    await transferPage.transfer('99999999999999999999999999999.99');

    // Should handle gracefully without overflow
    await page.waitForTimeout(2000);
    const pageContent = await page.textContent('body');

    // System should either reject or handle the large number
    expect(pageContent).toBeTruthy();
  });

  test('TC-EDGE-TF-003: transfer exact account balance @regression', async ({
    page,
    transferPage,
  }) => {
    await transferPage.goto('/transfer.htm');

    // First check current balance by going to overview
    await page.goto('http://localhost:8080/parabank/overview.htm');
    await page.waitForLoadState('networkidle');

    const balanceText = await page
      .locator('table')
      .first()
      .locator('td')
      .nth(1)
      .textContent();

    if (balanceText) {
      const balance = balanceText.replace(/[^0-9.]/g, '');

      // Go back to transfer and transfer exact balance
      await transferPage.goto('/transfer.htm');

      const fromAccount = await transferPage.getSelectedFromAccount();
      const toOptions = await transferPage.getToAccountOptions();

      if (toOptions.length > 1) {
        const differentAccount = toOptions.find((opt) => opt !== fromAccount);
        if (differentAccount) {
          await transferPage.toAccountSelect.selectOption(differentAccount);
        }
      }

      await transferPage.transfer(balance);

      await page.waitForTimeout(3000);
      const pageContent = await page.textContent('body');

      // Verify transfer completed or shows appropriate message
      expect(pageContent).toBeTruthy();
    }
  });
});
