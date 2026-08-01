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
test('Refresh after login login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();

    // Assert login success: user lands on the inventory page
    await expect(page).toHaveURL(/inventory.html/);
    await page.reload();
    await expect(page).toHaveURL(/inventory.html/)

});
test('Browser back after logout', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();

    // Assert login success: user lands on the inventory page
    await expect(page).toHaveURL(/inventory.html/);

    // Log out and confirm we return to the login page
    const homePage = new HomePage(page);
    await homePage.logout();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await page.goBack()
    await expect(page).toHaveURL('https://www.saucedemo.com/')

});
test('InValid login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.InvalidloginToApplication();

    
    await expect(page.locator('[data-test="error"]'))
        .toContainText('Username and password do not match');

});
test('Case sensitive', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.CaseSensitiveApplication();

    
    await expect(page.locator('[data-test="error"]'))
        .toContainText('Username and password do not match any user in this service');

});
test('Password is required', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.PasswordrequiredValidation();
    await expect(page.locator('[data-test="error"]'))
        .toContainText('Password is required');

});
test('Username is required', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.UsernamerequiredValidation();
    await expect(page.locator('[data-test="error"]'))
        .toContainText('Username is required');

});

test('Invalid Username', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.InvalidUserNameValidation();
    await expect(page.locator('[data-test="error"]'))
        .toContainText('Username and password do not match any user in this service');

});

test('Locked out login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.locked_out_userloginToApplication();

    
    await expect(page.locator('[data-test="error"]'))
        .toContainText('Sorry, this user has been locked out.');

});
test('Empty login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const loginPage = new
     LoginPage(page);
    await loginPage.EmptyloginToApplication();

    
    await expect(page.locator("h3[data-test='error']"))
        .toContainText('Username is required');

});
test('Keyboard login with Enter from password field', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.KeyboardValidloginToApplication();

    // Assert login success: user lands on the inventory page
    await expect(page).toHaveURL(/inventory.html/);

    // Log out and confirm we return to the login page
    const homePage = new HomePage(page);
    await homePage.logout();
    await expect(page).toHaveURL('https://www.saucedemo.com/');

});

test('Keyboard login with Enter from username field', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.KeyboardEnterFromUsernameField();

    await expect(page).toHaveURL(/inventory.html/);

});

test('Keyboard login using Tab navigation', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.TabNavigationloginToApplication();

    await expect(page).toHaveURL(/inventory.html/);

});

test('Keyboard invalid login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.KeyboardInvalidloginToApplication();

    await expect(page.locator('[data-test="error"]'))
        .toContainText('Username and password do not match');

});

test('Keyboard empty login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.KeyboardEmptyloginToApplication();

    await expect(page.locator('[data-test="error"]'))
        .toContainText('Username is required');

});

test('Login page UI validation', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);

    await expect(page.locator(loginPage.username)).toBeVisible();

    await expect(page.locator(loginPage.password)).toBeVisible();

    await expect(page.locator(loginPage.loginbutton)).toBeVisible();

    

});