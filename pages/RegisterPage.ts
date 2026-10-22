
import { type Page, type Locator } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneInput: Locator;
  readonly ssnInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstNameInput = page.locator(
      'input[name="customer.firstName"]'
    );
    this.lastNameInput = page.locator(
      'input[name="customer.lastName"]'
    );
    this.addressInput = page.locator(
      'input[name="customer.address.street"]'
    );
    this.cityInput = page.locator(
      'input[name="customer.address.city"]'
    );
    this.stateInput = page.locator(
      'input[name="customer.address.state"]'
    );
    this.zipCodeInput = page.locator(
      'input[name="customer.address.zipCode"]'
    );
    this.phoneInput = page.locator(
      'input[name="customer.phoneNumber"]'
    );
    this.ssnInput = page.locator(
      'input[name="customer.ssn"]'
    );
    this.usernameInput = page.locator(
      'input[name="customer.username"]'
    );
    this.passwordInput = page.locator(
      'input[name="customer.password"]'
    );
    this.confirmPasswordInput = page.locator(
      'input[name="repeatedPassword"]'
    );
    this.registerButton = page.locator(
      'input[value="Register"]'
    );
  }

  async goto(): Promise<void> {
    await this.page.goto('register.htm');
  }

  async register(customer: {
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
  }): Promise<void> {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.addressInput.fill(customer.address);
    await this.cityInput.fill(customer.city);
    await this.stateInput.fill(customer.state);
    await this.zipCodeInput.fill(customer.zipCode);
    await this.phoneInput.fill(customer.phone);
    await this.ssnInput.fill(customer.ssn);
    await this.usernameInput.fill(customer.username);
    await this.passwordInput.fill(customer.password);
    await this.confirmPasswordInput.fill(customer.password);

    await this.registerButton.click();
  }
}
