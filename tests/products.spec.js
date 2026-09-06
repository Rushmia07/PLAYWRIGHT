const { test, expect } = require('@playwright/test');
const LoginPage = require('../playwright/pages/login-page');
const HomePage = require('../playwright/pages/home-page');
const { after, before } = require('node:test');

test('TC-01 verify the Products page heading', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();          
    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.title')).toContainText('Products');

});

test('TC-02 verify the cart icon is displayed', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();          
    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.shopping_cart_link')).toBeVisible();

});

test('TC-03 verify six products are listed', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();          // FIXED: added the missing login call
    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.inventory_item_name')).toHaveCount(6);
});

test('TC-04 verify the first product is the Sauce Labs Backpack', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const loginPage = new LoginPage(page);            
    await loginPage.ValidloginToApplication();          // FIXED: added the missing login call
    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.inventory_item_name').first()).toHaveText('Sauce Labs Backpack')
});



test('TC-05 verify every product has an image', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.inventory_item_img img')).toHaveCount(6);
});

test('TC-06 verify every product has a price', async ({ page }) => {
     await page.goto("https://www.saucedemo.com/");
     const loginpage=new LoginPage(page);
     await loginpage.ValidloginToApplication();
     await expect(page).toHaveURL(/inventory.html/);
     await expect(page.locator('.inventory_item_price')).toHaveCount(6);
});

test('TC-07 verify every product has a description', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
     const loginpage=new LoginPage(page);
     await loginpage.ValidloginToApplication();
     await expect(page).toHaveURL(/inventory.html/);
     await expect(page.locator('.inventory_item_desc')).toHaveCount(6);


});

test('TC-08 verify every product has an Add to cart button', async ({ page }) => {
     await page.goto("https://www.saucedemo.com/");
     const loginpage=new LoginPage(page);
     await loginpage.ValidloginToApplication();
     await expect(page).toHaveURL(/inventory.html/);
     await expect(page.locator('.btn_primary')).toHaveCount(6);
});

test('TC-09 verify every price starts with a dollar sign', async ({ page }) => {


     await page.goto("https://www.saucedemo.com/");
     const loginpage=new LoginPage(page);
     await loginpage.ValidloginToApplication();
     await expect(page).toHaveURL(/inventory.html/);
   
    const prices=await page.locator('.inventory_item_price').all();
    for(const price of prices){
        await expect(price).toContainText("$");
    }
});


test('TC-10 verify every product has a non-empty description', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    const loginpage=new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    const desc=await page.locator('.inventory_item_desc').all();
    for(const des of desc){
        await expect(des).toContainText(/.+/);
    }
   
});

test('TC-11 verify all 6 product names are unique', async ({ page }) => {

    await page.goto("https://www.saucedemo.com/");
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    const name=await page.locator('.inventory_item_name ').allTextContents();
    const uniqueNames=new Set(name);
    await expect(uniqueNames.size).toBe(name.length);
});

test('TC-12 verify every price is a number greater than 0', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    const loginpage=new LoginPage(page);
     await loginpage.ValidloginToApplication();
     await expect(page).toHaveURL(/inventory.html/);

    const price=await page.locator('.inventory_item_price').all();
    for(const pri of price){
        const pr=await pri.textContent();
        const price1=Number(pr.replace('$',''));
        await expect(price1).toBeGreaterThan(0);
    }

 
});

test('TC-13 verify every Add to cart button has the exact same label', async ({ page }) => {

    await page.goto("https://www.saucedemo.com/");
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    const add_to_cart=await page.locator('.btn_primary').all();
    for(const add of add_to_cart){
        await expect(add).toHaveText('Add to cart');
    }
    
  
});



test('TC-14 verify no product name has leading or trailing whitespace', async ({ page }) => {

    await page.goto("https://www.saucedemo.com/");
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    const pro_name=await page.locator('.inventory_item_name').all();
    for(const pro of pro_name){
        const text=await pro.textContent();
        await expect(text).toBe(text.trim());
    }

});

test('TC-15 verify every product image has a non-empty src attribute', async ({ page }) => {


 await page.goto("https://www.saucedemo.com/");
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
   const img=await page.locator('.inventory_item_img img').all();
   for(const imgs of img){
    const im=await imgs.getAttribute('src');
    await expect(im).toBeTruthy();
   }
});

test('TC-16 verify the number of Add to cart buttons matches the number of products', async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    const products=await page.locator('.inventory_item_name').count();
    const add_to_cart=await page.locator('.btn_primary').count();
    await expect(products).toBe(add_to_cart);
});

test('TC-17 verify the 6 product prices add up to the expected total', async ({ page }) => {
    // Collect all prices as text, strip the '$', convert to Number, and sum
    // them with .reduce(). Saucedemo's 6 prices should total $129.94.
   await page.goto("https://www.saucedemo.com/");
    const loginpage=new LoginPage(page);
     await loginpage.ValidloginToApplication();
     await expect(page).toHaveURL(/inventory.html/);
     const priceTexts=await page.locator('.inventory_item_price').allTextContents();
     const prices=priceTexts.map(p=>Number(p.replace('$','')));
    const total=prices.reduce((sum,p)=>sum+p,0);
     await expect(total).toBeCloseTo(129.94,2);

     const price=await page.locator('.inventory_item_price').allTextContents();
     const prices1=price.map(p=>Number(p.replace('$','')));
     const total1=prices1.reduce((sum,p)=>sum+p,0);
     await expect(total1).toBeCloseTo(129.94,2)


});

test('TC-18 verify only 5 unique prices exist among the 6 products', async ({ page }) => {
    // Same Set trick as TC-11, applied to .inventory_item_price instead of names.
    // NOTE: saucedemo genuinely has one duplicate price - Bolt T-Shirt and
    // T.allTheThings() T-Shirt (Red) are both $15.99 - so 6 prices collapse
    // to 5 unique values. This documents that known quirk rather than
    // asserting a false "no duplicates" invariant.
     await page.goto("https://www.saucedemo.com/");
     const loginpage=new LoginPage(page);
     await loginpage.ValidloginToApplication();
     await expect(page).toHaveURL(/inventory.html/);


   const price = await page.locator('.inventory_item_price').allTextContents();
   const prices=price.map(p=>Number(p.replace('$','')))
   const uniquePrices=new Set(prices);
   await expect(uniquePrices.size).toBe(5)

 


    // Hint: new Set(pricesArray).size should equal pricesArray.length.
});

// ============================================================
//  PRACTICE ROUND 3 — scenarios only, write the code.
// ============================================================

test('TC-19 verify every price matches the exact format $X.XX', async ({ page }) => {
    // Not just "contains $" like TC-09 - check the WHOLE string shape with a
    // regex: a dollar sign, one or more digits, a dot, exactly two digits.


    await page.goto("https://www.saucedemo.com/");
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    const price=await page.locator('.inventory_item_price').all();
    for(const pri of price){
        const text = await pri.textContent();
        expect(text).toMatch(/^\$\d+\.\d{2}$/)
    }
    

    // Hint: expect(text).toMatch(/^\$\d+\.\d{2}$/)
});

test('TC-20 verify every Add to cart button is enabled', async ({ page }) => {
    // A different kind of check than text/count - is the button clickable,
    // or is it greyed out / disabled?

     await page.goto("https://www.saucedemo.com/");
     const loginpage=new LoginPage(page);
     await loginpage.ValidloginToApplication();
     await expect(page).toHaveURL(/inventory.html/);
     const add_to_cart=await page.locator('.btn_primary').all();
     for(const button of add_to_cart){
        await expect(button).toBeEnabled();
     }
});

test('TC-21 verify no two product descriptions are identical', async ({ page }) => {
    // Same Set trick as TC-11 and TC-18, this time on .inventory_item_desc.

   await page.goto("https://www.saucedemo.com/");
   const loginpage=new LoginPage(page);
   await loginpage.ValidloginToApplication();
   await expect(page).toHaveURL(/inventory.html/);
   const des = await page.locator('.inventory_item_desc').allTextContents();
   const uniquedes=new Set(des);
   expect(uniquedes.size).toBe(des.length);

});

test('TC-22 verify each image\'s alt text matches its product name', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    const names = await page.locator('.inventory_item_name').allTextContents();
    const imges = await page.locator('.inventory_item_img img').all();
    for (let i=0;i<names.length;i++){
        const alt=await imges[i].getAttribute('alt');
        expect(alt).toBe(names[i]);
    }
});

test('TC-23 verify every Add to cart button has a unique data-test attribute', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

   const buttons=await page.locator('btn_primary').all();
   const datasetIds=[]
   for (const btn of buttons){
    const dt=await btn.getAttribute('data-test');
    datasetIds.push(dt)
   }
   const uniqueIds=new Set(datasetIds)
   await expect(uniqueIds.size).toBe(datasetIds.length)
});

test('TC-24 verify none of the 6 product names start with a lowercase letter', async ({ page }) => {
    // A regex check on the FIRST character only, not the whole string.

    await page.goto('https://www.saucedemo.com/');
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

    const names = await page.locator('.inventory_item_name').allTextContents();
    for (const name of names) {
        expect(name).toMatch(/^[A-Z]/);
    }
});

test('TC-25 verify clicking one Add to cart button does not change the other 5', async ({ page }) => {
    // Read all 6 button texts BEFORE clicking, click just one, read all 6 AGAIN,
    // then check the other 5 are still "Add to cart".

    await page.goto('https://www.saucedemo.com/');
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    const buttons = page.locator('.btn_inventory');
    const before = await buttons.allTextContents();

    await buttons.nth(0).click();

    const after = await buttons.allTextContents();

    expect(after[0]).toBe('Remove');
   for (let i = 1; i < before.length; i++) {
    expect(after[i]).toBe(before[i]);
     }

    });

test('TC-26 verify the button for a just-added product shows exactly Remove', async ({ page }) => {
    // Click one product's Add to cart button, then check THAT SAME button's text.

    await page.goto('https://www.saucedemo.com/');
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    await page.locator("//button[@id='add-to-cart-sauce-labs-bolt-t-shirt']").click();
    await expect(page.locator("//button[@id='remove-sauce-labs-bolt-t-shirt']")).toHaveText('Remove')
});

test('TC-27 verify the 6 products stay in the same order after reloading the page', async ({ page }) => {
    // Save the name order, reload the page, read the names again, compare.

    await page.goto('https://www.saucedemo.com/');
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    const before=await page.locator('.inventory_item_name ').allTextContents();
    await page.reload();
    await expect(page).toHaveURL(/inventory.html/);
    const after=await page.locator('.inventory_item_name ').allTextContents();
    await expect(after).toEqual(before);

});

test('TC-28 verify the cart badge is not visible before anything is added', async ({ page }) => {
    // Fresh login, nothing added yet - the badge shouldn't exist on the page at all.

    await page.goto('https://www.saucedemo.com/');
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);

    // Hint: same rule as TC-17 in TEST-PLAN.md Day 4 - toHaveCount(0) says it best.
});

test('TC-29 verify every product description is longer than 20 characters', async ({ page }) => {
    // Not just "not empty" like TC-10 - a minimum length this time.



    await page.goto('https://www.saucedemo.com/');
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

    const desc=await page.locator('.inventory_item_desc').all();
    for(const des of desc){
        const texts=await des.textContent();
        await expect(texts.length).toBeGreaterThan(20);
    }
});

test('TC-30 verify no product name contains the word "undefined" or "null"', async ({ page }) => {
    // A safety-net test - catches broken data binding, which often shows up as
    // the literal text "undefined" or "null" leaking into the page.

    await page.goto('https://www.saucedemo.com/');
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

    const desc=await page.locator('.inventory_item_name').all();
    for(const des of desc){
        const texts=await des.textContent();
        await expect(texts).not.toContain('undefined');
        await expect(texts).not.toContain('null');
    }

    
});

test('TC-31 verify the Add to cart buttons are in the same left-to-right order as the product names', async ({ page }) => {
    // Each button's data-test id embeds the product name (e.g.
    // "add-to-cart-sauce-labs-backpack"). Check position 0's button matches
    // position 0's name, and so on - by INDEX, not by collecting separately.

    await page.goto('https://www.saucedemo.com/');
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

    // const names = await page.locator('.inventory_item_name').allTextContents();
    // const buttons = await page.locator('.btn_primary').all();

    // for (let i = 0; i < names.length; i++) {
    //     // "Sauce Labs Backpack" -> "sauce-labs-backpack", to match the
    //     // slug format saucedemo uses inside each button's data-test id.
    //     const slug = names[i].toLowerCase().replace(/\s+/g, '-');
    //     const dataTest = await buttons[i].getAttribute('data-test');
    //     expect(dataTest).toContain(slug);
    // }

    const names=await page.locator('.inventory_item_name').allTextContents();
    const buttons=await page.locator('.btn_primary').all();
    for(let i=0;i<names.length;i++){
        const slug=names[i].toLowerCase().replace(/\s+/g,'-');
        const dataTest=await buttons[i].getAttribute('data-test');
        expect(dataTest).toContain(slug);
    }
});

test('TC-32 verify each product card has exactly one name and one price inside it', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/');
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

    // const cardCount = await page.locator('.inventory_item').count();

    // for (let i = 0; i < cardCount; i++) {
    //     // Scoping a locator to just THIS card - card.locator(...) only
    //     // searches inside this one element, not the whole page.
    //     const card = page.locator('.inventory_item').nth(i);
    //     await expect(card.locator('.inventory_item_name')).toHaveCount(1);
    //     await expect(card.locator('.inventory_item_price')).toHaveCount(1);
    // }

    const cardCount=await page.locator('.inventory_item').count();
    for(let i=0;i<cardCount;i++){
        const card=page.locator('.inventory_item').nth(i);
        await expect(card.locator('.inventory_item_name')).toHaveCount(1);
        await expect(card.locator('.inventory_item_price')).toHaveCount(1);
    }
});

// ============================================================
//  WEEK 1, NO-HINT ROUND — figure out the selector AND the
//  technique yourself. No hint comments this time on purpose.
// ============================================================

test('TC-33 verify removing then re-adding the same item still shows a badge of 1, not 2', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

    // await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    // await page.click('[data-test="remove-sauce-labs-backpack"]');
    // await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');

    // await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']");
    await page.click("//button[@id='remove-sauce-labs-backpack']");
    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']");
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});

test('TC-34 verify the cart badge never displays the text "0"', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

    // Add one item, then remove it - if the badge were ever going to show
    // "0" instead of disappearing, this is the moment it would happen.
    // await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    // await page.click('[data-test="remove-sauce-labs-backpack"]');

    // // Same rule as TC-28: saucedemo deletes the badge element entirely
    // // when the cart is empty, rather than showing it with "0" inside.
    // await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);

    await page.click("//button[@id='add-to-cart-sauce-labs-backpack']");
    await page.click("//button[@id='remove-sauce-labs-backpack']");
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0)
});

test('TC-35 verify the 6 product names are still unique even when compared case-insensitively', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

    // const names = await page.locator('.inventory_item_name').allTextContents();

    
    // const lowerNames = names.map(name => name.toLowerCase());
    // const uniqueNames = new Set(lowerNames);
    // expect(uniqueNames.size).toBe(lowerNames.length);

    const names=await page.locator('.inventory_item_name').allTextContents();
    const lowerNames=names.map(p=>p.toLowerCase());
    const uniquesNames=new Set(lowerNames);
    expect(uniquesNames.size).toBe(lowerNames.length);
});

test('TC-36 verify a products Add to cart button becomes Remove immediately after clicking it, without a reload', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

    // No page.reload() anywhere here - just click, then check the SAME
    // button immediately. If it updates without a refresh, the site is
    // handling this client-side (React re-render), not a full page load.
    await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toHaveText('Remove');
});

// ============================================================
//  PRACTICE ROUND 5 — new territory: browser tab, keyboard,
//  hover, and monitoring the console/network instead of just
//  the DOM. Scenarios only - write the code.
// ============================================================

test('TC-37 verify the browser tab title is "Swag Labs"', async ({ page }) => {
    // A check on the PAGE, not an element - the tab title, not anything
    // visible in the body.

    await page.goto('https://www.saucedemo.com/');

    await expect(page).toHaveTitle('Swag Labs');
});

test('TC-38 verify the first product can be added to cart using only the keyboard', async ({ page }) => {
    // No .click() at all - Tab to the first Add to cart button, then press
    // Enter, and confirm the badge shows 1 anyway.

    await page.goto('https://www.saucedemo.com/');
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

    // .focus() moves keyboard focus onto the element directly, without
    // needing to Tab through every element before it one at a time -
    // more reliable than counting Tab presses, since that count can
    // change if the page markup changes.
    await page.locator('.btn_primary').first().focus();
    await page.keyboard.press('Enter');

    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});

test('TC-39 verify hovering over a product name does not navigate away from the inventory page', async ({ page }) => {
    // Hover is a NEW action - unlike click, it shouldn't trigger navigation
    // at all, so the URL should stay exactly where it was.

    await page.goto('https://www.saucedemo.com/');
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

    await page.locator('.inventory_item_name').first().hover();

    await expect(page).toHaveURL(/inventory.html/);
});

test('TC-40 verify the inventory page produces no browser console errors on load', async ({ page }) => {
    // A NEW idea: listening for an EVENT (a console message) instead of
    // reading the DOM. Set the listener up BEFORE you navigate, or you'll
    // miss messages that fire during page load.

    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });

    await page.goto('https://www.saucedemo.com/');
    const loginpage = new LoginPage(page);
    await loginpage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);

    expect(errors).toEqual([]);
});

test('TC-41 verify no product image request returns a 404', async ({ page }) => {
    // Same idea as TC-40, but listening for NETWORK responses instead of
    // console messages - another event, set up before navigating.



    // Hint: const failed = [];
    //       page.on('response', res => { if (res.status() === 404) failed.push(res.url()); });
    //       ...THEN goto()/login... finally expect(failed).toEqual([]).
});
