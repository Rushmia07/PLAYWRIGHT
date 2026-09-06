const { test, expect } = require('@playwright/test');
const LoginPage = require('../playwright/pages/login-page');
const CheckoutPage = require('../playwright/pages/checkout');
// ============================================================
//  DAY 10 — Checkout form validation
//  Scenarios: TC-37 to TC-40 (see plan / chat for the list)
// ============================================================

test('TC-37 verify submitting an empty checkout form shows First Name is required', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']")
    await page.click(".shopping_cart_link")
    // FIXED: this click was missing. Without it you're still on the cart page,
    //        not the checkout form, so there's no Continue button to click yet.
    await page.click("//button[@id='checkout']")
    const checkoutpage=new CheckoutPage(page);
    await checkoutpage.noinput()
    await expect(page.locator("h3[data-test='error']")).toHaveText("Error: First Name is required")
});

test('TC-38 verify submitting with only First Name filled shows Last Name is required', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']")
    await page.click(".shopping_cart_link")
    await page.click("//button[@id='checkout']")
    const checkoutpage=new CheckoutPage(page);
    await checkoutpage.onlyfirstnameinput()
    await expect(page.locator("h3[data-test='error']")).toHaveText("Error: Last Name is required")


});

test('TC-39 verify submitting with First and Last Name but no Zip shows Postal Code is required', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']")
    await page.click(".shopping_cart_link")
    await page.click("//button[@id='checkout']")
    const checkoutpage=new CheckoutPage(page);
    await checkoutpage.firstLastnameinput()
    // FIXED: was missing the "Error: " prefix. toHaveText checks the FULL text,
    //        and the real banner always starts with "Error: ", same as TC-37/38.
    await expect(page.locator("h3[data-test='error']")).toHaveText("Error: Postal Code is required")

});

test('TC-40 verify submitting the form with all fields filled goes to checkout-step-two', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']")
    await page.click(".shopping_cart_link")
    await page.click("//button[@id='checkout']")
    const checkoutpage=new CheckoutPage(page);
    await checkoutpage.allinput()
    // FIXED: was checking checkout-step-one.html. Filling all 3 fields correctly
    //        moves you FORWARD to step two - step-one is only where you land
    //        when validation fails and you're stuck on the same page.
    await expect(page).toHaveURL(/checkout-step-two.html/);

});


// ============================================================
//  DAY 11 — Checkout form behaviour
//  Scenarios: TC-41 to TC-44 (see plan / chat for the list)
// ============================================================

test('TC-41 verify Cancel returns to the cart page', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']")
    await page.click(".shopping_cart_link")
    await page.click("//button[@id='checkout']")
    await page.click("//button[@id='cancel']")
    // FIXED: was toHaveURL("/cart.html/") - a STRING, so it compared the whole
    //        URL against the literal text "/cart.html/", which never matches.
    //        Dropping the quotes makes it a REGEX, which matches "contains".
    await expect(page).toHaveURL(/cart.html/)


});

test('TC-42 verify clicking the X dismisses the error message', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']")
    await page.click(".shopping_cart_link")
    await page.click("//button[@id='checkout']")
     // Submit the form empty first, same as TC-37, so the error banner appears.
    const checkoutpage = new CheckoutPage(page);
    await checkoutpage.noinput()
    await expect(page.locator("h3[data-test='error']")).toHaveText("Error: First Name is required")
    await page.click(".error-button")
    await expect(page.locator("h3[data-test='error']")).toHaveCount(0)

});

test('TC-43 verify typed values stay in the fields after a validation error', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']")
    await page.click(".shopping_cart_link")
    await page.click("//button[@id='checkout']")
    const checkoutpage=new CheckoutPage(page);
    await checkoutpage.firstLastnameinput()
    // FIXED: was missing the "Error: " prefix. toHaveText checks the FULL text,
    //        and the real banner always starts with "Error: ", same as TC-37/38.
    await expect(page.locator("h3[data-test='error']")).toHaveText("Error: Postal Code is required")
    await expect(page.locator("//input[@id='first-name']")).toHaveValue("standard_user")
    await expect(page.locator("//input[@id='last-name']")).toHaveValue("standard_user")
});

test('TC-44 verify the fields are empty when you first arrive on the checkout page', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']")
    await page.click(".shopping_cart_link")
    await page.click("//button[@id='checkout']")
    const checkoutpage=new CheckoutPage(page);
    await expect(page.locator("//input[@id='first-name']")).toHaveValue('')
    await expect(page.locator("//input[@id='last-name']")).toHaveValue('')
     await expect(page.locator("//input[@id='postal-code']")).toHaveValue('')


});
