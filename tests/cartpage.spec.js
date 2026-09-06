const { test, expect } = require('@playwright/test');
const LoginPage = require('../playwright/pages/login-page');
const HomePage = require('../playwright/pages/home-page');

// ============================================================
//  THE ORDER EVERY TEST FOLLOWS — always these 5 steps, always this order
//
//    1. GO      await page.goto('https://www.saucedemo.com/');
//    2. LOGIN   const loginPage = new LoginPage(page);
//               await loginPage.ValidloginToApplication();
//    3. SETUP   get to the right place / state   (click, click)
//    4. ACTION  the ONE thing this test is about (click)
//    5. CHECK   await expect(...)
//
//  Steps 1 and 2 are the same in every single test - copy them.
//  Step 3 changes per test. Step 4 is one line. Step 5 is one line.
//
//  TIP: before writing, do it by hand in Chrome and count your clicks.
//       Whatever you clicked, in that order, is your steps 3 and 4.
// ============================================================


// ============================================================
//  DAY 6 — Cart page buttons
//
//  THE SETUP EVERY TEST NEEDS (except TC-12):
//    1. go to saucedemo
//    2. log in
//    3. click Add to cart          -> puts an item in the cart
//    4. click the cart icon        -> takes you to the CART PAGE
//    then do the action, then check.
//
//  SELECTORS
//    products page:
//      [data-test="add-to-cart-sauce-labs-backpack"]   Add to cart button
//      .shopping_cart_link                             the cart icon, top right
//
//    cart page (you only see these AFTER clicking the cart icon):
//      .cart_item                                      one row in the cart
//      [data-test="remove-sauce-labs-backpack"]        Remove button
//      [data-test="continue-shopping"]                 Continue Shopping button
//      [data-test="checkout"]                          Checkout button
//
//  URLs
//      /inventory.html          products page
//      /cart.html               cart page
//      /checkout-step-one.html  customer info page
// ============================================================


test('TC-10 verify Continue Shopping returns to the products page', async ({ page }) => {
    // setup: log in, add backpack, open cart
    // action: click Continue Shopping
    // check: URL is inventory.html
     await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();

    // Assert login success: user lands on the inventory page
    await expect(page).toHaveURL(/inventory.html/);

    // Log out and confirm we return to the login page
    const homePage = new HomePage(page);
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']")
    await page.click(".shopping_cart_link")
    await page.click("//button[@id='continue-shopping']")
    await expect(page).toHaveURL(/inventory.html/);

});


test('TC-11 verify an item can be removed from the cart page', async ({ page }) => {
    // setup: log in, add backpack, open cart
    // action: click Remove
    // check: .cart_item count is 0
      // check: URL is inventory.html
     await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();

    // Assert login success: user lands on the inventory page
    await expect(page).toHaveURL(/inventory.html/);

    // Log out and confirm we return to the login page
    const homePage = new HomePage(page);
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']")
    await page.click(".shopping_cart_link")
    await page.click("//button[@id='remove-sauce-labs-backpack']")
    // FIXED: was '.cart_list' - that is the BOX holding the rows, and the box
    //        stays on the page even when empty (count 1). '.cart_item' is a ROW,
    //        and rows are what disappear when you click Remove (count 0).
    await expect(page.locator('.cart_item')).toHaveCount(0)


});


test('TC-12 verify the cart is empty when nothing has been added', async ({ page }) => {
    // setup: log in, open cart   (do NOT add anything)
    // check: .cart_item count is 0
      await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();

    // Assert login success: user lands on the inventory page
    await expect(page).toHaveURL(/inventory.html/);

    // Log out and confirm we return to the login page
    const homePage = new HomePage(page);

    await page.click(".shopping_cart_link")
    // FIXED: was '.cart_list' - that is the BOX holding the rows, and the box
    //        stays on the page even when empty (count 1). '.cart_item' is a ROW,
    //        and rows are what disappear when you click Remove (count 0).
    await expect(page.locator('.cart_item')).toHaveCount(0)

});


test('TC-13 verify Checkout goes to the customer information page', async ({ page }) => {
    // setup: log in, add backpack, open cart
    // action: click Checkout
    // check: URL is checkout-step-one.html

    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();

    // Assert login success: user lands on the inventory page
    await expect(page).toHaveURL(/inventory.html/);

    // Log out and confirm we return to the login page
    const homePage = new HomePage(page);
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']")
    await page.click(".shopping_cart_link")
    await page.click("//button[@id='checkout']")
    await expect(page).toHaveURL(/checkout-step-one.html/);

});


// ============================================================
//  DAY 5 — What is inside the cart
//
//  SELECTORS (on the cart page, after clicking .shopping_cart_link)
//    .cart_item              one row in the cart
//    .inventory_item_name    the product name  (same class as on the products page)
//    .inventory_item_price   the price         (same class as on the products page)
//    .cart_quantity          the QTY number
//
//  THE ONE NEW THING TODAY  (only TC-21 needs it)
//    You can SAVE a value from one page and compare it on another:
//
//        const listPrice = await page.locator('.inventory_item_price').first().textContent();
//        // ...go to the cart...
//        await expect(page.locator('.inventory_item_price')).toHaveText(listPrice);
//
//    .textContent() reads the words out of an element and hands them to you.
//    'const listPrice = ...' parks them under a name so you can use them later.
// ============================================================


test('TC-18 verify the cart icon opens the cart page', async ({ page }) => {
    // setup: log in
    // action: click the cart icon
    // check: URL is cart.html
    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();

    // Assert login success: user lands on the inventory page
    await expect(page).toHaveURL(/inventory.html/);

    // Log out and confirm we return to the login page
    const homePage = new HomePage(page);
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']")
    await page.click(".shopping_cart_link")
    await expect(page).toHaveURL(/cart.html/);

});


test('TC-19 verify the added product appears in the cart', async ({ page }) => {
    // setup: log in, add backpack, open cart
    // check: .inventory_item_name says 'Sauce Labs Backpack'
     await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();

    // Assert login success: user lands on the inventory page
    await expect(page).toHaveURL(/inventory.html/);

    // Log out and confirm we return to the login page
    const homePage = new HomePage(page);
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']")
    await page.click(".shopping_cart_link")
    await expect(page).toHaveURL(/cart.html/);
     await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack')

});


test('TC-20 verify the quantity shows 1 for a single added item', async ({ page }) => {
    // setup: log in, add backpack, open cart
    // check: .cart_quantity says '1'
    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();

    // Assert login success: user lands on the inventory page
    await expect(page).toHaveURL(/inventory.html/);

    // Log out and confirm we return to the login page
    const homePage = new HomePage(page);
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']")
    await page.click(".shopping_cart_link")
    await expect(page).toHaveURL(/cart.html/);
     await expect(page.locator('.inventory_item_name')).toHaveCount(1)

});


test('TC-21 verify the cart price matches the products page price', async ({ page }) => {

    // check: .cart_quantity says '1'
    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();

    // Assert login success: user lands on the inventory page
    await expect(page).toHaveURL(/inventory.html/);

    // FIXED (1): this line MOVED UP to here, from below the two clicks.
    //   We are still on the PRODUCTS page right now, so the listing price is
    //   readable. After clicking through to the cart it is gone.
    //   Down where it was, it read the CART's price and then compared the cart
    //   to itself - always true, proving nothing.
    const listPrice = await page.locator('.inventory_item_price').first().textContent()

    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']")
    await page.click(".shopping_cart_link")
    await expect(page).toHaveURL(/cart.html/);

    // FIXED (2): was page.locator('.') - a dot with no class name after it.
    //   That is not a valid selector, so it crashed before checking anything.
    // No quotes around listPrice: it is a name we made, not text we are typing.
    await expect(page.locator('.inventory_item_price')).toHaveText(listPrice)

});
