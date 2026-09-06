const { test, expect } = require('@playwright/test');
const LoginPage = require('../playwright/pages/login-page');

// ============================================================
//  THE ORDER EVERY TEST FOLLOWS
//    1. GO      page.goto('https://www.saucedemo.com/')
//    2. LOGIN   new LoginPage + ValidloginToApplication
//    3. ACTION  click something
//    4. CHECK   expect(...)
//
//  These tests all stay on the PRODUCTS page. No need to open the cart.
// ============================================================
//
//  DAY 3 — Add to cart and the cart badge
//
//  SELECTORS
//    //button[@id='add-to-cart-sauce-labs-backpack']     Add to cart (backpack)
//    //button[@id='add-to-cart-sauce-labs-bike-light']   Add to cart (bike light)
//    //button[@id='remove-sauce-labs-backpack']          Remove (backpack)
//    .shopping_cart_badge                               the little number on the cart icon
//
//  THE ONE NEW THING TODAY
//    The badge holds a NUMBER, but you check it as TEXT:
//        await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
//    Quotes around the 1, because it is the text printed on screen.
//
//    And when the cart is empty the badge is REMOVED from the page,
//    so "it's gone" is:
//        await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
// ============================================================


test('TC-14 verify the cart badge shows 1 after adding one item', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();

    // Assert login success: user lands on the inventory page
    await expect(page).toHaveURL(/inventory.html/);

    // FIXED: deleted 'const homePage = new HomePage(page);'
    //        This file never imports HomePage (look at the top - only LoginPage),
    //        so it crashed with "ReferenceError: HomePage is not defined".
    //        Nothing used the line anyway.

    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']")

    // FIXED: was toHaveCount(1) = "there is 1 badge on the page".
    //        That would pass even if the badge showed 9.
    //        toHaveText('1') = "the badge SAYS 1", which is what we mean.
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1')

});


test('TC-15 verify the button changes to Remove after adding an item', async ({ page }) => {
    // setup: log in
    // action: click Add to cart on the backpack
    // check: the button now says 'Remove'
    //        hint: check the button you just clicked -
    //              //button[@id='remove-sauce-labs-backpack'] is now visible

    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();

    // Assert login success: user lands on the inventory page
    await expect(page).toHaveURL(/inventory.html/);

    // FIXED: deleted 'const homePage = new HomePage(page);'
    //        This file never imports HomePage (look at the top - only LoginPage),
    //        so it crashed with "ReferenceError: HomePage is not defined".
    //        Nothing used the line anyway.

    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']")

    // FIXED: was toHaveCount(1) = "there is 1 badge on the page".
    //        That would pass even if the badge showed 9.
    //        toHaveText('1') = "the badge SAYS 1", which is what we mean.
    await expect(page.locator('#remove-sauce-labs-backpack')).toHaveText('Remove')


});


test('TC-16 verify the cart badge shows 2 after adding two items', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    const loginpage=new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']");
    await page.click("#add-to-cart-sauce-labs-bike-light");
    await expect(page.locator(".shopping_cart_badge")).toHaveText("2")



});


test('TC-17 verify the cart badge disappears after removing the item', async ({ page }) => {
    // setup: log in, click Add to cart on the backpack
    // action: click Remove
    // check: .shopping_cart_badge count is 0
    //        (the badge is deleted from the page, not just emptied)

    await page.goto("https://www.saucedemo.com/");
    const loginpage=new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']");
    await page.click("//button[@id='remove-sauce-labs-backpack']");
    await expect(page.locator(".shopping_cart_badge")).toHaveCount(0)
});


// ============================================================
//  DAY 4 (rest of it) — Remove from cart
//  Same page as TC-14 to TC-17. Nothing new to learn here -
//  it's the same click + check pattern, just more of it.
// ============================================================

test('TC-30 verify the button text goes back to Add to cart after removing', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']");
    await page.click("//button[@id='remove-sauce-labs-backpack']");

    // Same button, same id, it just relabels itself back to "Add to cart".
    await expect(page.locator('#add-to-cart-sauce-labs-backpack')).toHaveText('Add to cart');
});


test('TC-31 verify the badge shows 2 after adding 3 items and removing 1', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

    await page.click("#add-to-cart-sauce-labs-backpack");
    await page.click("#add-to-cart-sauce-labs-bike-light");
    await page.click("#add-to-cart-sauce-labs-bolt-t-shirt");
    await expect(page.locator(".shopping_cart_badge")).toHaveText("3");

    await page.click("#remove-sauce-labs-backpack");
    await expect(page.locator(".shopping_cart_badge")).toHaveText("2");
});


test('TC-32 verify the badge disappears after adding all 6 items and removing all 6', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

    const addButtons = await page.locator('button.btn_inventory').all();
    for (const button of addButtons) {
        await button.click();
    }
    await expect(page.locator(".shopping_cart_badge")).toHaveText("6");

    // After clicking Add on all 6, the same buttons are now Remove buttons.
    // Re-select them fresh - the old 'addButtons' list still points at the
    // right elements, but re-querying is the safer habit to build now.
    const removeButtons = await page.locator('button.btn_inventory').all();
    for (const button of removeButtons) {
        await button.click();
    }
    await expect(page.locator(".shopping_cart_badge")).toHaveCount(0);
});
