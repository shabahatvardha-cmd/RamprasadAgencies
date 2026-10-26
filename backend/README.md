# Ram Prasad Agencies — Backend & Media Engine

Welcome to the backend engine for **Ram Prasad Agencies (TheWatchStore.in)**. This is a clean, lightweight Node.js & Express server paired with MongoDB that takes care of storing our watch catalog, handling high-resolution watch photography uploads, persisting live storefront text settings, and collecting customer consultation leads.

---

## 🛠️ How It Works

1. **Watch Catalog & Inventory**:
   - Stores all timepieces in MongoDB via Mongoose schemas.
   - Saves watch names, brands (Rolex, Omega, Tissot, Seiko, etc.), categories (Chronograph, Dress, Diver, Automatic), descriptions, showroom locations, and prices in Indian Rupees.
   - When a watch is deleted from the Admin Studio, its local image file is automatically cleaned up from disk to keep storage neat.

2. **Local Media & Photo Uploads (Multer)**:
   - When you upload a watch photo in the Admin Studio, it is sent to `/api/upload`.
   - The server validates file types (JPG, PNG, WEBP), creates a unique timestamped filename, and saves it in the `uploads/` directory.
   - Uploaded photos are served directly at `/uploads/:filename` so both the storefront and admin can display them instantly.

3. **Store Settings & Live Customizations**:
   - Uses a singleton pattern in MongoDB to store the active theme, announcement ticker text, hero headlines, and customer service phone number.
   - When our team changes anything in the Admin Studio, it is saved here and immediately updates the live customer storefront.

4. **Customer Consultation Leads**:
   - Stores incoming VIP consultation submissions (Customer Name, 10-digit mobile number with country code, consultation type, and message) so our store team can follow up directly.

---

## 📁 Folder Layout

```text
backend/
├── models/
│   ├── Watch.js             # Watch schema (name, brand, price, showroom, image)
│   ├── Settings.js          # Live store settings & announcement copy
│   └── Lead.js              # Customer consultation inquiries
├── routes/
│   ├── uploadRoutes.js      # Photo upload handler with Multer
│   ├── watchRoutes.js       # Watch catalog CRUD endpoints
│   ├── settingsRoutes.js    # Storefront customization endpoints
│   └── leadRoutes.js        # Lead capture & inbox retrieval
├── uploads/                 # Local directory for watch photography
├── .env.example             # Template for your local environment variables
├── .env                     # Local configuration (port, database URI)
├── package.json             # Dependencies
└── server.js                # Express app entrypoint & MongoDB connection
```

---

## 🚀 Running the Backend

### 1. Configuration (`.env`)
Create a `.env` file in the `backend` folder (or copy from `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ram_prasad_agencies
CLIENT_URL=http://localhost:3000
```

### 2. Start the Server
In your terminal, navigate to the `backend` folder:

```powershell
# Install dependencies (first time only)
npm install

# Start the server with automatic restart on file edits
npm run dev
```

You'll see:
```text
✓ Connected to MongoDB (ram_prasad_agencies)
✓ Ram Prasad Agencies API Server running on port 5000
✓ Media storage ready at http://localhost:5000/uploads
```

---

## 🔌 Core Endpoints in Plain English

- **`POST /api/upload`**: Uploads a watch photo. Returns the URL of the saved image.
- **`GET /api/watches`**: Retrieves the active watch catalog (supports filtering by brand, category, and price).
- **`POST /api/watches`**: Saves a new luxury timepiece to the catalog.
- **`DELETE /api/watches/:id`**: Removes a timepiece and deletes its image from local storage.
- **`GET /api/settings`**: Gets the current storefront text, announcements, and active theme.
- **`PUT /api/settings`**: Updates storefront copy in real time from the Admin Studio.
- **`POST /api/leads`**: Records a new customer consultation inquiry.
- **`GET /api/leads`**: Retrieves all customer inquiries for the Admin Leads inbox.

---

## 💡 Practical Maintenance Tips

- **Backing up Watch Photos**: All uploaded watch photos live inside `backend/uploads/`. If you are moving to a new computer or backing up the store, simply copy this folder.
- **Database Backups**: If using local MongoDB, you can use standard `mongodump --db ram_prasad_agencies` to take a snapshot of your watches and leads anytime.
