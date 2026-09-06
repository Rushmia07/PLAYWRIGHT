const { test, expect } = require('@playwright/test');
const LoginPage = require('../playwright/pages/login-page');
const CheckoutPage = require('../playwright/pages/checkout');

// ============================================================
//  DAY 15 — Other users & full regression
//  Scenarios: TC-57 to TC-60 (see plan / chat for the list)
// ============================================================

test('TC-57 verify problem_user logs in and lands on the inventory page', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.problemUserValidloginToApplication();

    await expect(page).toHaveURL(/inventory.html/);





});

test('TC-58 verify performance_glitch_user logs in successfully', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.PerformanceUserValidloginToApplication();

    await expect(page).toHaveURL(/inventory.html/);



});

test('TC-59 verify problem_user sees identical image sources on all products', async ({ page }) => {
  
    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.problemUserValidloginToApplication();

    await expect(page).toHaveURL(/inventory.html/);

    // Sanity check: all 6 product cards actually have an image before we
    // start comparing their src values.
    await expect(page.locator('.inventory_item img')).toHaveCount(6);

    // Collect all 6 product images, then check every one shares the SAME src
    // as the first - that's problem_user's known bug (all broken images are
    // identical), rather than hardcoding one expected filename.
    const images = await page.locator('.inventory_item img').all();
    const firstSrc = await images[0].getAttribute('src');

    for (const image of images) {
        await expect(image).toHaveAttribute('src', firstSrc);
    }

});

test('TC-60 verify the full journey: login, add 2 items, checkout, and finish', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

    // Add 2 items and confirm the badge tracks both before moving on.
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']")
    await page.click("#add-to-cart-sauce-labs-bike-light")
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    await page.click(".shopping_cart_link")
    await page.click("//button[@id='checkout']")

    const checkoutpage = new CheckoutPage(page);
    await checkoutpage.allinput()
    await expect(page).toHaveURL(/checkout-step-two.html/);

    await page.click("//button[@id='finish']")
    await expect(page).toHaveURL(/checkout-complete.html/);
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');

});


// ============================================================
//  BONUS — the other two buggy users named in the plan's table
//  but never given their own test (same style as TC-59).
// ============================================================

test('TC-61 verify error_user cannot remove an item from the cart', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.errorUserValidloginToApplication();

    // FIXED: the add-to-cart click got deleted, and the locator below had two
    //        bugs at once - missing the leading "." (so it read as a tag name,
    //        not a class) and hyphens instead of underscores. The class is
    //        ".shopping_cart_badge", same as everywhere else in the suite.
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']")
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1')

    await page.click("//button[@id='remove-sauce-labs-backpack']")

    // FIXED: was only checking the URL, which is true either way and proves
    //        nothing about Remove actually working. error_user's bug is that
    //        clicking Remove doesn't remove the item - so the badge should
    //        STILL say '1' afterwards, not disappear like it does for every
    //        other user (compare to TC-17).
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

});

test('TC-62 verify visual_user logs in and lands on the inventory page', async ({ page }) => {


  await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.visualUserValidloginToApplication();
    // FIXED: was toHaveURL("/inventory.html/") - a STRING, so it compared the
    //        whole URL against that literal text. Same bug as TC-41 - drop
    //        the quotes to make it a regex.
    await expect(page).toHaveURL(/inventory.html/)


});

// ============================================================
//  E2E JOURNEYS — each test walks the WHOLE flow end to end,
//  not one page in isolation. TC-60 above already did this once
//  (login -> add 2 -> checkout -> finish); these are 4 more,
//  each exercising a different journey shape. Scenarios only.
// ============================================================

test('TC-63 verify the full journey for buying exactly 1 item', async ({ page }) => {
    // Simplest possible journey: login -> add 1 item -> checkout -> finish.
    // Unlike TC-60 (2 items), check the overview page's actual totals match
    // that ONE item's price, not just that you reached checkout-step-two.



    // Hint: same shape as TC-60, but assert on .summary_subtotal_label etc.
    //       (see checkoutoverview.spec.js for those selectors) before finishing.
});

test('TC-64 verify the full journey for buying all 6 items', async ({ page }) => {
    // Same journey shape, but add EVERY product before checking out - stress
    // the cart/summary page with the maximum case instead of 1-2 items.



    // Hint: loop .btn_inventory (or reuse the technique from products.spec.js)
    //       to click all 6 Add to cart buttons, then badge should show '6'
    //       before you proceed to checkout.
});

test('TC-65 verify a journey that removes an item before completing checkout', async ({ page }) => {
    // Add 2 items, go to the cart, remove ONE of them, THEN continue to
    // checkout and finish with just the remaining item - a correction
    // mid-journey, not a straight line like TC-60/63/64.



    // Hint: click remove on the cart page (cartpage.spec.js has this
    //       selector), confirm the badge/cart reflect 1 item, then proceed.
});

test('TC-66 verify performance_glitch_user can complete a full purchase', async ({ page }) => {
    // TC-58 only checked that this user can LOG IN. This extends it into a
    // full buy journey - confirms the slow-but-working user isn't ALSO
    // broken somewhere further down the flow.



    // Hint: loginPage.PerformanceUserValidloginToApplication(), then the same
    //       add -> checkout -> finish steps as TC-60.
});

test('TC-67 verify the site returns to a clean state after a completed purchase', async ({ page }) => {
    // Finish a purchase, click Back Home, and confirm you're not just back
    // on the products page - the cart badge should be gone AND the cart
    // itself should be empty if you open it, closing the loop back to start.



    // Hint: after toHaveURL(/inventory.html/), check .shopping_cart_badge
    //       has toHaveCount(0), then click the cart icon and check
    //       .cart_item also has toHaveCount(0).
});
