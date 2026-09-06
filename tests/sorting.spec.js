const { test, expect } = require('@playwright/test');
const LoginPage = require('../playwright/pages/login-page');

// ============================================================
//  DAY 9 — Sorting
//
//  SELECTOR
//    [data-test="product-sort-container"]   the sort dropdown
//
//  THE ONE NEW THING TODAY
//    selectOption() picks a value from a <select> dropdown - you don't
//    click it open and click an option, one line does both:
//        await page.selectOption('[data-test="product-sort-container"]', 'za');
//
//    The dropdown's 4 values (read from its HTML, not from the visible text):
//        az    Name (A to Z)      - this is the default when you first log in
//        za    Name (Z to A)
//        lohi  Price (low to high)
//        hilo  Price (high to low)
//
//  EASY VERSION (what's below): after selecting an option, just check the
//  FIRST product's name/price. No arrays, no loops - and it's still a real
//  test that catches a broken sort.
// ============================================================

test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
});


test('TC-33 verify the default sort is Name (A to Z)', async ({ page }) => {
    // No selectOption() needed - 'az' is what the page already shows on login.
    await expect(page.locator('.inventory_item_name').first()).toHaveText('Sauce Labs Backpack');
});


test('TC-34 verify Name (Z to A) reverses the name order', async ({ page }) => {
    await page.selectOption('[data-test="product-sort-container"]', 'za');
    await expect(page.locator('.inventory_item_name').first())
        .toHaveText('Test.allTheThings() T-Shirt (Red)');
});


test('TC-35 verify Price (low to high) puts the cheapest item first', async ({ page }) => {
    await page.selectOption('[data-test="product-sort-container"]', 'lohi');
    await expect(page.locator('.inventory_item_price').first()).toHaveText('$7.99');
});


test('TC-36 verify Price (high to low) puts the most expensive item first', async ({ page }) => {
    await page.selectOption('[data-test="product-sort-container"]', 'hilo');
    await expect(page.locator('.inventory_item_price').first()).toHaveText('$49.99');
});
