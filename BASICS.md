# The basics — what every piece of a test actually means

This explains the syntax in your own working test, line by line, from zero.
Read it once, then again in a week. It'll make more sense the second time.

---

## The test you already wrote

```js
const { test, expect } = require('@playwright/test');
const LoginPage = require('../playwright/pages/login-page');

test('verify title in products page', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.title')).toHaveText('Products');
});
```

Eight ideas appear in there. That's all. Here they are one at a time.

---

## 1. `const` — giving something a name

```js
const loginPage = new LoginPage(page);
```

`const` means **"make a name for this thing so I can use it later."**

Read the line right-to-left: *build a LoginPage, and call it `loginPage`.*

After that line, every time you type `loginPage`, JavaScript knows you mean that thing.

> `const` is short for *constant* — it means the name won't be pointed at something else later. You'll also see `let` in other people's code, which means the name *can* change. You almost never need `let` in tests.

---

## 2. `require(...)` — borrowing tools from another file

```js
const { test, expect } = require('@playwright/test');
```

`require(...)` means **"go get the tools from that toolbox."**

- `'@playwright/test'` is Playwright's toolbox (it lives in `node_modules`)
- `{ test, expect }` means *"I only want these two tools out of it"*

```js
const LoginPage = require('../playwright/pages/login-page');
```

Same thing, but borrowing from **your own file**.

`..` means *go up one folder*. Your test is in `tests/`, so `..` climbs out to the project root, then walks down into `playwright/pages/`.

---

## 3. `test(...)` — declaring one test

```js
test('verify title in products page', async ({ page }) => {
    // steps go here
});
```

`test(...)` takes **two things** inside its brackets:

| Position | What it is |
|---|---|
| `'verify title in products page'` | the **name**, shown in your terminal when it runs |
| `async ({ page }) => { ... }` | the **steps** to actually run |

The name is just text for humans. Make it describe what you're checking — you'll thank yourself when a test fails and you're reading the terminal.

---

## 4. `({ page })` — asking for a browser tab

```js
async ({ page }) => {
```

This is you saying: **"Playwright, give me a fresh browser tab, and let me call it `page`."**

Playwright opens a brand-new, empty browser for every single test. That's deliberate — it means one test can never mess up another one. No leftover login, no leftover cart.

From then on, `page` **is** the browser tab. Everything you do to the browser, you do through `page`.

---

## 5. `=> { }` — "here are the steps"

```js
async ({ page }) => {
    await page.goto('...');
    await expect(...);
}
```

The `=>` (called an *arrow*) plus the curly brackets `{ }` mean **"and here's the list of things to do."**

Everything between `{` and `}` runs top to bottom, in order.

---

## 6. The dot `.` — "belonging to"

```js
page.goto(...)
page.click(...)
page.locator(...)
```

A dot means **"the thing on the right belongs to the thing on the left."**

`page.click(...)` = *the click action that belongs to this browser tab.*

That's why you write `page.goto`, not just `goto` — you have to say *which* browser tab you're talking to.

Dots also chain, left to right:

```js
page.locator('.inventory_item_name').first()
//   ^ find all of these         ^ then take the first one
```

Read it as a sentence: *page → find these → take the first.*

---

## 7. `await` — "wait for this to finish"

This is the one that confuses everybody. Here's why it exists.

A browser is **slow**. Clicking a button takes a few hundred milliseconds. Loading a page takes a second or two. Your code is fast — it would happily run the next line before the browser has caught up.

`await` means **"stop here until this is actually done, then continue."**

```js
await page.goto('https://www.saucedemo.com/');   // wait for the page to load
await page.click('#login-button');                // NOW click
```

Without the first `await`, you'd try to click a button on a page that hasn't loaded yet.

**Rule of thumb:** if a line touches the browser, it needs `await`. Forgetting it is the single most common beginner bug, and it produces weird random failures.

> `async` on the line above is just JavaScript's way of saying *"this block contains `await`s."* You need `async` before you're allowed to use `await` inside. They come as a pair.

---

## 8. `expect(...)` — making a claim

```js
await expect(page.locator('.title')).toHaveText('Products');
```

Split it into three parts:

| Part | Meaning |
|---|---|
| `page.locator('.title')` | **find** the thing with class `title` |
| `expect(...)` | *"I claim something about this thing"* |
| `.toHaveText('Products')` | the claim: *its text is "Products"* |

If the claim is true → the test passes.
If it's false → the test fails and tells you what it found instead.

**The nice part:** `expect` waits for you. If the heading takes a second to appear, `expect` keeps re-checking for up to 5 seconds before giving up. This is why you should never need a manual sleep.

---

## Two small things that trip people up

### Quotes

Text needs quotes. Numbers don't.

```js
toHaveText('Products')    // text  → quotes
toHaveCount(6)            // number → no quotes
toHaveText('1')           // the badge shows TEXT that happens to be a digit → quotes
```

`'single'` and `"double"` quotes both work. Pick one and be consistent.

### The slashes in `/inventory.html/`

```js
await expect(page).toHaveURL(/inventory.html/);       // slashes
await expect(page).toHaveURL('https://www.saucedemo.com/');   // quotes
```

- **Quotes** = *the URL is exactly this, character for character*
- **Slashes** = *the URL contains this bit somewhere*

The full inventory URL is `https://www.saucedemo.com/inventory.html`. Using `/inventory.html/` means you only care that `inventory.html` is in there, so you don't have to type the whole thing.

---

## Putting it together

Now read your own test as plain English:

```js
test('verify title in products page', async ({ page }) => {
```
> *Here's a test called "verify title in products page". Give me a browser tab.*

```js
    await page.goto('https://www.saucedemo.com/');
```
> *Open saucedemo, and wait for it to load.*

```js
    const loginPage = new LoginPage(page);
    await loginPage.ValidloginToApplication();
```
> *Get my login helper, pointed at this tab. Run its valid-login steps, and wait.*

```js
    await expect(page).toHaveURL(/inventory.html/);
```
> *I claim the URL now contains "inventory.html".*

```js
    await expect(page.locator('.title')).toHaveText('Products');
```
> *I claim the thing with class "title" says exactly "Products".*

```js
});
```
> *End of test.*

That's the whole language. Everything in your 15-day plan is these 8 ideas rearranged.

---

## Day 2 basics — two new things

Day 2 (TC-05 to TC-08) needs only two ideas you haven't met yet.

---

### A. Combining selectors

So far you've used one class at a time: `.title`, `.inventory_item`. You can also combine them.

#### A space means "inside"

```js
page.locator('.inventory_item img')
//            ^^^^^^^^^^^^^^^ ^^^
//            outer thing     inner thing
```

Read it as: **"an `img` that sits inside something with class `inventory_item`."**

The space is doing real work. Compare:

| Selector | Means |
|---|---|
| `.inventory_item` | the product card itself |
| `.inventory_item img` | the image **inside** a product card |
| `.inventory_item .inventory_item_price` | the price **inside** a product card |

Why bother? Because it stops you accidentally matching things elsewhere on the page. There might be another `img` in the header — `.inventory_item img` ignores it.

#### A tag name before the dot narrows it down

```js
page.locator('button.btn_inventory')
//            ^^^^^^ ^^^^^^^^^^^^^^
//            tag    class
```

Read it as: **"a `<button>` tag that has the class `btn_inventory`."**

No space this time. Space = *inside*. No space = *the same element, matching both conditions*.

| Selector | Means |
|---|---|
| `button.btn_inventory` | a button with that class — **same element** |
| `button .btn_inventory` | something with that class **inside** a button |

That single space completely changes the meaning. It's a classic beginner trap.

---

### B. Loops — doing the same check to 6 things

#### The problem

You want to check that **every** price starts with `$`. You can't do this:

```js
await expect(page.locator('.inventory_item_price')).toContainText('$');   // ✗
```

That matches 6 elements, and Playwright refuses — *"which one did you mean?"* (the strict mode error you've seen).

You *could* write it out six times with `.nth(0)`, `.nth(1)`… but that's silly. A loop does it properly.

#### Step 1 — `.all()` makes a list

```js
const prices = await page.locator('.inventory_item_price').all();
```

`.all()` means **"give me all 6 of them as a list."**

A **list** (programmers say *array*) is several things stored under one name. Think of a shelf with 6 slots:

```
prices  →  [ price1 , price2 , price3 , price4 , price5 , price6 ]
```

`prices` is now one name holding six things.

#### Step 2 — `for ... of` walks the list

```js
for (const price of prices) {
    await expect(price).toContainText('$');
}
```

Read it out loud: **"for each `price` in `prices`, do the thing in the brackets."**

| Part | Meaning |
|---|---|
| `prices` | the list of 6 |
| `price` | whichever one we're looking at *right now* |
| `{ ... }` | the work to repeat |

It runs 6 times. First time round, `price` is the 1st price. Second time, the 2nd. And so on. When the list runs out, the loop stops on its own — you never count anything yourself.

#### Why `price` and not something else?

That name is yours to pick. These are identical:

```js
for (const price of prices) { ... }
for (const p of prices) { ... }
for (const banana of prices) { ... }
```

Pick a name that describes one item. `price` is a good name because the list is prices.

> **Naming habit:** the list gets a plural name (`prices`), the one-at-a-time gets the singular (`price`). Do that and your loops read like English.

#### The whole thing together

```js
test('TC-07 verify every price starts with a dollar sign', async ({ page }) => {
    // ... login lines ...

    const prices = await page.locator('.inventory_item_price').all();   // make a list of 6

    for (const price of prices) {          // for each one...
        await expect(price).toContainText('$');   // ...check it has a $
    }
});
```

Note: `expect(price)` — not `expect(page.locator(...))`. Inside the loop, `price` **is already** the element. You've done the finding; now you just check it.

---

### What Day 2 does NOT need

You already know these from Day 1, and 3 of the 4 Day 2 tests use nothing else:

- `toHaveCount(6)` — TC-05, TC-06, TC-08 are all just this with different selectors
- the login lines
- the dot for a class

**So Day 2 is really one new test shape (the loop) plus three repeats of TC-03.**

---

## How to practise without writing from scratch

Take a test that passes and **break it on purpose**, one change at a time:

| Change | What you'll learn |
|---|---|
| `toHaveCount(6)` → `toHaveCount(5)` | what a count failure looks like |
| `toHaveText('Products')` → `'products'` | that text checks are case-sensitive |
| delete an `await` | what a missing-await bug looks like |
| `.first()` → `.last()` | how position selectors work |
| `'.title'` → `'.titel'` | what "element not found" looks like |

Run it, read the error, change it back. You always have a working version to return to, so you can't get stuck — and after a dozen of these, error messages stop being scary and start being useful.
