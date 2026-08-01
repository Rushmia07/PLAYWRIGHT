# 15-Day Automation Plan — saucedemo.com

**Goal:** automate the whole site in 15 days, 4 test cases per day = **60 tests**.

**Start:** Tuesday, 28 July 2026 &nbsp;•&nbsp; **Finish:** Tuesday, 11 August 2026

**Site under test:** https://www.saucedemo.com/
**Login:** `standard_user` / `secret_sauce`

**Already done:** the Login module (16 tests in [tests/loginapplication.spec.js](tests/loginapplication.spec.js)) — that work is not repeated below.

> The dates run straight through, weekends included. Weekend days are **1–2 Aug** (Day 5–6) and **8–9 Aug** (Day 12–13). If you don't want to work weekends, push everything back by 4 days and finish on **Saturday 15 August**.

---

## Calendar at a glance

| Date | Day | Feature |
|---|---|---|
| Tue 28 Jul | Day 1 | Inventory page UI |
| Wed 29 Jul | Day 2 | Product listing content |
| Thu 30 Jul | Day 3 | Add to cart |
| Fri 31 Jul | Day 4 | Remove from cart |
| Sat 1 Aug | Day 5 | Cart page |
| Sun 2 Aug | Day 6 | Cart page buttons |
| Mon 3 Aug | Day 7 | Product detail page |
| Tue 4 Aug | Day 8 | Detail page cart actions |
| Wed 5 Aug | Day 9 | Sorting ⚠️ harder |
| Thu 6 Aug | Day 10 | Checkout form validation |
| Fri 7 Aug | Day 11 | Checkout form behaviour |
| Sat 8 Aug | Day 12 | Overview & totals ⚠️ harder |
| Sun 9 Aug | Day 13 | Order completion |
| Mon 10 Aug | Day 14 | Burger menu & navigation |
| Tue 11 Aug | Day 15 | Other users & full regression |

---

## How to use this plan

Each day gives you:

- **Feature** — the part of the site you're testing
- **New thing you'll learn** — one new Playwright concept per day, nothing more
- **Selectors** — so you never get stuck hunting for them
- **4 test cases** — write them in the order listed, easiest first

Days are ordered easiest → hardest. Don't skip ahead: Day 12 uses skills from Day 5.

### Suggested daily routine (about 1–1.5 hours)

1. Open the site in a browser and click through the feature manually first. Always do this — you can't automate what you haven't seen.
2. Create the spec file for the day.
3. Write test 1, run it, get it green.
4. Repeat for tests 2, 3, 4.
5. Run the whole file one last time before you stop.

### Commands you'll use every day

```bash
# Run one file
npx playwright test tests/cart.spec.js

# Run one test by name
npx playwright test -g "Badge shows 1"

# Run in one browser only (faster while developing)
npx playwright test tests/cart.spec.js --project=chromium

# Watch it happen in a real browser window
npx playwright test tests/cart.spec.js --project=chromium --headed

# Open the report after a failure
npx playwright show-report
```

> **Tip:** while writing a test, always add `--project=chromium`. Running all 3 browsers every time is slow and the failures are noisy. Run all 3 only at the end of the day.

---

## The only 8 commands you need

Almost every test in this plan is built from these. If you know these 8, you can write all 60 tests.

**Doing things:**
```js
await page.goto('https://www.saucedemo.com/');   // open a page
await page.click('.shopping_cart_link');          // click something
await page.fill('#user-name', 'standard_user');   // type into a box
```

**Checking things:**
```js
await expect(page).toHaveURL(/inventory.html/);              // right page?
await expect(page.locator('.title')).toBeVisible();          // is it on screen?
await expect(page.locator('.title')).toHaveText('Products'); // exact text
await expect(page.locator('.title')).toContainText('Prod');  // partial text
await expect(page.locator('.inventory_item')).toHaveCount(6);// how many?
```

`page.locator('...')` just means "find this thing on the page". Everything else is either doing something to it or checking it.

---

## How to write a test on your own — fill in 2 blanks

Every test on this site is this shape. The top 4 lines **never change**:

```js
test('___ say what you are checking, in plain English ___', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();

    await page.click('___SELECTOR___');                    // (only if you need to DO something first)
    await expect(page.locator('___SELECTOR___')).___CHECK___;
});
```

### Blank 1 — SELECTOR: which thing on the page

1. Open the page in Chrome
2. Right-click the thing → **Inspect**
3. Find `class=` or `id=` in the highlighted HTML
4. `.` before a class, `#` before an id

```html
<span class="title">Products</span>    →    '.title'
<input id="user-name">                 →    '#user-name'
```

You never invent a selector. You **read it off the page.**

### Blank 2 — CHECK: what you want to be true

Say it in plain English, then look it up:

| You want to say… | You write |
|---|---|
| "it's on the screen" | `toBeVisible()` |
| "it says exactly this" | `toHaveText('Products')` |
| "this text is in there somewhere" | `toContainText('$')` |
| "there are 6 of them" | `toHaveCount(6)` |
| "it's gone" | `toHaveCount(0)` |
| "the box contains this" | `toHaveValue('standard_user')` |
| "we're on the right page" | `await expect(page).toHaveURL(/cart.html/)` |

**Those 7 cover nearly every test in this plan.** Writing a test is picking one selector and one check — not inventing code.

### Stuck? Copy the nearest working test and change the two blanks.

That is what experienced testers do too. Nobody types tests from memory.

---

## A complete Day 1 test, start to finish

Copy this, run it, then write the other three yourself by changing the last two lines.

```js
const { test, expect } = require('@playwright/test');
const LoginPage = require('../playwright/pages/login-page');

test('Products heading is displayed', async ({ page }) => {
    // 1. Open the site
    await page.goto('https://www.saucedemo.com/');

    // 2. Log in using the page object you already built
    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();

    // 3. Check we got to the products page
    await expect(page).toHaveURL(/inventory.html/);

    // 4. Check the heading says "Products"
    await expect(page.locator('.title')).toHaveText('Products');
});
```

Save it as `tests/inventory.spec.js` and run:

```bash
npx playwright test tests/inventory.spec.js --project=chromium
```

Every single test in this plan follows that same 4-step shape: **open → log in → check the page → check the thing**. The only part that changes is step 4.

---

## Week 1 — Products & Cart

### Day 1 — Tuesday, 28 July — Inventory page UI ✅ DONE
**File:** `tests/products.spec.js`
**New thing:** `toHaveCount()` — asserting on *many* elements at once, not just one.

| Selector | What it is |
|---|---|
| `.title` | The "Products" heading |
| `.inventory_item` | One product card (there are 6) |
| `.inventory_item_name` | Product names |
| `.shopping_cart_link` | Cart icon (top right) |

Every test starts by logging in with your existing `ValidloginToApplication()`.

- [x] 1. Page heading shows "Products"
- [x] 2. Cart icon is visible
- [x] 3. Exactly 6 products are listed
- [x] 4. The first product is named "Sauce Labs Backpack"

---

### Day 2 — Wednesday, 29 July — Product listing content
**File:** `tests/products.spec.js` (same file, add to it)
**New thing:** looping over a list of elements with `.all()`.

| Selector | What it is |
|---|---|
| `.inventory_item_price` | Price text, e.g. `$29.99` |
| `.inventory_item_img img` | Product image |
| `.inventory_item_desc` | Product description |
| `button.btn_inventory` | The Add to cart button on a card |

- [ ] 1. All 6 products have a visible image
- [ ] 2. All 6 products have a price
- [ ] 3. Every price starts with a `$`
- [ ] 4. Every product has an "Add to cart" button

For 3 and 4, loop like this:
```js
for (const price of await page.locator('.inventory_item_price').all()) {
    await expect(price).toContainText('$');
}
```

---

### Day 3 — Thursday, 30 July — Add to cart
**File:** `tests/cart.spec.js`
**New thing:** selectors that change per product.

| Selector | What it is |
|---|---|
| `[data-test="add-to-cart-sauce-labs-backpack"]` | Add backpack |
| `[data-test="add-to-cart-sauce-labs-bike-light"]` | Add bike light |
| `.shopping_cart_badge` | The little number on the cart icon |

- [ ] 1. Add one item → badge shows `1`
- [ ] 2. Add one item → its button text changes to "Remove"
- [ ] 3. Add two items → badge shows `2`
- [ ] 4. Add all six items → badge shows `6`

> The product name inside `data-test` is the product title, lowercased, spaces replaced with `-`.

---

### Day 4 — Friday, 31 July — Remove from cart
**File:** `tests/cart.spec.js`
**New thing:** asserting an element is **gone from the page**, not just hidden.

| Selector | What it is |
|---|---|
| `[data-test="remove-sauce-labs-backpack"]` | Remove backpack |

- [ ] 1. Add then remove → badge disappears completely
- [ ] 2. After removing → button text goes back to "Add to cart"
- [ ] 3. Add 3, remove 1 → badge shows `2`
- [ ] 4. Add all 6, remove all 6 → badge is gone

For test 1, the badge is **deleted from the page**, so this is the assertion you want:
```js
await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
```
`toBeHidden()` also works here, but `toHaveCount(0)` says exactly what you mean.

---

### Day 5 — Saturday, 1 August — Cart page
**File:** `tests/cartpage.spec.js`
**New thing:** saving a value from one page and comparing it on another.

| Selector | What it is |
|---|---|
| `.shopping_cart_link` | Cart icon — click to open cart |
| `.cart_item` | A row in the cart |
| `.cart_quantity` | Quantity number |
| `.inventory_item_name` | Item name (same class in cart) |

- [ ] 1. Clicking the cart icon goes to `cart.html`
- [ ] 2. The item you added appears in the cart
- [ ] 3. Quantity shows `1`
- [ ] 4. The cart price matches the price shown on the products page

For test 4:
```js
const listPrice = await page.locator('.inventory_item_price').first().textContent();
// ... go to cart ...
await expect(page.locator('.inventory_item_price')).toHaveText(listPrice);
```

---

### Day 6 — Sunday, 2 August — Cart page buttons
**File:** `tests/cartpage.spec.js`
**New thing:** nothing new — a consolidation day. Enjoy it.

| Selector | What it is |
|---|---|
| `[data-test="continue-shopping"]` | Continue Shopping |
| `[data-test="checkout"]` | Checkout |
| `[data-test="remove-sauce-labs-backpack"]` | Remove (also works in cart) |

- [ ] 1. Continue Shopping → back to `inventory.html`
- [ ] 2. Removing an item in the cart empties the cart
- [ ] 3. An empty cart shows 0 cart rows
- [ ] 4. Checkout → goes to `checkout-step-one.html`

---

### Day 7 — Monday, 3 August — Product detail page
**File:** `tests/productdetail.spec.js`
**New thing:** the difference between the app's own Back button and `page.goBack()`.

| Selector | What it is |
|---|---|
| `.inventory_item_name` | Click a name to open its detail page |
| `.inventory_details_name` | Product name on the detail page |
| `.inventory_details_price` | Price on the detail page |
| `[data-test="back-to-products"]` | Back to products button |

- [ ] 1. Clicking a product name goes to `inventory-item.html`
- [ ] 2. The detail page shows the correct product name
- [ ] 3. The detail page shows the correct price
- [ ] 4. "Back to products" returns to `inventory.html`

---

## Week 2 — Checkout & advanced

### Day 8 — Tuesday, 4 August — Add to cart from the detail page
**File:** `tests/productdetail.spec.js`
**New thing:** checking that state survives navigation between pages.

- [ ] 1. Add to cart from the detail page → badge shows `1`
- [ ] 2. Remove from the detail page → badge disappears
- [ ] 3. Add from detail page, open cart → item is there
- [ ] 4. Add from detail page, go back to products → badge still shows `1`

---

### Day 9 — Wednesday, 5 August — Sorting ⚠️
**File:** `tests/sorting.spec.js`
**New thing:** `selectOption()` for dropdowns.

| Selector | What it is |
|---|---|
| `[data-test="product-sort-container"]` | The sort dropdown |

Dropdown values: `az`, `za`, `lohi`, `hilo`

- [ ] 1. Default sort is A→Z
- [ ] 2. Z→A reverses the name order
- [ ] 3. Price low→high puts $7.99 first
- [ ] 4. Price high→low puts $49.99 first

**Start with the easy version.** Just check the *first* item after sorting — no arrays, no loops:
```js
await page.selectOption('[data-test="product-sort-container"]', 'za');
await expect(page.locator('.inventory_item_name').first())
    .toHaveText('Test.allTheThings() T-Shirt (Red)');
```
That's a perfectly valid test and it's all four test cases done.

**Only if that feels easy**, try the thorough version — read every name into a list, sort your own copy, and compare:
```js
const names = await page.locator('.inventory_item_name').allTextContents();
const expected = [...names].sort().reverse();
expect(names).toEqual(expected);
```
Don't worry if that second snippet looks confusing right now. The first version is enough.

---

### Day 10 — Thursday, 6 August — Checkout form validation
**File:** `tests/checkout.spec.js`
**New thing:** nothing new — this is exactly like your login validation tests.

| Selector | What it is |
|---|---|
| `[data-test="firstName"]` | First Name |
| `[data-test="lastName"]` | Last Name |
| `[data-test="postalCode"]` | Zip / Postal Code |
| `[data-test="continue"]` | Continue |
| `[data-test="error"]` | Error message |

- [ ] 1. Submit empty form → "First Name is required"
- [ ] 2. First name only → "Last Name is required"
- [ ] 3. First + last name, no zip → "Postal Code is required"
- [ ] 4. All three filled → goes to `checkout-step-two.html`

---

### Day 11 — Friday, 7 August — Checkout form behaviour
**File:** `tests/checkout.spec.js`
**New thing:** `toHaveValue()` for reading what's inside an input.

| Selector | What it is |
|---|---|
| `[data-test="cancel"]` | Cancel button |
| `.error-button` | The X that closes the error message |

- [ ] 1. Cancel → returns to `cart.html`
- [ ] 2. Clicking the X dismisses the error message
- [ ] 3. Typed values stay in the fields after a validation error
- [ ] 4. Fields are empty when you first arrive on the page

---

### Day 12 — Saturday, 8 August — Checkout overview & totals ⚠️
**File:** `tests/checkoutoverview.spec.js`

| Selector | What it is |
|---|---|
| `.summary_subtotal_label` | "Item total: $29.99" |
| `.summary_tax_label` | "Tax: $2.40" |
| `.summary_total_label` | "Total: $32.39" |

**Easy version — do this one.** Add only the backpack ($29.99) and check the three known amounts as plain text. No maths at all:

- [ ] 1. The overview lists "Sauce Labs Backpack"
- [ ] 2. Item total shows `Item total: $29.99`
- [ ] 3. Tax shows `Tax: $2.40`
- [ ] 4. Total shows `Total: $32.39`

```js
await expect(page.locator('.summary_subtotal_label'))
    .toHaveText('Item total: $29.99');
```

That's a real, useful test — it will genuinely catch a broken totals calculation.

**Harder version, only if you want it later:** pull the numbers out of the text and check the maths yourself, so the test still works if prices change.

```js
const text = await page.locator('.summary_subtotal_label').textContent();
const subtotal = Number(text.replace('Item total: $', ''));   // "Item total: $29.99" -> 29.99
```

Skip the harder version on your first pass. You can always come back to it.

---

### Day 13 — Sunday, 9 August — Order completion
**File:** `tests/checkoutcomplete.spec.js`
**New thing:** your first full end-to-end journey in one test.

| Selector | What it is |
|---|---|
| `[data-test="finish"]` | Finish button |
| `.complete-header` | "Thank you for your order!" |
| `[data-test="back-to-products"]` | Back Home |

- [ ] 1. Finish → goes to `checkout-complete.html`
- [ ] 2. "Thank you for your order!" is displayed
- [ ] 3. Back Home → returns to `inventory.html`
- [ ] 4. The cart badge is empty after completing an order

---

### Day 14 — Monday, 10 August — Burger menu & navigation
**File:** `tests/navigation.spec.js`
**New thing:** navigating to an external site.

| Selector | What it is |
|---|---|
| `#react-burger-menu-btn` | Open the menu |
| `#inventory_sidebar_link` | All Items |
| `#about_sidebar_link` | About |
| `#reset_sidebar_link` | Reset App State |
| `#react-burger-cross-btn` | Close the menu |

- [ ] 1. All Items → `inventory.html`
- [ ] 2. About → goes to `saucelabs.com`
- [ ] 3. Reset App State clears the cart badge
- [ ] 4. The X button closes the menu

> You already have `home-page.js` with the menu button and logout link — extend that file rather than making a new one.

---

### Day 15 — Tuesday, 11 August — Other users & full regression
**File:** `tests/users.spec.js`
**New thing:** testing that broken things are *predictably* broken.

All these users share the password `secret_sauce`:

| User | What's wrong with it |
|---|---|
| `problem_user` | All product images are the same broken picture |
| `performance_glitch_user` | Login is very slow (but works) |
| `error_user` | Cart and checkout behave incorrectly |
| `visual_user` | Layout is visually broken |

- [ ] 1. `problem_user` logs in and lands on the inventory page
- [ ] 2. `performance_glitch_user` logs in successfully (allow extra time)
- [ ] 3. `problem_user` sees identical image sources on all products
- [ ] 4. **Full journey:** login → add 2 items → cart → checkout → finish → "Thank you for your order!"

Then run everything, in all three browsers, one final time:

```bash
npx playwright test
```

🎉 **Done — 11 August 2026.**

---

## Progress tracker

| Date | Day | Feature | Tests | Done |
|---|---|---|---|---|
| — | — | Login *(already complete)* | 16 | ✅ |
| Tue 28 Jul | 1 | Inventory page UI | 4 | ✅ |
| Wed 29 Jul | 2 | Product listing content | 4 | ☐ |
| Thu 30 Jul | 3 | Add to cart | 4 | ☐ |
| Fri 31 Jul | 4 | Remove from cart | 4 | ☐ |
| Sat 1 Aug | 5 | Cart page | 4 | ☐ |
| Sun 2 Aug | 6 | Cart page buttons | 4 | ☐ |
| Mon 3 Aug | 7 | Product detail page | 4 | ☐ |
| Tue 4 Aug | 8 | Detail page cart actions | 4 | ☐ |
| Wed 5 Aug | 9 | Sorting | 4 | ☐ |
| Thu 6 Aug | 10 | Checkout form validation | 4 | ☐ |
| Fri 7 Aug | 11 | Checkout form behaviour | 4 | ☐ |
| Sat 8 Aug | 12 | Overview & totals | 4 | ☐ |
| Sun 9 Aug | 13 | Order completion | 4 | ☐ |
| Mon 10 Aug | 14 | Burger menu & navigation | 4 | ☐ |
| Tue 11 Aug | 15 | Other users & regression | 4 | ☐ |
| | | **Total** | **76** | |

---

## Page objects you'll build

You have two already. By Day 15 you'll have six:

```
playwright/pages/
  login-page.js        ✅ done
  home-page.js         ✅ done (extend on Day 14)
  inventory-page.js    Day 1–2, reused Days 3, 4, 9
  cart-page.js         Day 5–6
  product-detail-page.js   Day 7–8
  checkout-page.js     Day 10–13
```

**Rule of thumb:** get the test passing first with `page.locator(...)` written directly in the spec file. Once it's green, move the selectors into a page object. Organizing code you haven't got working yet is the most common way beginners get stuck.

---

## Things that will trip you up

**1. Logging in for every test gets repetitive.** Around Day 5, replace the copy-pasted login with a hook:

```js
test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await new LoginPage(page).ValidloginToApplication();
});
```

**2. The cart persists between tests in the same browser.** Saucedemo remembers your cart in browser storage. If a test fails oddly, add a Reset App State (Day 14's menu item) or start the test fresh.

**3. `fill()` vs `press()`.** `fill()` sets a field's text. `press()` sends a keystroke. Key names are capitalised: `Tab`, `Enter`, `Escape`.

**4. Don't use `waitForTimeout()`.** If a test seems flaky, the fix is a better assertion, not a sleep. Playwright's `expect()` already waits up to 5 seconds on its own.

**5. Falling behind is fine.** 4 tests a day is the target, not a rule. Days 9 and 12 are marked ⚠️ because they're genuinely harder — if they take two days each, you finish on **Thursday 13 August**. A working suite on the 13th beats a broken one on the 11th.
