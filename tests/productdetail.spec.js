const { test, expect } = require('@playwright/test');
const LoginPage = require('../playwright/pages/login-page');

// ============================================================
//  THE ORDER EVERY TEST FOLLOWS
//    1. GO      page.goto('https://www.saucedemo.com/')
//    2. LOGIN   new LoginPage + ValidloginToApplication
//    3. SETUP   click the product name to open its detail page
//    4. ACTION  (only some tests need one)
//    5. CHECK   expect(...)
// ============================================================
//
//  DAY 7 — Product detail page
//
//  Clicking a product NAME on the products page opens that product's own page.
//
//  SELECTORS
//    products page:
//      .inventory_item_name          the product name - CLICK it to open the detail page
//                                    (6 of these, so you need .first())
//
//    detail page:
//      .inventory_details_name       the product name on the detail page
//      .inventory_details_price      the price on the detail page
//      .inventory_details_desc       the description on the detail page
//      #back-to-products             the "Back to products" button
//
//  URLs
//      /inventory.html        products page
//      /inventory-item.html   detail page
//
//  THE ONE NEW THING TODAY
//    You have only ever clicked BUTTONS so far. Here you click a piece of TEXT.
//    Same command - page.click() does not care what kind of element it is.
//
//    But there are 6 product names, so Playwright will ask "which one?".
//    Narrow it down first, exactly like you did in TC-04:
//        await page.locator('.inventory_item_name').first().click();
//
//    Note the shape: locator(...).first().click()  - the .click() goes on the END.
// ============================================================


test('TC-22 verify clicking a product name opens the product detail page', async ({ page }) => {
    // setup: log in
    // action: click the first product name
    // check: URL is inventory-item.html
     await page.goto("https://www.saucedemo.com/");
    const loginpage=new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    await page.click("//div[normalize-space()='Sauce Labs Backpack']");
    await expect(page).toHaveURL(/inventory-item.html/)

});


test('TC-23 verify the detail page shows the correct product name', async ({ page }) => {
    // setup: log in, click the first product name
    // check: .inventory_details_name says 'Sauce Labs Backpack'
      await page.goto("https://www.saucedemo.com/");
    const loginpage=new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    await page.click("//div[normalize-space()='Sauce Labs Backpack']");
    await expect(page).toHaveURL(/inventory-item.html/)
    await expect(page.locator('.inventory_details_name.large_size')).toHaveText("Sauce Labs Backpack")

});


test('TC-24 verify the detail page shows the correct price', async ({ page }) => {
    // setup: log in, click the first product name
    // check: .inventory_details_price says '$29.99'
    //        remember the $ - toHaveText is an exact matchz
    await page.goto("https://www.saucedemo.com/");
    const loginpage=new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    await page.click("//div[normalize-space()='Sauce Labs Backpack']");
    await expect(page).toHaveURL(/inventory-item.html/)
    await expect(page.locator('.inventory_details_price')).toHaveText("$29.99")

});




test('TC-25 verify Back to products returns to the products page', async ({ page }) => {
    // setup: log in, click the first product name
    // action: click #back-to-products
    // check: URL is inventory.html
    await page.goto("https://www.saucedemo.com/");
    const loginpage=new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    await page.click("//div[normalize-space()='Sauce Labs Backpack']");
    await expect(page).toHaveURL(/inventory-item.html/)
    await page.locator("//button[@id='back-to-products']").click()
    await expect(page).toHaveURL(/inventory.html/);
});


// ============================================================
//  DAY 8 — Adding to the cart FROM the detail page
//
//  The detail page has its own Add to cart button. These tests check that
//  it behaves the same as the one on the products page, and that the cart
//  REMEMBERS what you did after you navigate away.
//
//  SETUP for all four: log in, then click the product name to open the
//  detail page. (Same 5 lines as TC-22 - copy them.)
//
//  SELECTORS (on the detail page - same ids as the products page)
//    #add-to-cart-sauce-labs-backpack     Add to cart
//    #remove-sauce-labs-backpack          Remove
//    .shopping_cart_badge                 the number on the cart icon
//    .shopping_cart_link                  the cart icon
//    #back-to-products                    Back to products
//
//  WHAT IS NEW TODAY
//    Nothing in the commands - you already know every one of these.
//    What is new is the IDEA: the cart is remembered across pages.
//    TC-29 proves it - add on one page, check the badge on another.
// ============================================================


test('TC-26 verify adding from the detail page updates the cart badge', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

    await page.click("//div[normalize-space()='Sauce Labs Backpack']");
    await expect(page).toHaveURL(/inventory-item.html/);

    // NOTE: different from the products page! On the products page each button's
    // id includes the product name (#add-to-cart-sauce-labs-backpack). On the
    // detail page there's only ever ONE Add to cart button, so its id is just
    // plain "#add-to-cart".
    await page.click("#add-to-cart");
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});


test('TC-27 verify removing from the detail page clears the cart badge', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

    await page.click("//div[normalize-space()='Sauce Labs Backpack']");
    await expect(page).toHaveURL(/inventory-item.html/);

    await page.click("#add-to-cart");
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await page.click("#remove");
    // The badge is deleted from the page, not just emptied - same rule as TC-17.
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
});


test('TC-28 verify an item added from the detail page appears in the cart', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

    await page.click("//div[normalize-space()='Sauce Labs Backpack']");
    await expect(page).toHaveURL(/inventory-item.html/);

    await page.click("#add-to-cart");
    await page.click(".shopping_cart_link");
    await expect(page).toHaveURL(/cart.html/);
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
});


test('TC-29 verify the cart badge survives going back to the products page', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

    await page.click("//div[normalize-space()='Sauce Labs Backpack']");
    await expect(page).toHaveURL(/inventory-item.html/);

    await page.click("#add-to-cart");
    await page.locator("//button[@id='back-to-products']").click();

    // Two checks in one test is fine when they describe one behaviour:
    // "we're back on products, AND the cart still remembers the item."
    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});
