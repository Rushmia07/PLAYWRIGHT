const { test, expect } = require('@playwright/test');
const LoginPage = require('../playwright/pages/login-page');
const CartPage = require('../playwright/pages/cart');

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
    await expect(page).toHaveURL(/inventory.html/);
    const cartpage=new CartPage(page);
    await cartpage.addToCart('sauce-labs-backpack');
    await expect(cartpage.getCartBadge()).toHaveText('1')

});


test('TC-15 verify the button changes to Remove after adding an item', async ({ page }) => {
    
    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    const cartpage=new CartPage(page);
    await cartpage.addToCart('sauce-labs-backpack');
    await expect(cartpage.getRemoveButton('sauce-labs-backpack')).toHaveText('Remove')


});


test('TC-16 verify the cart badge shows 2 after adding two items', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    const loginpage=new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    const cartpage=new CartPage(page);
    await cartpage.addToCart('sauce-labs-backpack');
    await cartpage.addToCart('sauce-labs-bike-light');
    await expect(cartpage.getCartBadge()).toHaveText("2")



});


test('TC-17 verify the cart badge disappears after removing the item', async ({ page }) => {
   
    await page.goto("https://www.saucedemo.com/");
    const loginpage=new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    const cartpage=new CartPage(page);
    await cartpage.addToCart('sauce-labs-backpack');
    await cartpage.removeFromCart('sauce-labs-backpack')
    await expect(cartpage.getCartBadge()).toHaveCount(0)
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
    const cartpage=new CartPage(page);
    await cartpage.addToCart('sauce-labs-backpack');
    await cartpage.removeFromCart('sauce-labs-backpack');
    await expect(cartpage.getAddToCartButton('sauce-labs-backpack')).toHaveText('Add to cart');
});


test('TC-31 verify the badge shows 2 after adding 3 items and removing 1', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

    const cartpage=new CartPage(page);
    await cartpage.addToCart('sauce-labs-backpack');
    await cartpage.addToCart('sauce-labs-bike-light');
    await cartpage.addToCart('sauce-labs-bolt-t-shirt')
    await expect(cartpage.getCartBadge()).toHaveText("3");

    await cartpage.removeFromCart('sauce-labs-backpack');
    await expect(cartpage.getCartBadge()).toHaveText("2");
});


test('TC-32 verify the badge disappears after adding all 6 items and removing all 6', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    const cartpage=new CartPage(page);
    const addButtons = cartpage.getAddToCartButtons();
    while (await addButtons.count() > 0) {
        await addButtons.first().click();
    }
    await expect(cartpage.getCartBadge()).toHaveText("6");
    const removeButtons = page.locator('button:has-text("Remove")');
    while (await removeButtons.count() > 0) {
        await removeButtons.first().click();
    }
    await expect(cartpage.getCartBadge()).toHaveCount(0);
});

// ============================================================
//  DYNAMIC LOCATOR PRACTICE — scenarios only, write the code.
//  Goal: get comfortable with locators whose match-count shifts
//  while you're acting on them, like TC-32 above.
// ============================================================

test('TC-42 verify all 6 products can be added to cart in a while+first loop', async ({ page }) => {
    // Same idea as TC-32's first loop, but do it from memory - no peeking.
    // Log in, then repeatedly click the first remaining "Add to cart" button
    // until none are left, then assert the badge shows 6.
    await page.goto("https://www.saucedemo.com/");
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    const cartpage = new CartPage(page);

    const addButtons = cartpage.getAddToCartButtons();
    while (await addButtons.count() > 0) {
        await addButtons.first().click();
    }
    await expect(cartpage.getCartBadge()).toHaveText('6');
});

test('TC-43 verify removing items in a mixed order still lands on the right badge count', async ({ page }) => {
    // Add all 6 products. Then remove them NOT in the order you added them
    // (e.g. remove the 3rd one first, then the 1st, then the 5th...).
    // After each individual removal, assert the badge count matches how
    // many items should still be left. This is the real test of whether
    // you're tracking buttons by identity (data-test slug) rather than by
    // position/index.
    await page.goto("https://www.saucedemo.com/");
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    const cartpage = new CartPage(page);

    const slugs = [
        'sauce-labs-backpack',
        'sauce-labs-bike-light',
        'sauce-labs-bolt-t-shirt',
        'sauce-labs-fleece-jacket',
        'sauce-labs-onesie',
        'test.allthethings()-t-shirt-(red)',
    ];

    for (const slug of slugs) {
        await cartpage.addToCart(slug);
    }
    await expect(cartpage.getCartBadge()).toHaveText('6');

    // Deliberately not the same order as added - proves identity-based
    // removal, not position-based.
    const removalOrder = [2, 0, 4, 1, 5, 3];
    let remaining = slugs.length;
    for (const index of removalOrder) {
        await cartpage.removeFromCart(slugs[index]);
        remaining--;
        if (remaining > 0) {
            await expect(cartpage.getCartBadge()).toHaveText(String(remaining));
        } else {
            await expect(cartpage.getCartBadge()).toHaveCount(0);
        }
    }
});

test('TC-44 verify the badge count climbs by one on every add, in a growing loop', async ({ page }) => {
    // Flip TC-42 around: instead of a shrinking "Add to cart" group, loop
    // while the badge's current number is less than 6, clicking one more
    // "Add to cart" button each time, and assert the badge text after each
    // click equals the running count so far (1, then 2, then 3...).
    await page.goto("https://www.saucedemo.com/");
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    const cartpage = new CartPage(page);

    const addButtons = cartpage.getAddToCartButtons();
    let count = 0;
    while (count < 6) {
        await addButtons.first().click();
        count++;
        await expect(cartpage.getCartBadge()).toHaveText(String(count));
    }
});
