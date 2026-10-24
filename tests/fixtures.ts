import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type Fixtures = {
  loggedInPage: void;
};

export const test = base.extend<Fixtures>({
  loggedInPage: async ({ page }, use) => {
    const username = process.env.PARABANK_USERNAME;
    const password = process.env.PARABANK_PASSWORD;

    if (!username || !password) {
      throw new Error(
        'Set PARABANK_USERNAME and PARABANK_PASSWORD to an existing seeded ParaBank user before running UI tests.'
      );
    }

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(username, password);

    // Do not accept an internal error or a missing account overview as a successful login.
    await loginPage.expectLoggedIn();
    await use();
  }
});

export { expect };
