# Ram Prasad Agencies — Admin Studio & Horlogerie Suite

Welcome to the **Admin Studio** for Ram Prasad Agencies. We built this management dashboard to give our boutique staff complete, stress-free control over our digital storefront — from adding rare timepieces and updating festive announcements to managing incoming VIP customer leads.

Everything here updates in real time. When you make an edit, our customer storefront at `ramprasadwatchstore.in` syncs right away.

---

## 🔑 Logging In

For store security, the Admin Studio is completely decoupled from the customer storefront. Customers will never see an edit button or login banner.

- **Admin URL**: `http://admin.ramprasadwatchstore.in/` (or `http://localhost:3000`)
- **Default Username**: `admin`
- **Default Password**: `admin123`
- **Quick Demo Access**: A single-click shortcut is available on the login card for quick testing during local development.

---

## 🎨 What You Can Do in the Studio

### 1. Toggle Between Edit & Preview Modes
At the top of the screen, you will find our segmented control bar:
- **`[ ✏️ Edit Mode ]`**: Highlights editable sections with golden dashed borders and handy "Edit" pills. Click any section (Hero banner, announcement ticker, brand marquee, inquiry form, VIP circle) to open its customization modal.
- **`[ 👁️ Preview Mode ]`**: Hides all editor borders so you can see exactly how the site appears to an everyday customer walking into your virtual showroom.

### 2. Live Quick Edit Drawer
Click **"Quick Edit"** in the top bar to open a clean slide-over drawer:
- **Announcement Ticker**: Change promotional ribbons (e.g., *"Diwali Luxury Showcase — Visit our Golghar Flagships"*).
- **Hero Banner**: Update the main headline and subtitle with live typing preview.
- **Brand Portfolio**: Manage the list of luxury maisons shown in the marquee (Rolex, Omega, Cartier, Tissot, Seiko, Casio, etc.).
- **Trust Badges**: Update your authenticity guarantee, master horologist service details, and flagship showroom notes.
- **VIP Circle & Helpline**: Edit concierge phone numbers (`+91 98765 43210`) and member circle perks.

### 3. Customer Leads Inbox
Click **"Customer Leads"** in the top bar to review incoming customer consultations:
- Displays customer names, verified 10-digit phone numbers with country codes (`+91`, `+1`, etc.), and inquiry type (e.g., Private Showroom Fitting, Automatic Servicing, Vintage Appraisal).
- Shows live timestamps so your sales team can follow up promptly via phone or WhatsApp.

### 4. Watch Inventory & Photo Uploads
Click **"+ Add Watch"** or switch to the full catalog table:
- **Details**: Model name, manufacturer brand, category (Dress, Chronograph, Diver, Automatic, etc.), and showroom availability.
- **Pricing**: Automatically formats in proper Indian Rupees (`₹ 1,25,000`).
- **High-Resolution Photo Upload**: Click or drag any watch image (PNG, JPG, WEBP). It is uploaded locally to our server, stored safely, and optimized for customer viewing.
- **One-Click Quick Seeder**: Click the seed button if you ever need to load sample benchmark watches (Rolex Daytona, Omega Moonwatch, Cartier Santos, Breitling Navitimer).

### 5. Master Factory Restore
If you ever experiment with colors, typography, or test headlines and want to return everything back to our handcrafted luxury defaults, simply click the **Restore** button (↺) in the top bar. It will safely reset all styling and copy without deleting your uploaded watch catalog.

---

## 💻 Running the Admin Studio Locally

Open your terminal in the `admin` folder:

```powershell
# 1. Install dependencies (first time only)
npm install

# 2. Start the Vite server
npm run dev
```

The studio will be ready at **`http://localhost:3000`** (or through our domain gateway at **`http://admin.ramprasadwatchstore.in/`**).

> **Pro Tip**: Make sure the backend server (`node server.js` in `backend/`) is running so watch uploads and lead submissions save seamlessly to the database.
