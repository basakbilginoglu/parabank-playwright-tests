
import { test as setup, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { credentials } from '../test-data/credentials';

setup('register ParaBank user for CI', async ({ page }) => {
  const { username, password } = credentials;

  expect(username, 'PARABANK_USERNAME must be configured').toBeTruthy();
  expect(password, 'PARABANK_PASSWORD must be configured').toBeTruthy();

  const ssn = Date.now().toString().slice(-9).padStart(9, '0');

  const registerPage = new RegisterPage(page);
  await registerPage.goto();

  await registerPage.register({
    firstName: 'Test',
    lastName: 'User',
    address: '123 Test Street',
    city: 'Ankara',
    state: 'Ankara',
    zipCode: '06000',
    phone: '5551234567',
    ssn,
    username: username!,
    password: password!,
  });

  const rightPanel = page.locator('#rightPanel');

  const registrationSuccess = rightPanel.getByText(
    'Your account was created successfully. You are now logged in.'
  );

  const usernameExists = rightPanel.getByText(
    'This username already exists.'
  );

  await expect(
    registrationSuccess.or(usernameExists)
  ).toBeVisible({ timeout: 15000 });

  if (await usernameExists.isVisible()) {
    await page.goto('index.htm');

    await page.locator('input[name="username"]').fill(username!);
    await page.locator('input[name="password"]').fill(password!);
    await page.locator('input[value="Log In"]').click();

    await expect(page).toHaveURL(/overview\.htm$/);
  }

  // Ensure the user has at least one account before checking account count.
  await page.goto('overview.htm');

  const accountLinks = page.locator(
    '#accountTable a[href*="activity.htm"]'
  );

  await expect(accountLinks).not.toHaveCount(0, {
    timeout: 15000,
  });

  const accountCount = await accountLinks.count();

  // Create a second account only when one does not already exist.
  if (accountCount < 2) {
    await page.goto('openaccount.htm');

    await page.locator('#type').selectOption('SAVINGS');

    const sourceAccountOptions = page.locator('#fromAccountId option');

    await expect(sourceAccountOptions).not.toHaveCount(0, {
      timeout: 15000,
    });

    await page.locator('input[value="Open New Account"]').click();

    await expect(page.locator('#openAccountResult')).toContainText(
      'Account Opened!',
      { timeout: 15000 }
    );

    await page.goto('overview.htm');

    await expect(accountLinks).toHaveCount(2, {
      timeout: 15000,
    });
  }
});
