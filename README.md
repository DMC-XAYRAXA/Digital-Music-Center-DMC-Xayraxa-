# DMC Xayraxa Super App — Revision 2.6

**Digital Music Center (DMC Xayraxa)** • Vientiane Capital, Lao PDR  
Consolidated Specification **Revision 2.6** — Full-Stack Music Production, 3-Level Unilevel Network, and Authoritative Integer LAK Double-Entry Ledger.

---

## Key Features

- **6-Language Localization**: Instant switching between **English (`EN`)**, **Lao (`ລາວ`)**, **Thai (`ไทย`)**, **Vietnamese (`Việt`)**, **Chinese (`中文`)**, and **Korean (`한국어`)**.
- **Classic User & Super Admin Authentication Portal**:
  - Dedicated Member Login (`DM000101` – `DM000106`), New Member Registration (`FREE_MEMBER` with zero upfront fee), and Super Admin Console (`ADMIN-ROOT`).
  - Profile, Password & Lao SMS OTP (`+856 20`) Account Recovery.
- **Authoritative 5-Balance Integer LAK Wallet**:
  - `PENDING`, `HELD_FOR_QUALIFICATION`, `AVAILABLE`, `WITHDRAWN`, and `REDEEMED_QUALIFICATION`.
  - Automatic qualification tracking toward `1,600,000 LAK` (`MUSIC_SINGLE_1600`) to unlock `ACTIVE_LIFETIME_MEMBER`.
- **3-Level Unilevel Commission Engine (No Binary)**:
  - Fixed 50% / 30% / 20% commission pool distribution across Level 1, Level 2, and Level 3 sponsors.
- **Official 4-Product Catalog & Banner Showcase**:
  1. `MUSIC_SINGLE_1600` — Original Song Production & Studio Debut Single (`1,600,000 LAK`)
  2. `STUDIO_HEADPHONES_950` — DMC Pro Studio Monitoring Headphones (`950,000 LAK`)
  3. `VOCAL_MIC_1450` — DMC Condenser Studio Microphone Kit (`1,450,000 LAK`)
  4. `LYRIC_COURSE_650` — Masterclass: Songwriting & Vocal Craft (`650,000 LAK`)
- **Lao Bank QR Payment Integration**:
  - Supports **BCEL One**, **LDB Trust**, **JDB Yes**, and **APBB Mobile** with dynamic EMVCo Lao QR generation.

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start development server on port 3000
npm run dev

# 3. Build for production
npm run build
```

---

## Deploying to GitHub & GitHub Pages

### Option 1: One-Click Save to GitHub from Google AI Studio
1. Click the **GitHub icon ("Save to GitHub")** in the top-right toolbar of Google AI Studio.
2. Sign in and authorize your GitHub account if prompted.
3. Enter a repository name (e.g., `dmc-xayraxa-super-app`), choose **Public** or **Private**, and click **Create / Push**.

### Option 2: Push via Git CLI
```bash
git init
git add .
git commit -m "Initial release: DMC Xayraxa Super App Rev 2.6"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/dmc-xayraxa-super-app.git
git push -u origin main
```

### Enable Automatic GitHub Pages Hosting
This project includes a pre-configured GitHub Actions workflow at `.github/workflows/deploy.yml`:
1. Open your repository on GitHub and go to **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Every push to `main` will automatically build and publish your live app to `https://<YOUR_GITHUB_USERNAME>.github.io/<REPO_NAME>/`.
