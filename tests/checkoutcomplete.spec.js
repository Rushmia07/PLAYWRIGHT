const { test, expect } = require('@playwright/test');
const LoginPage = require('../playwright/pages/login-page');
const CheckoutPage = require('../playwright/pages/checkout');

// ============================================================
//  DAY 13 — Order completion
//  Scenarios: TC-49 to TC-52 (see plan / chat for the list)
// ============================================================

test('TC-49 verify clicking Finish goes to the order complete page', async ({ page }) => {

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
    await page.click("//button[@id='finish']")
    await expect(page).toHaveURL(/checkout-complete.html/)


});

test('TC-50 verify Thank you for your order is displayed', async ({ page }) => {
    
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
    await page.click("//button[@id='finish']")
    await expect(page).toHaveURL(/checkout-complete.html/)
    await expect(page.locator("//h2[normalize-space()='Thank you for your order!']")).toHaveText("Thank you for your order!")


});

test('TC-51 verify Back Home returns to the products page', async ({ page }) => {

    
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
    await page.click("//button[@id='finish']")
    await page.click("//button[@id='back-to-products']")
    await expect(page).toHaveURL(/inventory.html/);


});

test('TC-52 verify the cart badge is gone after completing an order', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']")
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await page.click(".shopping_cart_link")
    await page.click("//button[@id='checkout']")
    const checkoutpage = new CheckoutPage(page);
    await checkoutpage.allinput()
    await expect(page).toHaveURL(/checkout-step-two.html/);
    await page.click("//button[@id='finish']")
    await expect(page).toHaveURL(/checkout-complete.html/)

    // Same rule as TC-17, TC-27, TC-42: the badge is DELETED from the page
    // once the cart is empty, not just emptied out.
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);

});
