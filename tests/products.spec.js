const { test, expect } = require('@playwright/test');
const LoginPage = require('../playwright/pages/login-page');
const HomePage = require('../playwright/pages/home-page');
// FIXED: deleted a duplicate require of login-page that was named lowercase 'loginPage'.
//        Line 2 already imports it as 'LoginPage'. The duplicate caused the error in TC-04.

// // Runs automatically before EVERY test below, so no test needs to repeat the login.
// test.beforeEach(async ({ page }) => {
//     await page.goto('https://www.saucedemo.com/');

//     const loginPage = new LoginPage(page);
//     await loginPage.ValidloginToApplication();
//     await expect(page).toHaveURL(/inventory.html/);
// });


// ============================================================
//  DAY 1 — Inventory page UI
//  Selectors are listed in TEST-PLAN.md under "Day 1"
// ============================================================

test('TC-01 verify the Products page heading', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();          // FIXED: added - this line actually DOES the login. The line above only builds the helper.
    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.title')).toContainText("Products");

});

test('TC-02 verify the cart icon is displayed', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();          // FIXED: added the missing login call
    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.shopping_cart_link')).toBeVisible();

});

test('TC-03 verify six products are listed', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();          // FIXED: added the missing login call
    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.inventory_item')).toHaveCount(6);   // FIXED: added the dot. 'inventory_item' = a tag name (finds 0), '.inventory_item' = a class (finds 6)

});

test('TC-04 verify the first product is the Sauce Labs Backpack', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const loginPage = new LoginPage(page);             // FIXED: was 'new loginPage(page)' with a small l - that crashed with "Cannot access 'loginPage' before initialization". The class is capital LoginPage.
    await loginPage.ValidloginToApplication();          // FIXED: added the missing login call
    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.inventory_item').first()).toContainText("Sauce Labs Backpack");   // FIXED: added the dot

});
