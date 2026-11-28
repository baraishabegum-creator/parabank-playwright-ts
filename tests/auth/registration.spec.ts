import { test, expect } from '../../fixtures/base';

test.describe('User Registration', () => {
  test('TC-REG-001: successful registration with valid data @smoke', async ({
    page,
    registerPage,
  }) => {
    const user = (await import('../../utils/userGenerator')).generateUser();

    await registerPage.goto('/register.htm');
    await registerPage.register(user);

    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      `Welcome ${user.username}`
    );
    await expect(page.getByText('Your account was created successfully')).toBeVisible();
  });
});
