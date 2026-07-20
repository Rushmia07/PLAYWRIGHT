const { test, expect } = require('@playwright/test');
const LoginPage = require('../playwright/pages/login-page');
const HomePage = require('../playwright/pages/home-page');

test('Valid login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();

    // Assert login success: user lands on the inventory page
    await expect(page).toHaveURL(/inventory.html/);

    // Log out and confirm we return to the login page
    const homePage = new HomePage(page);
    await homePage.logout();
    await expect(page).toHaveURL('https://www.saucedemo.com/');

});


test('InValid login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.InvalidloginToApplication();

    
    await expect(page.locator('[data-test="error"]'))
        .toContainText('Username and password do not match');

});
