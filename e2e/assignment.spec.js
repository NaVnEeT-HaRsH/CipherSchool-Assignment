/**
 * Automation Tool: Playwright
 * Language: JavaScript (Node.js)
 * Scenario: Learner Journey - Registration → Login → Search → Enrollment
 */

const { test, expect } = require('@playwright/test');
require('dotenv').config({ path: './config/.env' });

test('Complete Learner/Customer Journey Flow', async ({ page }) => {
    const baseURL = process.env.BASE_URL || 'https://with-bugs.practicesoftwaretesting.com';

    const timestamp = Date.now();
    const email = `user${timestamp}@${process.env.EMAIL_DOMAIN}`;
    const password = process.env.PASSWORD;

    console.log(`Starting E2E test on: ${baseURL}`);

    // 1. Navigate to Registration
    await page.goto(`${baseURL}/#/auth/register`);
    console.log('Navigated to Registration Page');

    // 2. Register a new user account
    await page.waitForSelector('#first_name');
    await page.fill('#first_name', process.env.FIRST_NAME);
    await page.fill('#last_name', process.env.LAST_NAME);
    await page.fill('#dob', process.env.DOB);
    await page.fill('#address', process.env.ADDRESS);
    await page.fill('#postcode', process.env.POSTCODE);
    await page.fill('#city', process.env.CITY);

    // Bug Workarounds: #state is labeled "Country", #country is labeled "State"
    await page.fill('#state', process.env.STATE);
    await page.selectOption('#country', process.env.COUNTRY);

    await page.fill('#phone', process.env.PHONE);
    await page.locator('input#email').fill(email);
    await page.locator('input#password').fill(password);

    await page.click('button.btnSubmit');
    console.log('Registration submitted.');

    // Assert redirect to Login
    await expect(page).toHaveURL(/.*auth\/login/, { timeout: 15000 });

    // 3. Log in
    await page.locator('input#email').fill(email);
    await page.locator('input#password').fill(password);

    await page.click('input.btnSubmit');

    // Verify login success
    await expect(page).toHaveURL(/.*account/, { timeout: 15000 });
    console.log('Login successful.');

    // 4. Navigate directly to product category
    await page.goto(`${baseURL}/#/category/${process.env.CATEGORY}`);
    console.log(`Navigated to ${process.env.CATEGORY} category.`);

    // 5. Select a product
    const productCard = page.locator('.card').first();
    await expect(productCard).toBeVisible({ timeout: 15000 });
    await productCard.click();

    // 6. Add to basket
    await page.locator('button#btn-add-to-cart').click();
    console.log('Product added to basket.');

    // 7. Navigate to basket
    await page.goto(`${baseURL}/#/checkout`);
    console.log('Navigated to Basket.');
    await expect(page).toHaveURL(/.*checkout/, { timeout: 15000 });

    // 8. checkout page
    // 8.1 proceed to checkout step-1
    await page.locator('[data-test="proceed-1"]').click();
    // 8.2 proceed to checkout step-2
    await page.locator('[data-test="proceed-2"]').click();
    // 8.3 proceed to checkout step-3
    await page.locator('[data-test="proceed-3"]').click();
    // 8.4 proceed to checkout step-4
    await page.locator('[data-test="payment-method"]').selectOption(process.env.PAYMENT_METHOD);
    await page.locator('[data-test="account-name"]').fill(process.env.ACCOUNT_NAME);
    await page.locator('[data-test="account-number"]').fill(process.env.ACCOUNT_NUMBER);
    await page.locator('[data-test="finish"]').click();

    await page.waitForTimeout(20000);

});
