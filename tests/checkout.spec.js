const { test, expect } = require('@playwright/test');
const LoginPage = require('../playwright/pages/login-page');
const CheckoutPage = require('../playwright/pages/checkout');
const CartPage = require('../playwright/pages/cart');

// Every test in this file needs the same starting point: logged in, one
// item in the cart, and Checkout clicked so you land on checkout-step-one.
test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    const cartpage = new CartPage(page);
    await cartpage.getAddToCartButton('sauce-labs-bike-light').click();
    await cartpage.openCart();
    const checkoutpage = new CheckoutPage(page);
    await checkoutpage.checkout();
});

test('TC-37 verify submitting an empty checkout form shows First Name is required', async ({ page }) => {
    const checkoutpage = new CheckoutPage(page);
    await checkoutpage.noinput();
    await expect(page.locator(checkoutpage.error)).toHaveText("Error: First Name is required")
});

test('TC-38 verify submitting with only First Name filled shows Last Name is required', async ({ page }) => {
    const checkoutpage = new CheckoutPage(page);
    await checkoutpage.onlyfirstnameinput();
    await expect(page.locator(checkoutpage.error)).toHaveText("Error: Last Name is required");
});

test('TC-39 verify submitting with First and Last Name but no Zip shows Postal Code is required', async ({ page }) => {
    const checkoutpage = new CheckoutPage(page);
    await checkoutpage.firstLastnameinput();
    await expect(page.locator(checkoutpage.error)).toHaveText("Error: Postal Code is required")
});

test('TC-40 verify submitting the form with all fields filled goes to checkout-step-two', async ({ page }) => {
    const checkoutpage = new CheckoutPage(page);
    await checkoutpage.allinput();
    await expect(page).toHaveURL(/checkout-step-two.html/);
});

test('TC-41 verify Cancel returns to the cart page', async ({ page }) => {
    const checkoutpage = new CheckoutPage(page);
    await checkoutpage.cancel();
    await expect(page).toHaveURL(/cart.html/)
});

test('TC-42 verify clicking the X dismisses the error message', async ({ page }) => {
    const checkoutpage = new CheckoutPage(page);
    await checkoutpage.noinput()
    await expect(page.locator(checkoutpage.error)).toHaveText("Error: First Name is required")
    await page.click(checkoutpage.dismiss)
    await expect(page.locator(checkoutpage.error)).toHaveCount(0)
});

test('TC-43 verify typed values stay in the fields after a validation error', async ({ page }) => {
    const checkoutpage = new CheckoutPage(page);
    await checkoutpage.firstLastnameinput()
    await expect(page.locator(checkoutpage.error)).toHaveText("Error: Postal Code is required")
    await expect(page.locator(checkoutpage.firstname)).toHaveValue("standard_user")
    await expect(page.locator(checkoutpage.lastname)).toHaveValue("standard_user")
});

test('TC-44 verify the fields are empty when you first arrive on the checkout page', async ({ page }) => {
    const checkoutpage = new CheckoutPage(page);
    await expect(page.locator(checkoutpage.firstname)).toHaveValue('');
    await expect(page.locator(checkoutpage.lastname)).toHaveValue('');
    await expect(page.locator(checkoutpage.postalcode)).toHaveValue('');
});
