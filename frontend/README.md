# Ram Prasad Agencies — Customer Storefront
### *TheWatchStore.in • Golghar, Gorakhpur*

This is the customer-facing digital boutique for **Ram Prasad Agencies**, designed to bring the prestige, heritage, and personalized service of our physical Gorakhpur showrooms straight to customers' phones and laptops.

We built this experience to feel like walking into a modern haute horlogerie boutique: clean editorial design, crisp typography, stunning timepiece photography, and instant WhatsApp concierge support.

---

## ✨ The Customer Experience

### 1. Modern, Clean Aesthetics
- **Typography**: Hand-tuned geometric sans-serif type stack (`Plus Jakarta Sans` and `Inter`) inspired by modern luxury and performance brands. Crisp, highly legible, and free of clutter.
- **Color Palette**: Sophisticated obsidian dark background (`#121212`) paired with warm champagne brass (`#D4AF37`) accents and subtle glassmorphic containers.
- **Pure Customer Space**: All admin controls, edit toggles, and staff buttons have been completely removed. Customers enjoy an uninterrupted, premium browsing experience.

### 2. Cinematic Hero Showcase
- Centered showcase highlighting flagship collections.
- Clean left (`←`) and right (`→`) arrows with bottom indicator dots allowing customers to glide through current featured timepieces at their own pace.

### 3. Interactive Brand Showcase & Filters
- Features our authorized collections: **Titan**, **Omega**, **Tissot**, **Seiko**, **Citizen**, **Casio Edifice**, **Fossil**, and more.
- Clicking any brand instantly filters the showcase so customers can view timepieces from their preferred maison.

### 4. Watch Vault & Indian Rupee (`₹`) Pricing
- Every timepiece card highlights high-definition photos, official brand marks, case specifications, and prices formatted in standard Indian Rupees (e.g., `₹ 45,900` or `₹ 12,50,000`).
- **Showroom Availability**: Clear badges show whether the piece is ready for immediate fitting at Baldev Plaza or JalKal Building.

### 5. 1-Click WhatsApp Concierge
- We know watch buying in India is personal and relational. Every timepiece card includes an **"Inquire on WhatsApp"** button.
- Clicking the button automatically opens WhatsApp with a pre-formatted message including the exact watch name, reference number, and price, connecting the buyer directly with our store team (`+91 98765 43210`).

### 6. Dual Golghar Showrooms Locator (`#showrooms`)
- Detailed cards for our two landmark Gorakhpur addresses:
  - **Flagship 1**: Baldev Plaza, Golghar (Automatics, Swiss horology, luxury collectors).
  - **Flagship 2**: Shop No. 1, JalKal Building, Golghar (Everyday chronographs, authorized service center, bracelet resizing, ultrasonic cleaning).
- Includes operating hours (10:30 AM – 9:00 PM), landmark directions, and instant phone call triggers.

### 7. VIP Consultation & Sourcing Form
- A dedicated inquiry section for private showroom fittings, vintage appraisals, or sourcing hard-to-find references.
- **Smart Validation**: Includes an international country code selector (defaults to `+91` India) and strictly validates 10-digit mobile numbers so our team never receives incomplete phone numbers.

---

## 🚀 Running the Storefront Locally

Open a terminal in the `frontend` folder:

```powershell
# 1. Install dependencies (first time only)
npm install

# 2. Start the Vite server
npm run dev
```

The storefront will start at **`http://localhost:5173`**.

If you've enabled our custom domain helper, you can visit it directly at:
👉 **`http://ramprasadwatchstore.in/#showrooms`** (or `http://ramprasadwatchstore.lvh.me/#showrooms`).

---

## 📂 Key Files Overview

- **`src/components/Header.jsx`**: Clean store header featuring our signature logo, showroom navigation, and concierge hotline.
- **`src/components/HeroBanner.jsx`**: Hero slider with modern navigation controls and taglines.
- **`src/components/BrandMarquee.jsx`**: Dynamic brand ribbon and interactive filters.
- **`src/components/WatchCard.jsx`**: Luxury timepiece card with photo zoom and WhatsApp inquiry trigger.
- **`src/components/ShowroomLocator.jsx`**: Interactive guide to our Baldev Plaza and JalKal Building locations.
- **`src/components/InquiryForm.jsx`**: Customer consultation form with 10-digit number and country code validation.
- **`src/context/StoreContext.jsx`**: Live state manager that keeps the storefront automatically in sync with updates saved in the Admin Studio.
