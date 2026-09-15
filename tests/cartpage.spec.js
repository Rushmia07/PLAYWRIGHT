const { test, expect } = require('@playwright/test');
const LoginPage = require('../playwright/pages/login-page');
const HomePage = require('../playwright/pages/home-page');
const CartPage = require('../playwright/pages/cart');



test('TC-10 verify Continue Shopping returns to the products page', async ({ page }) => {
 
     await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();

    await expect(page).toHaveURL(/inventory.html/);

    const cartPage = new CartPage(page);
    await cartPage.getAddToCartButton('sauce-labs-backpack').click();
    await cartPage.getCartLink().click();
    await cartPage.getContinue().click();
    await expect(page).toHaveURL(/inventory.html/);

});


test('TC-11 verify an item can be removed from the cart page', async ({ page }) => {
 
     await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    const cartPage = new CartPage(page);
    await cartPage.getAddToCartButton('sauce-labs-backpack').click();
    await cartPage.getCartLink().click();
    await cartPage.getRemoveButton('sauce-labs-backpack').click()
    await expect(cartPage.getCartBadge()).toHaveCount(0)


});


test('TC-12 verify the cart is empty when nothing has been added', async ({ page }) => {
    // setup: log in, open cart   (do NOT add anything)
    // check: .cart_item count is 0
      await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();

    // Assert login success: user lands on the inventory page
    await expect(page).toHaveURL(/inventory.html/);
    const cartPage=new CartPage(page);
    await cartPage.getCartLink().click();
    await expect(cartPage.getCartBadge()).toHaveCount(0)

});


test('TC-13 verify Checkout goes to the customer information page', async ({ page }) => {
  

    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    const cartPage=new CartPage(page);
    await cartPage.getCartLink().click();
    await cartPage.getCheckout().click();
    await expect(page).toHaveURL(/checkout-step-one.html/);

});


test('TC-18 verify the cart icon opens the cart page', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    const cartPage=new CartPage(page);
    await cartPage.getCartLink().click();
    await expect(page).toHaveURL(/cart.html/);

});


test('TC-19 verify the added product appears in the cart', async ({ page }) => {
     await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();


    await expect(page).toHaveURL(/inventory.html/);

    const cartPage = new CartPage(page);
    await cartPage.getAddToCartButton('sauce-labs-backpack').click();
    await cartPage.getCartLink().click();
    await expect(page).toHaveURL(/cart.html/);
     await expect(cartPage.getCartItemNames()).toHaveText('Sauce Labs Backpack')

});


test('TC-20 verify the quantity shows 1 for a single added item', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();

    await expect(page).toHaveURL(/inventory.html/);
   
    const cartPage = new CartPage(page);
    await cartPage.getAddToCartButton('sauce-labs-backpack').click();
    await cartPage.getCartLink().click(); 
    await expect(cartPage.getCartItemNames()).toHaveCount(1)

});


test('TC-21 verify the cart price matches the products page price', async ({ page }) => {


    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    const cartPage = new CartPage(page);
    const listPrice = await cartPage.getPrice().first().textContent()
    await cartPage.getAddToCartButton('sauce-labs-backpack').click();
    await cartPage.getCartLink().click(); 
    await expect(page).toHaveURL(/cart.html/);
    await expect(cartPage.getCartItemPrice()).toHaveText(listPrice)

});
