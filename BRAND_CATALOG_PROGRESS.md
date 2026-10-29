# Ram Prasad Agencies — Brand Catalog Status & Architecture

**Last Updated:** October 29, 2026  
**Progress:** 8 of 12 Brands Completed (160 / 240 Official Timepieces Verified)

---

## 📌 Strict Architectural Rules
1. **Strict 20 Watches per Brand:**
   - When a customer clicks any brand (e.g., Titan, Omega, Breitling), **strictly 20 official models** appear.
   - Zero leaks from other brands, zero prototype/mock data.
2. **Zero Price Display:**
   - `price: null` and `originalPrice: null` across all watches.
   - Prices are replaced with official authorized retail credentials: `"Official Authorized Stock • Stamped Warranty"`.
3. **Directory-Based Numbered Images:**
   - Both `frontend/public/images/watches/[brand-slug]/` and `admin/public/images/watches/[brand-slug]/` contain numbered webp files: `01.webp` through `20.webp`.
   - Anyone can swap or update photos simply by replacing `01.webp`, `02.webp`, etc. without touching code.
4. **Synchronized Datasets:**
   - Both `frontend/src/data/fallbackWatches.js` and `admin/src/data/fallbackWatches.js` are in exact parity.
   - Both export `FALLBACK_WATCHES` and `getWatchGender(watch)`.

---

## ✅ Completed Brands (8 of 12 — 160 Watches)

| # | Brand Name | Slug | Models | Image Directory | Status |
| :-: | :--- | :--- | :-: | :--- | :-: |
| 1 | **Titan** | `titan` | 20 | `/images/watches/titan/01.webp` – `20.webp` | Verified ✅ |
| 2 | **Titan Raga** | `titan-raga` | 20 | `/images/watches/titan-raga/01.webp` – `20.webp` | Verified ✅ |
| 3 | **Omega** | `omega` | 20 | `/images/watches/omega/01.webp` – `20.webp` | Verified ✅ |
| 4 | **Rado** | `rado` | 20 | `/images/watches/rado/01.webp` – `20.webp` | Verified ✅ |
| 5 | **HMT** | `hmt` | 20 | `/images/watches/hmt/01.webp` – `20.webp` | Verified ✅ |
| 6 | **Tissot** | `tissot` | 20 | `/images/watches/tissot/01.webp` – `20.webp` | Verified ✅ |
| 7 | **Seiko** | `seiko` | 20 | `/images/watches/seiko/01.webp` – `20.webp` | Verified ✅ |
| 8 | **Breitling** | `breitling` | 20 | `/images/watches/breitling/01.webp` – `20.webp` | Verified ✅ |

---

## ⏳ Remaining Brands (4 of 12 — 80 Watches to go)
Brands 9 through 12 to be supplied by the user (e.g. Citizen, Casio, Fossil, Cartier / Tag Heuer).

---

## 🚀 How to Resume in Future Sessions
Whenever you return, you can simply type:
> **"Continue with brand 9: [Brand Name]"** (along with your 20-watch table or image)

The AI will read this file, maintain the exact 20-watch-per-brand architecture, populate `01.webp`–`20.webp`, hide prices, and verify parity!
