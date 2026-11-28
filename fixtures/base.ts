import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { TransferPage } from '../pages/TransferPage';
import { LoanPage } from '../pages/LoanPage';
import { generateUser, User } from '../utils/userGenerator';

type Fixtures = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  transferPage: TransferPage;
  loanPage: LoanPage;
  registeredUser: User;
  authenticatedPage: Page;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await use(registerPage);
  },

  transferPage: async ({ page }, use) => {
    const transferPage = new TransferPage(page);
    await use(transferPage);
  },

  loanPage: async ({ page }, use) => {
    const loanPage = new LoanPage(page);
    await use(loanPage);
  },

  registeredUser: async ({ page }, use) => {
    const user = generateUser();
    const registerPage = new RegisterPage(page);
    await registerPage.goto('/register.htm');
    await registerPage.register(user);
    await use(user);
  },

  authenticatedPage: async ({ page, registeredUser }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto('/index.htm');
    await loginPage.login(registeredUser.username, registeredUser.password);
    await use(page);
  },
});

export { expect } from '@playwright/test';
