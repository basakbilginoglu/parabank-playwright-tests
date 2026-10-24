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
    city: 'A',
    state: 'A',
    zipCode: '06000',
    phone: '5551234567',
    ssn,
    username: username!,
    password: password!,
  });

  await expect(page.locator('#rightPanel')).toContainText(
    'Your account was created successfully. You are now logged in.',
    { timeout: 15000 }
  );

  // Transfer testleri için ikinci hesap aç
  await page.goto('http://localhost:8080/parabank/openaccount.htm');
  await page.locator('#type').selectOption('SAVINGS');
  await expect(page.locator('#fromAccountId option').first()).toBeAttached();
  await page.locator('input[value="Open New Account"]').click();
  await expect(page.locator('#openAccountResult')).toContainText(
    'Account Opened!',
    { timeout: 15000 }
  );
});