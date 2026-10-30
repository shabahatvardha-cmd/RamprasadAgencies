const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const DATA_DIR = path.join(__dirname, 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const WATCHES_FILE = path.join(DATA_DIR, 'watches.json');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function isMongoConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

// -----------------------------------------------------------------------------
// 1. Initial Dataset Setup
// -----------------------------------------------------------------------------
function loadInitialWatches() {
  try {
    const fallbackPath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'fallbackWatches.js');
    if (fs.existsSync(fallbackPath)) {
      const code = fs.readFileSync(fallbackPath, 'utf8')
        .replace('export const fallbackWatches =', 'exports.fallbackWatches =')
        .replace('export const FALLBACK_WATCHES =', 'exports.FALLBACK_WATCHES =')
        .replace('export default fallbackWatches;', '')
        .replace(/export const \w+ =/g, 'exports.dummy =');

      const mod = { exports: {} };
      const fn = new Function('exports', 'module', code);
      fn(mod.exports, mod);
      const list = mod.exports.FALLBACK_WATCHES || mod.exports.fallbackWatches;
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
    }
  } catch (err) {
    console.warn('Could not read fallbackWatches.js for initial seed:', err.message);
  }
  return [];
}

function loadInitialSettings() {
  const defaultStoreData = {
    version: '6.1.0',
    brandName: 'RAM PRASAD AGENCIES',
    tagline: 'WATCHSTORE.IN',
    logo: '/logo.webp',
    contactPhone: '+91 98765 43210',
    inquiryTitle: 'Bespoke Sourcing & Private Showroom Consultation',
    footerCopyright: 'Ram Prasad Agencies. Baldev Plaza & JalKal Building, Golghar, Gorakhpur. Authorized Watch Specialists. All rights reserved.',
    footerVipBadge: 'Vintage Collectors Circle',
    footerVipTitle: 'Receive 10% Off Your First Automatic Timepiece',
    footerVipSubtitle: 'Preview limited-edition capsule drops and private showroom fittings in Gorakhpur.',
    certificateImage: '/images/about/heritage-certificate.webp',
    aboutText: 'Gorakhpur’s trusted destination for genuine imported luxury watches, automatic chronographs, and precision battery servicing for over three decades.',
    showrooms: [
      {
        id: 'store-1',
        name: 'Baldev Plaza Flagship Showroom',
        tagline: 'Swiss Horology & Automatic Heritage',
        address: 'Baldev Plaza, Main Market, Golghar, Gorakhpur - 273001',
        landmark: 'Opposite Town Hall / Commercial Center',
        hours: '10:30 AM – 9:00 PM (All 7 Days)',
        image: '/images/showrooms/baldev-plaza.webp',
        mapQuery: 'Baldev+Plaza+Golghar+Gorakhpur',
        phone: '+91 98765 43210',
        specialties: [
          'Official Swiss Collections (Tissot, Rado, Longines, Victorinox)',
          'Indian Heritage Horology (Titan Edge, Titan Mechanicals, HMT Kohinoor & Janata)',
          'Collector Import Consultations (Omega, TAG Heuer, Rado)',
          'Japanese Automatics & Presage timepieces (Seiko, Citizen)',
          'Certified watch battery, pressure testing & ultrasonic cleaning',
        ],
      },
      {
        id: 'store-2',
        name: 'JalKal Building Boutique',
        tagline: 'Contemporary & Everyday Luxury Timepieces',
        address: 'Shop No. 1, JalKal Building, Golghar, Gorakhpur - 273001',
        landmark: 'Near JalKal Compound, Main Golghar Market',
        hours: '10:30 AM – 9:00 PM (All 7 Days)',
        image: '/images/showrooms/jalkal-building.webp',
        mapQuery: 'JalKal+Building+Golghar+Gorakhpur',
        phone: '+91 98765 43210',
        specialties: [
          'Indian Youth & Daily Wear (Titan Octane, Fastrack Chronos, Sonata Poze)',
          'Casual Luxury & Chronographs (Fossil, Casio Edifice, G-Shock)',
          'Designer horology collections (Emporio Armani, Tommy Hilfiger)',
          'Genuine leather straps, steel bracelets & horology accessories',
          'Instant watch bracelet sizing & movement health diagnostics',
        ],
      },
    ],
    announcements: {
      isActive: true,
      speed: 'normal',
      messages: [
        '🇮🇳 INDIAN WATCH HERITAGE: Complete Collections for Titan, Titan Raga, HMT, Fastrack & Sonata Available at Golghar',
        '⚡ FLASH SALE: Extra 15% Off Swiss, Japanese & Indian Mechanicals • Use Code: VINTAGE15',
        'Authorized Luxury Specialist for Tissot, Seiko, Titan, HMT, Citizen, Fossil & Swiss Calibers',
        'Direct Imports for Omega, Tissot & TAG Heuer with Stamped International Warranty',
        'Complimentary Watch Bracelet Sizing & Battery Health Check at Golghar Showrooms',
        'Free Insured Express Shipping on All Luxury Orders Across India',
      ],
    },
    flashSale: {
      isActive: true,
      badgeText: 'FESTIVE HOROLOGY EVENT',
      headline: 'THE BIG BRAND WATCH SALE',
      subheadline: 'Up to 35% Off Curated Mechanical Automatics, Precision Chronographs & Swiss Divers',
      couponCode: 'VINTAGE15',
      discountAmount: '15% Extra Off',
      countdownLabel: 'Sale Ends In:',
      endsAt: '2026-10-31T23:59:59',
      perks: [
        'Official 2-Year International Stamped Warranty',
        'Delivered in Embossed Maison Presentation Box',
        'Free Insured Express Delivery Across India',
      ],
    },
    hero: {
      activeSlide: 0,
      slides: [
        {
          id: 'hero-1',
          badge: 'SWISS PRECISION',
          headline: 'Tissot PRX & Swiss Automatics',
          subheadline: 'Gorakhpur’s premier authorized showroom for Swiss Powermatic 80 movements and retro-futuristic integrated bracelets.',
          ctaPrimary: 'Shop PRX',
          ctaSecondary: 'Baldev Plaza Showroom',
          image: '/images/watches/tissot/01.webp',
          tag: 'Tissot • PRX • Powermatic 80',
        },
        {
          id: 'hero-2',
          badge: 'JAPANESE PRECISION',
          headline: 'Citizen Tsuyosa & Eco-Drive Calibers',
          subheadline: 'Sunburst dials, cyclops date, and light-powered timekeeping requiring zero battery changes.',
          ctaPrimary: 'Explore Tsuyosa',
          ctaSecondary: 'Visit Showrooms',
          image: '/images/watches/citizen/01.webp',
          tag: 'Citizen • Tsuyosa • Eco-Drive',
        },
        {
          id: 'hero-3',
          badge: 'INDIAN MECHANICAL HERITAGE',
          headline: 'Titan Edge & HMT Mechanical Icons',
          subheadline: 'Devnagari dials, 17-jewel hand-wound calibers, and the world’s slimmest ceramic wristwatches.',
          ctaPrimary: 'Discover Indian Icons',
          ctaSecondary: 'Inquire on WhatsApp',
          image: '/images/watches/titan/01.webp',
          tag: 'Titan • HMT • Kohinoor',
        },
      ],
    },
  };

  return {
    theme: 'obsidian-gold',
    logo: '/logo.webp',
    contactPhone: '+91 98765 43210',
    aboutText: defaultStoreData.aboutText,
    certificateImage: defaultStoreData.certificateImage,
    footerCopyright: defaultStoreData.footerCopyright,
    footerVipBadge: defaultStoreData.footerVipBadge,
    footerVipTitle: defaultStoreData.footerVipTitle,
    footerVipSubtitle: defaultStoreData.footerVipSubtitle,
    inquiryTitle: defaultStoreData.inquiryTitle,
    showrooms: defaultStoreData.showrooms,
    announcements: defaultStoreData.announcements,
    flashSale: defaultStoreData.flashSale,
    heroSlides: defaultStoreData.hero.slides,
    vintageStoreData: defaultStoreData,
  };
}

// Ensure seed files exist
if (!fs.existsSync(SETTINGS_FILE)) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(loadInitialSettings(), null, 2), 'utf8');
}
if (!fs.existsSync(WATCHES_FILE)) {
  fs.writeFileSync(WATCHES_FILE, JSON.stringify(loadInitialWatches(), null, 2), 'utf8');
}
if (!fs.existsSync(LEADS_FILE)) {
  fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), 'utf8');
}

// -----------------------------------------------------------------------------
// 2. Settings Storage Operations
// -----------------------------------------------------------------------------
function readSettingsFile() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading settings.json:', err.message);
  }
  return loadInitialSettings();
}

function writeSettingsFile(data) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing settings.json:', err.message);
  }
}

function getSettings() {
  return readSettingsFile();
}

function updateSettings(updateFields) {
  const current = readSettingsFile();
  const updated = {
    ...current,
    ...updateFields,
    updatedAt: new Date().toISOString(),
  };

  // If updateFields has vintageStoreData, ensure it merges properly
  if (updateFields.vintageStoreData) {
    updated.vintageStoreData = {
      ...(current.vintageStoreData || {}),
      ...updateFields.vintageStoreData,
    };
  }

  writeSettingsFile(updated);
  return updated;
}

function resetSettings() {
  const fresh = loadInitialSettings();
  writeSettingsFile(fresh);
  return fresh;
}

// -----------------------------------------------------------------------------
// 3. Watches Storage Operations
// -----------------------------------------------------------------------------
function readWatchesFile() {
  try {
    if (fs.existsSync(WATCHES_FILE)) {
      const raw = fs.readFileSync(WATCHES_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading watches.json:', err.message);
  }
  return [];
}

function writeWatchesFile(data) {
  try {
    fs.writeFileSync(WATCHES_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing watches.json:', err.message);
  }
}

function getWatches(query = {}) {
  let list = readWatchesFile();
  const { category, brand, inStock, search, sort } = query;

  if (category && category !== 'ALL') {
    const c = category.toLowerCase();
    list = list.filter((w) => (w.category || '').toLowerCase() === c);
  }

  if (brand && brand !== 'ALL') {
    const b = brand.toLowerCase();
    list = list.filter((w) => {
      const wb = (w.brand || '').toLowerCase();
      return wb === b || wb.replace(/\s+/g, '-') === b;
    });
  }

  if (typeof inStock !== 'undefined' && inStock !== 'ALL') {
    const isInStock = inStock === 'true' || inStock === true;
    list = list.filter((w) => (w.inStock !== false) === isInStock);
  }

  if (search && search.trim()) {
    const tokens = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
    list = list.filter((w) => {
      const haystack = `${w.name || ''} ${w.brand || ''} ${w.category || ''} ${w.description || ''}`.toLowerCase();
      return tokens.every((t) => haystack.includes(t));
    });
  }

  if (sort === 'price_asc' || sort === 'price-asc') {
    list.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sort === 'price_desc' || sort === 'price-desc') {
    list.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sort === 'name_asc' || sort === 'name') {
    list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }

  return list;
}

function getWatchById(id) {
  const list = readWatchesFile();
  return list.find((w) => w._id === id || w.id === id);
}

function createWatch(watchData) {
  const list = readWatchesFile();
  const newId = watchData.id || watchData._id || `watch-${Date.now()}`;
  const newWatch = {
    ...watchData,
    id: newId,
    _id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  list.unshift(newWatch);
  writeWatchesFile(list);
  return newWatch;
}

function updateWatch(id, updateData) {
  const list = readWatchesFile();
  const index = list.findIndex((w) => w._id === id || w.id === id);
  if (index === -1) {
    return null;
  }
  const updated = {
    ...list[index],
    ...updateData,
    _id: id,
    id: id,
    updatedAt: new Date().toISOString(),
  };
  list[index] = updated;
  writeWatchesFile(list);
  return updated;
}

function deleteWatch(id) {
  const list = readWatchesFile();
  const filtered = list.filter((w) => w._id !== id && w.id !== id);
  const deleted = filtered.length < list.length;
  if (deleted) {
    writeWatchesFile(filtered);
  }
  return deleted;
}

// -----------------------------------------------------------------------------
// 4. Leads Storage Operations
// -----------------------------------------------------------------------------
function readLeadsFile() {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const raw = fs.readFileSync(LEADS_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading leads.json:', err.message);
  }
  return [];
}

function writeLeadsFile(data) {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing leads.json:', err.message);
  }
}

function getLeads(query = {}) {
  let list = readLeadsFile();
  const { status, search, storeLocation } = query;

  if (status && status !== 'ALL') {
    list = list.filter((l) => (l.status || 'New') === status);
  }

  if (storeLocation && storeLocation !== 'ALL') {
    const sl = storeLocation.toLowerCase();
    list = list.filter((l) => (l.storeLocation || '').toLowerCase().includes(sl));
  }

  if (search && search.trim()) {
    const s = search.toLowerCase().trim();
    list = list.filter((l) => {
      const combined = `${l.name || ''} ${l.phone || ''} ${l.email || ''} ${l.watchName || ''} ${l.message || ''}`.toLowerCase();
      return combined.includes(s);
    });
  }

  list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  return list;
}

function getLeadStats() {
  const list = readLeadsFile();
  const total = list.length;
  const newLeads = list.filter((l) => (l.status || 'New') === 'New').length;
  const contacted = list.filter((l) => l.status === 'Contacted').length;
  const scheduled = list.filter((l) => l.status === 'Showroom Visit Scheduled').length;
  const closedWon = list.filter((l) => l.status === 'Purchased / Closed').length;
  const closedLost = list.filter((l) => l.status === 'Archived / Inactive').length;
  return { total, newLeads, contacted, scheduled, closedWon, closedLost };
}

function createLead(leadData) {
  const list = readLeadsFile();
  const newLead = {
    ...leadData,
    _id: leadData._id || `lead-${Date.now()}`,
    status: leadData.status || 'New',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  list.unshift(newLead);
  writeLeadsFile(list);
  return newLead;
}

function updateLead(id, updateData) {
  const list = readLeadsFile();
  const index = list.findIndex((l) => l._id === id);
  if (index === -1) return null;
  list[index] = {
    ...list[index],
    ...updateData,
    updatedAt: new Date().toISOString(),
  };
  writeLeadsFile(list);
  return list[index];
}

function deleteLead(id) {
  const list = readLeadsFile();
  const filtered = list.filter((l) => l._id !== id);
  const deleted = filtered.length < list.length;
  if (deleted) writeLeadsFile(filtered);
  return deleted;
}

module.exports = {
  isMongoConnected,
  getSettings,
  updateSettings,
  resetSettings,
  getWatches,
  getWatchById,
  createWatch,
  updateWatch,
  deleteWatch,
  getLeads,
  getLeadStats,
  createLead,
  updateLead,
  deleteLead,
};

