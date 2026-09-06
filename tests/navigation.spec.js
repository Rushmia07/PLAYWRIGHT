const { test, expect } = require('@playwright/test');
const LoginPage = require('../playwright/pages/login-page');
const HomePage = require('../playwright/pages/home-page');

// ============================================================
//  DAY 14 — Burger menu & navigation
//  Scenarios: TC-53 to TC-56 (see plan / chat for the list)
// ============================================================

test('TC-53 verify All Items returns to the products page', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

    await page.click("#react-burger-menu-btn")
    await page.click("#inventory_sidebar_link")
    await expect(page).toHaveURL(/inventory.html/);

});

test('TC-54 verify About navigates to saucelabs.com', async ({ page }) => {


    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

    await page.click("#react-burger-menu-btn")
    await page.click("//a[@id='about_sidebar_link']")
    await expect(page).toHaveURL(/saucelabs.com/);

});

test('TC-55 verify Reset App State clears the cart badge', async ({ page }) => {

    // check: .inventory_item_name says 'Sauce Labs Backpack'
     await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();

    // Assert login success: user lands on the inventory page
    await expect(page).toHaveURL(/inventory.html/);

    // Log out and confirm we return to the login page
    const homePage = new HomePage(page);
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']")
     await expect(page.locator("//span[@class='shopping_cart_badge']")).toHaveCount(1)
    await page.click("#react-burger-menu-btn")
    await page.click("//a[@id='reset_sidebar_link']")
     await expect(page.locator("//span[@class='shopping_cart_badge']")).toHaveCount(0)

});

test('TC-56 verify the X button closes the burger menu', async ({ page }) => {


    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

    await page.click("#react-burger-menu-btn")
    await page.click("//button[@id='react-burger-cross-btn']")
    await expect(page.locator('#inventory_sidebar_link')).toBeHidden();


});
