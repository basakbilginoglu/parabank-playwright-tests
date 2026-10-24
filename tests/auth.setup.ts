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

  // Kayıt ya başarılı olur ya da kullanıcı zaten vardır (lokalde kalıcı DB)
  await expect(
    rightPanel.getByText(
      /Your account was created successfully|This username already exists/
    )
  ).toBeVisible({ timeout: 15000 });

  const alreadyExists = await rightPanel
    .getByText('This username already exists.')
    .isVisible();

  if (alreadyExists) {
    // Kullanıcı daha önce kayıtlı: sadece giriş yap
    await page.goto('index.htm');
    await page.locator('input[name="username"]').fill(username!);
    await page.locator('input[name="password"]').fill(password!);
    await page.locator('input[value="Log In"]').click();
    await expect(page).toHaveURL(/overview\.htm$/);
  } else {
    await expect(rightPanel).toContainText(
      'Your account was created successfully. You are now logged in.'
    );

    // Transfer testleri için ikinci hesap aç (sadece yeni kullanıcıda)
    await page.goto('openaccount.htm');
    await page.locator('#type').selectOption('SAVINGS');
    await expect(page.locator('#fromAccountId option').first()).toBeAttached();
    await page.locator('input[value="Open New Account"]').click();
    await expect(page.locator('#openAccountResult')).toContainText(
      'Account Opened!',
      { timeout: 15000 }
    );
  }
});