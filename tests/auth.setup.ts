
import { test as setup, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { credentials } from '../test-data/credentials';

setup('register ParaBank user for CI', async ({ page }) => {
  const { password } = credentials;

  expect(password, 'PARABANK_PASSWORD must be configured').toBeTruthy();

  // Benzersiz kullanıcı adı: her çalıştırmada yeni bir değer
const uniqueId = Date.now().toString();

const username = `qa_${uniqueId}`;
const ssn = uniqueId.slice(-9).padStart(9, '0');
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
  username,
  password: password!,
});
console.log('Registration URL:', page.url());

console.log(
  'Registration result:',
  (await page.locator('#rightPanel').innerText()).trim()
);

  await expect(page.locator('#rightPanel')).toContainText(
  'Your account was created successfully. You are now logged in.',
  { timeout: 15000 }
);
});
