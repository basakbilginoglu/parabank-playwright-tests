import { type Locator, type Page,expect } from '@playwright/test';

export interface RegisterData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  ssn: string;
  username: string;
  password: string;
}

export class RegisterPage {
  readonly registerButton: Locator;

  constructor(private readonly page: Page) {
    this.registerButton = page.locator('input[value="Register"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('register.htm');
  }

  async register(data: RegisterData): Promise<void> {
    await this.page.locator('[id="customer.firstName"]').fill(data.firstName);
    await this.page.locator('[id="customer.lastName"]').fill(data.lastName);
    await this.page.locator('[id="customer.address.street"]').fill(data.address);
    await this.page.locator('[id="customer.address.city"]').fill(data.city);
    await this.page.locator('[id="customer.address.state"]').fill(data.state);
    await this.page.locator('[id="customer.address.zipCode"]').fill(data.zipCode);
    await this.page.locator('[id="customer.phoneNumber"]').fill(data.phone);
    await this.page.locator('[id="customer.ssn"]').fill(data.ssn);
    await this.page.locator('[id="customer.username"]').fill(data.username);
    await this.page.locator('[id="customer.password"]').fill(data.password);
    await this.page.locator('[id="repeatedPassword"]').fill(data.password);
    await this.registerButton.click();
  }
  async expectRegistrationSuccess(): Promise<void> {
  await expect(this.page.locator('#rightPanel')).toContainText(
    'Your account was created successfully. You are now logged in.',
    { timeout: 15000 }
  );

  } 
  
}