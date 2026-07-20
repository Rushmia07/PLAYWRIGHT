# Git Push Cheat Sheet

A step-by-step reference for pushing a project to GitHub — based on the exact
issues fixed while setting up this repo. Follow it top to bottom for any new project.

---

## 0. One-time setup (only needed once per computer)

Git refuses to commit without an identity. Set it once globally:

```powershell
git config --global user.name "Rushmia07"
git config --global user.email "qa@tulip-tech.com"
```

Check it any time:

```powershell
git config --global --get user.name
git config --global --get user.email
```

> Tip: use `--global` so every project on this PC inherits it. Drop `--global`
> to set it for just the current repo.

---

## 1. Start a repo (new project)

```powershell
git init                 # create a local git repo
git add .                # stage ALL files
git status               # (optional) see what's staged
```

---

## 2. Commit (SAVE the staged files — do NOT skip this)

```powershell
git commit -m "Your message here"
```

> `git add` only stages. `git push` uploads **commits**. If you never commit,
> push fails with: `src refspec main does not match any`.

---

## 3. Connect to GitHub (first time only)

```powershell
git remote add origin https://github.com/Rushmia07/PLAYWRIGHT.git
git remote -v            # verify the remote URL
```

> Replace the URL with your own repo's URL.

---

## 4. Push

```powershell
git push -u origin main
```

- The `-u` sets `origin/main` as the default, so next time you can just run `git push`.
- On the **first push**, GitHub asks you to log in — a browser popup appears
  (Git Credential Manager). Complete the login there.
- **Run this in your OWN terminal**, not inside an automated/non-interactive tool,
  or the login popup can't appear.

---

## 5. Everyday workflow (after the first push)

```powershell
git add .
git commit -m "What I changed"
git push
```

---

## Common errors & fixes (the ones that tripped me up)

### ❌ `running scripts is disabled on this system` (PowerShell, before git even runs)
Execution policy is blocking npm/npx. Fix once:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### ❌ `src refspec main does not match any`
You have no commits. → Run `git commit -m "..."` first, then push.

### ❌ Commit seems to do nothing / no commits created
Git identity not set. → See **Step 0**, then commit again.

### ❌ `failed to push ... Updates were rejected ... (fetch first)`
The remote has commits you don't have (e.g. a README made on GitHub).
Pull and merge them, then push:
```powershell
git pull origin main --allow-unrelated-histories --no-edit
git push -u origin main
```
> `--allow-unrelated-histories` is only needed the first time, when local and
> remote started separately. After that, a plain `git pull` is enough.

### ❌ `could not read Username for 'https://github.com'`
Auth couldn't prompt. Run the push in your own interactive terminal.
If it still won't authenticate, use a Personal Access Token in the URL:
```powershell
# Create a token: GitHub -> Settings -> Developer settings ->
# Personal access tokens (classic) -> Generate -> tick "repo" -> copy it
git remote set-url origin https://Rushmia07:YOUR_TOKEN@github.com/Rushmia07/PLAYWRIGHT.git
git push -u origin main
```

---

## Quick reference

| Command | What it does |
|---|---|
| `git init` | Start a new local repo |
| `git status` | Show staged/unstaged changes |
| `git add .` | Stage all changes |
| `git commit -m "msg"` | Save staged changes as a commit |
| `git remote add origin <url>` | Link to a GitHub repo |
| `git remote -v` | Show linked remotes |
| `git push -u origin main` | First push (sets upstream) |
| `git push` | Push after upstream is set |
| `git pull` | Download + merge remote changes |
| `git log --oneline` | Compact commit history |
