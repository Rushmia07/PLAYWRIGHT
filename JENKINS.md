# Running Playwright tests in Jenkins — how to

A step-by-step guide for this project, written for a beginner.

**My setup**
- Jenkins runs at **http://localhost:8080**
- Job name: **28.08.2026**
- Project folder used by Jenkins: `D:\jenkins-28.07.2026\PLAYWRIGHT`
- My working project: `d:\playwright`

---

## 1. Start Jenkins

Jenkins is a `.war` file you run with Java. Open **Command Prompt** and use the **full path** — one line, works from any folder:

```
java -jar C:\Users\hp\Downloads\jenkins.war
```

Then open **http://localhost:8080** in your browser.

> There's also a two-line version, but it's easier to get wrong:
> ```
> cd C:\Users\hp\Downloads
> java -jar jenkins.war
> ```
> If you use this one, **check your prompt changed** to `C:\Users\hp\Downloads>` before typing the second line. If it still says `C:\Users\hp>`, the `cd` didn't happen and Java won't find the file.

**Important:** leave that Command Prompt window **open**. Closing it stops Jenkins.

If port 8080 is already in use:

```
java -jar jenkins.war --httpPort=9090
```
…then browse to `http://localhost:9090` instead.

**First time only** — Jenkins prints an admin password in the console. If you miss it, it's saved here:
```
C:\Users\hp\.jenkins\secrets\initialAdminPassword
```

### Why `cd` first?

`java -jar jenkins.war` looks for `jenkins.war` **in the folder you are currently in**. If you're in `C:\Users\hp` but the file is in Downloads, you get:

```
Error: Unable to access jarfile jenkins.war
```

That error means *"wrong folder"*, not *"broken file"*.

---

## 2. The build commands

In Jenkins: **your job → Configure → Build Steps → Execute Windows batch command**

### Use ONE box with all four lines

```
cd /d D:\jenkins-28.07.2026\PLAYWRIGHT
npm install
npx playwright install
npx playwright test tests/loginapplication.spec.js --project=chromium
```

Then **Save** → **Build Now**.

### What each line does

| Line | What it does |
|---|---|
| `cd /d D:\...\PLAYWRIGHT` | move into the project folder |
| `npm install` | download the project's libraries (creates `node_modules`) |
| `npx playwright install` | download the browser binaries (Chromium, Firefox, WebKit) |
| `npx playwright test ...` | actually run the tests |

`npm install` and `npx playwright install` only need to do real work the first time. After that they finish in seconds.

---

## 3. If you prefer two separate build steps

Each box needs **its own `cd`** — see the explanation below for why.

**Box 1 — setup:**
```
cd /d D:\jenkins-28.07.2026\PLAYWRIGHT
npm install
npx playwright install
```

**Box 2 — run the tests:**
```
cd /d D:\jenkins-28.07.2026\PLAYWRIGHT
npx playwright test tests/loginapplication.spec.js --project=chromium
```

One box is simpler. Two boxes is only useful if you want setup and test-run to show as separate failures.

---

## 4. The two rules that break every beginner's build

### Rule 1 — `cd` needs `/d` to change drives

Jenkins starts in its own workspace on the **C: drive**:
```
C:\Users\hp\.jenkins\workspace\28.08.2026
```

My project is on **D:**. Plain `cd D:\folder` does **not** move you — it changes the directory *on D:* but leaves you sitting on C:.

```
cd D:\jenkins-28.07.2026\PLAYWRIGHT      ← silently does nothing useful
cd /d D:\jenkins-28.07.2026\PLAYWRIGHT   ← correct, switches drive too
```

`/d` means **"change the drive as well."**

### Rule 2 — every build step is a fresh cmd session

Jenkins forgets your `cd` between build steps. Box 2 starts back in the workspace on C:, as if box 1 never ran.

So: **every box that needs the project folder needs its own `cd /d` line.**

---

## 5. Reading the result

**Job page → Build number → Console Output**

| What you see | Meaning |
|---|---|
| `Finished: SUCCESS` | all tests passed ✅ |
| `Finished: FAILURE` | something failed — read upward to find the first error |
| `x  1 [chromium] › ...` | that specific test failed |
| `ok  1 [chromium] › ...` | that specific test passed |

Always read the console output from the **top down**. The first error is the real cause; everything after it is usually a knock-on effect.

---

## 6. Errors I actually hit, and what they meant

### `'D:\jenkins-28.07.2026\PLAYWRIGHT' is not recognized as an internal or external command`

I wrote the folder path on its own line with no `cd` in front. cmd tried to *run* the folder as a program.

**Fix:** put `cd /d ` in front of the path.

---

### `npm error enoent Could not read package.json`

```
npm error path C:\Users\hp\.jenkins\workspace\28.08.2026\package.json
```

`npm install` ran in the **Jenkins workspace** instead of my project folder — because the `cd` above it had failed. Look at the path in the error: it tells you exactly which folder npm was standing in.

**Fix:** make the `cd /d` line work, and npm will find `package.json`.

---

### `Error: Unable to access jarfile jenkins.war`

I was in the wrong folder when starting Jenkins.

**Fix:** `cd C:\Users\hp\Downloads` first.

---

## 7. Gotcha — the Jenkins folder is a *copy* of my project

`D:\jenkins-28.07.2026\PLAYWRIGHT` is a **separate copy**, made before I wrote the products tests. New tests I write in `d:\playwright` do **not** appear there automatically, so Jenkins won't run them.

### Option A — point Jenkins at my real project (simplest)

Change the first line to:

```
cd /d d:\playwright
npm install
npx playwright install
npx playwright test --project=chromium
```

Everything I write now runs in Jenkins immediately, and `npm install` is instant because `node_modules` already exists there.

### Option B — use Git (what real teams do)

1. Commit and push from `d:\playwright`
2. In Jenkins: **Configure → Source Code Management → Git**
3. Paste the repo URL
4. Jenkins pulls a fresh copy every build, so it's never out of date

Option B is the proper way and worth learning — but get a green build with Option A first.

---

## 8. Useful command variations

```bash
# Run every test in the project
npx playwright test --project=chromium

# Run one file
npx playwright test tests/products.spec.js --project=chromium

# Run one test by name
npx playwright test -g "verify cart icon" --project=chromium

# Run all three browsers (slower)
npx playwright test
```

> Use `--project=chromium` in Jenkins while you're learning. Running all three browsers triples the build time and makes failures harder to read.

---

## 9. Optional — see the HTML report in Jenkins

Playwright writes a nice HTML report to `playwright-report/`. To view it from the Jenkins job page:

1. Install the **HTML Publisher** plugin: *Manage Jenkins → Plugins → Available*
2. In your job: **Post-build Actions → Publish HTML reports**
3. Fill in:
   - **HTML directory to archive:** `playwright-report`
   - **Index page:** `index.html`
   - **Report title:** `Playwright Report`

A "Playwright Report" link then appears on every build page.

---

## 10. Quick checklist when a build fails

1. Is Jenkins still running? (is that Command Prompt window still open?)
2. Does the **first** line of the console output show a failed `cd`?
3. Does the `cd` have `/d` in it?
4. Does **every** build step have its own `cd`?
5. Does the folder you're `cd`-ing into actually contain `package.json`?
6. Is the test file name spelled exactly right, including `.spec.js`?
