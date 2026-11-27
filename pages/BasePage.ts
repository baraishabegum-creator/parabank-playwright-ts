import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = '') {
    const baseURL = process.env.BASE_URL || '';
    await this.page.goto(`${baseURL}${path}`);
  }

  async getPageHeading() {
    const heading = this.page.locator('h1').first();
    return heading.textContent();
  }
}
