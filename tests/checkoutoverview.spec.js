const { test, expect } = require('@playwright/test');
const LoginPage = require('../playwright/pages/login-page');
const CheckoutPage = require('../playwright/pages/checkout');

// ============================================================
//  DAY 12 — Checkout overview & totals
//  Scenarios: TC-45 to TC-48 (see plan / chat for the list)
// ============================================================

test('TC-45 verify the overview lists Sauce Labs Backpack', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']")
    await page.click(".shopping_cart_link")
    await page.click("//button[@id='checkout']")
    const checkoutpage=new CheckoutPage(page);
    await checkoutpage.allinput()
    await expect(page.locator("//div[@class='inventory_item_name']")).toHaveText("Sauce Labs Backpack")


});

test('TC-46 verify the item total shows $29.99', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']")
    await page.click(".shopping_cart_link")
    await page.click("//button[@id='checkout']")
    const checkoutpage=new CheckoutPage(page);
    await checkoutpage.allinput()
    await expect(page.locator(".summary_subtotal_label")).toHaveText("Item total: $29.99")


});

test('TC-47 verify the tax shows $2.40', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']")
    await page.click(".shopping_cart_link")
    await page.click("//button[@id='checkout']")
    const checkoutpage=new CheckoutPage(page);
    await checkoutpage.allinput()
    await expect(page.locator("//div[@class='summary_tax_label']")).toHaveText("Tax: $2.40")


});

test('TC-48 verify the total shows $32.39', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']")
    await page.click(".shopping_cart_link")
    await page.click("//button[@id='checkout']")
    const checkoutpage=new CheckoutPage(page);
    await checkoutpage.allinput()
    await expect(page.locator("//div[@class='summary_total_label']")).toHaveText("Total: $32.39")

});
