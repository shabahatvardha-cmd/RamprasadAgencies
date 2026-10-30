# Ram Prasad Agencies — TheWatchStore.in
### *Luxury Timepieces & Haute Horlogerie • Golghar, Gorakhpur*

Welcome to the digital home of **Ram Prasad Agencies**. For decades, our flagships at Baldev Plaza and JalKal Building in Golghar have welcomed timepiece enthusiasts, collectors, and families across Eastern UP looking for authentic luxury watches. 

This repository contains our entire online presence: a sleek, modern customer storefront designed for discovery and seamless WhatsApp concierge inquiries, paired with a live visual admin studio that lets our team update showcases, prices, and showroom announcements in real time without touching code.

---

## 🌟 At a Glance

The project is split into four friendly, cohesive pieces:

| Component | What It Does | Default URL | Custom Domain URL |
| :--- | :--- | :--- | :--- |
| **Customer Storefront** (`frontend/`) | High-end public showroom, brand catalogs, showroom locator, and direct WhatsApp consultations. | `http://localhost:5173` | `http://ramprasadwatchstore.in/#showrooms` |
| **Admin Studio** (`admin/`) | Dedicated visual control room. Live on-page editing, customer leads inbox, and watch catalog manager. | `http://localhost:3000` | `http://admin.ramprasadwatchstore.in/` |
| **Backend & Storage** (`backend/`) | Node/Express API with MongoDB and local media storage for watch photography. | `http://localhost:5000` | Internal API |
| **Domain Gateway** (`gateway.js`) | Lightweight reverse proxy on Port 80 routing custom domain names cleanly without port numbers. | Port 80 | Connects both domains seamlessly |

---

## 🔐 Environment & Credentials Configuration

All secret keys, admin credentials, database connections, and service ports are managed centrally via `.env` files:
- **Master Root Config**: [`.env`](file:///c:/Users/shabs/OneDrive/Desktop/Ram%20Prasad/.env) (and safe template [`.env.example`](file:///c:/Users/shabs/OneDrive/Desktop/Ram%20Prasad/.env.example))
- **Admin Studio Config**: [`admin/.env`](file:///c:/Users/shabs/OneDrive/Desktop/Ram%20Prasad/admin/.env) (and [`admin/.env.example`](file:///c:/Users/shabs/OneDrive/Desktop/Ram%20Prasad/admin/.env.example))
- **Customer Storefront Config**: [`frontend/.env`](file:///c:/Users/shabs/OneDrive/Desktop/Ram%20Prasad/frontend/.env) (and [`frontend/.env.example`](file:///c:/Users/shabs/OneDrive/Desktop/Ram%20Prasad/frontend/.env.example))
- **Backend API Config**: [`backend/.env`](file:///c:/Users/shabs/OneDrive/Desktop/Ram%20Prasad/backend/.env) (and [`backend/.env.example`](file:///c:/Users/shabs/OneDrive/Desktop/Ram%20Prasad/backend/.env.example))

> **Security Guarantee**: All `.env` files are strictly registered in our [`.gitignore`](file:///c:/Users/shabs/OneDrive/Desktop/Ram%20Prasad/.gitignore) to guarantee that passwords, API keys, and sensitive tokens are never committed or leaked to version control.

---

## 🚀 Running Everything on Your Computer

Everything is already set up and configured. If you ever need to start the project from scratch, here is how you do it:

### Step 1: Start the Backend (API & Database)
Open a terminal in the `backend` folder and run:
```bash
cd backend
npm install       # only needed the first time
npm run dev       # starts server on port 5000 with auto-reload
```
*Note: Make sure your local MongoDB service is running, or point `MONGO_URI` in `backend/.env` to your database.*

### Step 2: Start the Customer Storefront
Open a second terminal in the `frontend` folder:
```bash
cd frontend
npm install       # only needed the first time
npm run dev       # launches storefront on port 5173
```

### Step 3: Start the Admin Studio
Open a third terminal in the `admin` folder:
```bash
cd admin
npm install       # only needed the first time
npm run dev       # launches admin studio on port 3000
```

### Step 4 (Optional): Start the Domain Gateway
If you want clean URLs like `http://ramprasadwatchstore.in` without typing port numbers:
```bash
node gateway.js
```

---

## 🌐 Custom Domains (`ramprasadwatchstore.in`)

Instead of messy `localhost` addresses, you can browse and manage the site using natural store domains:

- **Customer Storefront**: `http://ramprasadwatchstore.in/#showrooms`
- **Admin Control Studio**: `http://admin.ramprasadwatchstore.in/`

### 1-Click Setup on Windows
Because `.in` is a custom domain, Windows just needs one quick approval to resolve it on your computer:
1. Double-click the file named **`ENABLE-RAMPRASAD-URL.bat`** right on your Desktop (or run `setup-custom-domain.bat` from this folder).
2. Click **Yes** when Windows asks for permission.
3. Open `http://ramprasadwatchstore.in/#showrooms` in your browser!

> **Instant Zero-Setup Alternative**: You can also use `http://ramprasadwatchstore.lvh.me/#showrooms` and `http://admin.ramprasadwatchstore.lvh.me/` right now in any browser without touching any files.

---

## 🛠️ Everyday Workflows for Store Staff

### 1. Logging Into the Admin Studio
- Visit `http://admin.ramprasadwatchstore.in/` (or `http://localhost:3000`).
- Sign in with username: `admin` and password: `admin123` (or click **"1-Click Quick Demo Access"**).
- For security, customer storefront visitors will never see any admin buttons or edit controls.

### 2. Adding a New Watch to the Showcase
- In the Admin Studio, click **"+ Add Watch"** in the top bar or go to the **Watches** tab.
- Enter the model name, brand (Titan, Omega, Tissot, Seiko, Casio, etc.), price in ₹ INR, and showroom availability.
- Upload a clear photo of the watch. It is automatically stored locally and resized for the showcase.
- Click **Save Watch**. It immediately shows up in the customer catalog!

### 3. Editing Text & Showroom Announcements
- Switch to **"Edit Mode"** in the top bar.
- Click any section (Hero headline, announcement ribbon, phone number, consultation options).
- Update the wording and hit **Save Changes**. The customer website updates instantly.

### 4. Handling Inquiries from Customers
- When a customer fills out the consultation form, their request is saved in the **Customer Leads** inbox in the Admin bar.
- If the customer clicks the WhatsApp button on any watch card, a pre-filled WhatsApp message opens with the exact watch model, reference number, and price ready to send to our store's phone number (`+91 98765 43210`).

---

## 🏛️ Showroom Locations

- **Flagship 1 (Horology & Automatics)**: Baldev Plaza, Golghar, Gorakhpur.
- **Flagship 2 (Chronographs & Service Center)**: Shop No. 1, JalKal Building, Golghar, Gorakhpur.
- **Hours**: Monday to Sunday, 10:30 AM – 9:00 PM.

---

## 🤝 Need Help or Customizations?

If you ever need to adjust colors, add new consultation fields, or update store phone numbers, simply use the Live Visual Editor inside the Admin Studio. Everything is designed to be easily managed by anyone on the store team.




<"Next brand is [Brand Name]" (along with the image/table for that brand)

I will immediately:

Remember all 12 completed brands (Titan, Titan Raga, Omega, Rado, HMT, Tissot, Seiko, Breitling, Fossil, Fastrack, Sonata, Citizen).
Maintain the strict 20-watches-per-brand rule (zero leaks).
Keep all prices hidden (price: null).
Set up the images as 01.webp through 20.webp.
Verify everything across both frontend and admin!>