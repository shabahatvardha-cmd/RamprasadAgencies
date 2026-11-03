# Ram Prasad Agencies — Brand Catalog Status & Architecture

**Last Updated:** November 3, 2026  
**Progress:** 12 of 12 Brands Completed (240 / 240 Official Timepieces Verified — 100% Complete)

---

## 📌 Strict Architectural Rules
1. **Strict 20 Watches per Brand:**
   - Every brand (Titan, Titan Raga, Omega, Rado, HMT, Tissot, Seiko, Breitling, Citizen, Fastrack, Sonata, Fossil) displays **strictly 20 official models** (240 watches total).
   - Zero leaks from other brands, zero prototype/mock data.
2. **Zero Price Display:**
   - `price: null` and `originalPrice: null` across all watches.
   - Prices are replaced with official authorized retail credentials: `"Official Authorized Stock • Stamped Warranty"`.
3. **Directory-Based Numbered Images (100% Studio Cutouts):**
   - Both `frontend/public/images/watches/[brand-slug]/` and `admin/public/images/watches/[brand-slug]/` contain numbered webp files: `01.webp` through `20.webp`.
   - All 240 images are 1:1 square aspect ratio with 100% transparent backgrounds (`alpha = 0` at outer boundaries).
4. **Synchronized Datasets:**
   - `backend/data/watches.json`, `frontend/src/data/fallbackWatches.js`, and `admin/src/data/fallbackWatches.js` are in exact parity.

---

## ✅ Completed Brands (12 of 12 — 240 Watches)

| # | Brand Name | Slug | Models | Image Directory | Transparency Status |
| :-: | :--- | :--- | :-: | :--- | :-: |
| 1 | **Titan** | `titan` | 20 | `/images/watches/titan/01.webp` – `20.webp` | 100% Transparent Cutout ✅ |
| 2 | **Titan Raga** | `titan-raga` | 20 | `/images/watches/titan-raga/01.webp` – `20.webp` | 100% Transparent Cutout ✅ |
| 3 | **Omega** | `omega` | 20 | `/images/watches/omega/01.webp` – `20.webp` | 100% Transparent Cutout ✅ |
| 4 | **Rado** | `rado` | 20 | `/images/watches/rado/01.webp` – `20.webp` | 100% Transparent Cutout ✅ |
| 5 | **HMT** | `hmt` | 20 | `/images/watches/hmt/01.webp` – `20.webp` | 100% Transparent Cutout ✅ |
| 6 | **Tissot** | `tissot` | 20 | `/images/watches/tissot/01.webp` – `20.webp` | 100% Transparent Cutout ✅ |
| 7 | **Seiko** | `seiko` | 20 | `/images/watches/seiko/01.webp` – `20.webp` | 100% Transparent Cutout ✅ |
| 8 | **Breitling** | `breitling` | 20 | `/images/watches/breitling/01.webp` – `20.webp` | 100% Transparent Cutout ✅ |
| 9 | **Citizen** | `citizen` | 20 | `/images/watches/citizen/01.webp` – `20.webp` | 100% Transparent Cutout ✅ |
| 10 | **Fastrack** | `fastrack` | 20 | `/images/watches/fastrack/01.webp` – `20.webp` | 100% Transparent Cutout ✅ |
| 11 | **Sonata** | `sonata` | 20 | `/images/watches/sonata/01.webp` – `20.webp` | 100% Transparent Cutout ✅ |
| 12 | **Fossil** | `fossil` | 20 | `/images/watches/fossil/01.webp` – `20.webp` | 100% Transparent Cutout ✅ |
