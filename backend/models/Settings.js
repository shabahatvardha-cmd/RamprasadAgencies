const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: {
    type: String,
    default: '',
    trim: true,
  },
  celebrity: {
    type: String,
    default: '',
    trim: true,
  },
  tagline: {
    type: String,
    default: '',
    trim: true,
  },
  brand: {
    type: String,
    default: '',
    trim: true,
  },
  image: {
    type: String,
    default: '',
  },
  watchModel: {
    type: String,
    default: '',
    trim: true,
  },
  storeLocation: {
    type: String,
    default: 'Baldev Plaza & JalKal Building, Golghar, Gorakhpur',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const DEFAULT_ADS = [
  {
    title: 'The Carrera Chronograph Heritage',
    celebrity: 'Ryan Gosling • Maison Ambassador',
    tagline: 'Born on the racetrack, perfected in the Swiss valleys. The Carrera Glassbox features the in-house TH20-00 automatic caliber.',
    brand: 'TAG Heuer',
    image: 'https://images.unsplash.com/photo-1630262174975-38bf8d42745f?auto=format&fit=crop&w=1200&q=85',
    watchModel: 'TAG Heuer Carrera Chronograph 39mm',
    storeLocation: 'Baldev Plaza Showroom, Golghar',
    isActive: true,
  },
  {
    title: 'First Watch on the Moon',
    celebrity: 'Daniel Craig • Speedmaster Ambassador',
    tagline: 'Tested in the vacuum of deep space and worn during every lunar landing. Available for in-person fitting and private consultation.',
    brand: 'Omega',
    image: '/images/watches/omega-speedmaster-moonwatch.webp',
    watchModel: 'Omega Speedmaster Professional Moonwatch Co-Axial Master',
    storeLocation: 'Baldev Plaza & JalKal Building, Golghar',
    isActive: true,
  },
  {
    title: 'Japanese Urushi Lacquer & Presage Craft',
    celebrity: 'Takumi Master Horologists • Tokyo Atelier',
    tagline: 'Hand-enameled dials crafted by master artisans with centuries of Japanese metalworking pedigree.',
    brand: 'Seiko',
    image: '/images/watches/seiko-presage-cocktail-time.webp',
    watchModel: 'Seiko Presage Craftsmanship Urushi Automatic',
    storeLocation: 'Shop No. 1, JalKal Building, Golghar',
    isActive: true,
  },
];

const DEFAULT_HERO_SLIDES = [
  {
    badge: 'Trending Drop • 2026 Season',
    headline: 'Timeless Precision & Imported Horology',
    subheadline: 'Gorakhpur’s premier authorized specialists in imported luxury watches. Authentic Swiss precision, Japanese automatic craft, and certified showroom service at Baldev Plaza & JalKal Building, Golghar.',
    ctaPrimary: 'Shop The Drops',
    ctaSecondary: 'Visit Showrooms',
    image: '/images/watches/tissot-prx-powermatic-80.webp',
    tag: 'Seiko • Tissot • Citizen',
  },
  {
    badge: 'Maison Ambassadors Series',
    headline: 'As Seen on Global Icons & Racers',
    subheadline: 'Explore iconic timepieces worn by legends of sport and cinema. Featuring TAG Heuer Carrera Chronographs, Omega Moonwatch, and Rado Captain Cook ceramics.',
    ctaPrimary: 'View Ambassador Series',
    ctaSecondary: 'Inquire on WhatsApp',
    image: 'https://images.unsplash.com/photo-1630262174975-38bf8d42745f?auto=format&fit=crop&w=1200&q=85',
    tag: 'TAG Heuer • Omega • Rado',
  },
  {
    badge: 'Showroom Fitting Experience',
    headline: 'Baldev Plaza & JalKal Building Stores',
    subheadline: 'Step into our dual experience stores in Golghar for private timepiece consultations, certified bracelet sizing, and instant battery replacement.',
    ctaPrimary: 'Locate Showrooms',
    ctaSecondary: 'Book Viewing',
    image: 'https://images.unsplash.com/photo-1783867872755-c998f4ab12a3?auto=format&fit=crop&w=1200&q=85',
    tag: 'Golghar Flagships • Gorakhpur',
  },
];

const DEFAULT_TRUST_BADGES = [
  {
    title: '100% Genuine Imports',
    subtitle: 'Official Stamped International Warranty',
  },
  {
    title: 'Certified Horologists',
    subtitle: 'Free Bracelet Sizing & Ultrasonic Cleaning',
  },
  {
    title: 'Two Golghar Flagships',
    subtitle: 'Baldev Plaza & JalKal Building',
  },
  {
    title: 'Open All 7 Days',
    subtitle: '10:30 AM to 9:00 PM Viewing',
  },
];

const DEFAULT_SHOWROOMS = [
  {
    id: 'store-1',
    name: 'Baldev Plaza Flagship Showroom',
    tagline: 'Swiss Horology & Automatic Heritage',
    address: 'Baldev Plaza, Main Market, Golghar, Gorakhpur, UP - 273001',
    landmark: 'Opposite Town Hall / Heart of Golghar Commercial Hub',
    hours: '10:30 AM – 9:00 PM (Monday to Sunday)',
    phone: '+91 98765 43210',
    image: '/images/showrooms/baldev-plaza.webp',
    specialties: [
      'Official Swiss collections (Tissot, Rado, Victorinox)',
      'Japanese Automatics & Presage timepieces (Seiko, Citizen)',
      'Luxury presentation boxes & collector timepieces',
      'Watch battery, bracelet adjustment & precision servicing',
    ],
    mapQuery: 'Baldev+Plaza+Golghar+Gorakhpur',
  },
  {
    id: 'store-2',
    name: 'JalKal Building Boutique',
    tagline: 'Contemporary & Everyday Luxury Timepieces',
    address: 'Shop No. 1, JalKal Building, Golghar, Gorakhpur, UP - 273001',
    landmark: 'Near JalKal Compound, Main Golghar Market',
    hours: '10:30 AM – 9:00 PM (Monday to Sunday)',
    phone: '+91 98765 43210',
    image: '/images/showrooms/jalkal-building.webp',
    specialties: [
      'Casual Luxury & Chronographs (Fossil, Casio Edifice)',
      'Designer & lifestyle collections (Tommy Hilfiger, Armani)',
      'Genuine leather straps, steel bracelets & horology accessories',
      'Instant watch battery replacement & ultrasonic cleaning',
    ],
    mapQuery: 'JalKal+Building+Golghar+Gorakhpur',
  },
];

const DEFAULT_BRANDS = [
  { name: 'Titan', country: 'India', desc: 'Edge, Octane & Regalia Flagships' },
  { name: 'Titan Raga', country: 'India', desc: 'Jewelry & Floral Designer Horology' },
  { name: 'HMT', country: 'India', desc: 'Kohinoor & Janata Mechanical Heritage' },
  { name: 'Fastrack', country: 'India', desc: 'Youth Sport & Street Chronographs' },
  { name: 'Sonata', country: 'India', desc: 'Everyday Reliable Indian Horology' },
  { name: 'Tissot', country: 'Swiss', desc: 'PRX & Heritage Swiss Precision' },
  { name: 'Omega', country: 'Swiss', desc: 'Moonwatch & Co-Axial Chronometers' },
  { name: 'Seiko', country: 'Japan', desc: 'Automatic & Presage Craft' },
  { name: 'Citizen', country: 'Japan', desc: 'Tsuyosa & Eco-Drive Calibers' },
  { name: 'Breitling', country: 'Swiss', desc: 'Navitimer Aviation Chronographs' },
  { name: 'Fossil', country: 'USA', desc: 'Heritage Automatics & Vintage Styling' },
  { name: 'Rado', country: 'Swiss', desc: 'Master of High-Tech Ceramic' },
];

const DEFAULT_ANNOUNCEMENTS = {
  isActive: true,
  speed: 'normal',
  messages: [
    '⚡ FLASH SALE: Extra 15% Off Curated Swiss & Japanese Big Brand Automatics • Use Code: VINTAGE15',
    'Authorized Specialists for Tissot, Seiko, Rado, Citizen, Fossil & Swiss Calibers in Gorakhpur',
    'Free Insured Express Shipping & Showroom Fitting Across India',
  ],
};

const DEFAULT_FLASH_SALE = {
  isActive: true,
  badgeText: 'FESTIVE HOROLOGY EVENT',
  headline: 'THE BIG BRAND WATCH SALE',
  subheadline: 'Up to 35% Off Curated Swiss & Japanese Mechanical Automatics, Precision Chronographs & Divers',
  couponCode: 'VINTAGE15',
  discountAmount: '15% Extra Off',
  countdownLabel: 'Sale Ends In:',
  endsAt: '2026-11-15T23:59:59.000Z',
  perks: [
    'Official 2-Year International Stamped Warranty',
    'Delivered in Embossed Maison Presentation Box',
    'Free Insured Express Delivery Across India',
  ],
};

const DEFAULT_INQUIRY_FORM_CONFIG = {
  badge: 'Bespoke Concierge',
  title: 'Custom Sourcing & Horology Inquiries',
  subtitle: 'Seeking a specific imported reference number, limited edition release, or looking to schedule an in-store viewing at Baldev Plaza or JalKal Building? Share your details with our horology team.',
  submitButtonText: 'Submit Showroom Consultation Request',
  successMessage: 'Your consultation request has been registered with Ram Prasad Agencies concierge. Our showroom specialist will reach out shortly.',
  fields: [
    {
      id: 'name',
      label: 'Your Full Name',
      type: 'text',
      placeholder: 'e.g. Anand Srivastava',
      required: true,
      enabled: true,
      isSystem: true,
    },
    {
      id: 'phone',
      label: 'Phone / WhatsApp Number',
      type: 'tel',
      placeholder: '+91 98765 43210',
      required: true,
      enabled: true,
      isSystem: true,
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'anand@example.com',
      required: false,
      enabled: true,
      isSystem: true,
    },
    {
      id: 'storeLocation',
      label: 'Preferred Showroom Destination',
      type: 'select',
      options: [
        'Baldev Plaza Flagship Showroom, Golghar',
        'Shop No. 1, JalKal Building, Golghar',
        'Either Showroom (Any Available)',
      ],
      required: true,
      enabled: true,
      isSystem: true,
    },
    {
      id: 'inquiryType',
      label: 'Nature of Consultation',
      type: 'select',
      options: [
        'Buy / Inquire Specific Watch Model',
        'Private In-Store Showroom Fitting (Baldev Plaza / JalKal Building)',
        'Custom Sourcing for Imported Reference (Omega, Tissot, Rado, Seiko)',
        'Watch Bracelet Sizing & Ultrasonic Cleaning',
        'Swiss Movement Servicing & Battery Replacement',
        'Corporate & Luxury Wedding Gifting Inquiry',
        'Vintage Heritage & Collector Appraisal',
        'Strap Replacement & Custom Leather Fitting',
      ],
      required: true,
      enabled: true,
      isSystem: true,
    },
    {
      id: 'budgetRange',
      label: 'Expected Budget Range',
      type: 'select',
      options: [
        'Under ₹15,000 (Casual & Daily Wear)',
        '₹15,000 – ₹35,000 (Automatic & Sport Chronographs)',
        '₹35,000 – ₹75,000 (Entry Swiss & Japanese Presage)',
        '₹75,000 – ₹1,50,000 (Premium Swiss Automatics)',
        'Above ₹1,50,000 (Collector Heritage & Sourced Imports)',
      ],
      required: false,
      enabled: true,
      isSystem: false,
    },
    {
      id: 'preferredVisitDate',
      label: 'Preferred Showroom Visit Date / Timing',
      type: 'text',
      placeholder: 'e.g. Saturday afternoon, or DD/MM/YYYY',
      required: false,
      enabled: true,
      isSystem: false,
    },
    {
      id: 'message',
      label: 'Watch Model / Specific Requests',
      type: 'textarea',
      placeholder: 'Mention reference number, watch brand, preferred dial color, or appointment time...',
      required: false,
      enabled: true,
      isSystem: true,
    },
  ],
};

const DEFAULT_SETTINGS = {
  theme: 'obsidian-gold',
  heroTitle: 'Timeless Precision & Imported Horology',
  heroSubtitle: 'Gorakhpur’s premier destination for genuine imported timepieces. Experience authentic Swiss craft, Japanese automatic mastery, and bespoke showroom service at Baldev Plaza & JalKal Building, Golghar.',
  announcementText: 'Complimentary watch inspection & battery health checks available this week at both Golghar showrooms.',
  announcementHours: '10:30 AM – 9:00 PM (All 7 Days)',
  contactPhone: '+91 98765 43210',
  heroSlides: DEFAULT_HERO_SLIDES,
  trustBadges: DEFAULT_TRUST_BADGES,
  showrooms: DEFAULT_SHOWROOMS,
  aboutText: 'Gorakhpur’s trusted destination for genuine imported luxury watches, automatic chronographs, and precision battery servicing for over three decades.',
  certificateImage: '/images/about/heritage-certificate.webp',
  footerCopyright: 'Ram Prasad Agencies. Baldev Plaza & JalKal Building, Golghar, Gorakhpur. All rights reserved.',
  footerVipBadge: 'Vintage Collectors Circle',
  footerVipTitle: 'Receive 10% Off Your First Automatic Timepiece',
  footerVipSubtitle: 'Preview limited-edition capsule drops and private showroom fittings in Gorakhpur.',
  inquiryTitle: 'Custom Sourcing & Horology Inquiries',
  inquirySubtitle: 'Seeking a specific imported reference number, limited edition release, or looking to schedule an in-store viewing at Baldev Plaza or JalKal Building? Share your details with our horology team.',
  logo: '/logo.png',
  ads: DEFAULT_ADS,
  brands: DEFAULT_BRANDS,
  announcements: DEFAULT_ANNOUNCEMENTS,
  flashSale: DEFAULT_FLASH_SALE,
  inquiryFormConfig: DEFAULT_INQUIRY_FORM_CONFIG,
};

const settingsSchema = new mongoose.Schema(
  {
    theme: {
      type: String,
      default: DEFAULT_SETTINGS.theme,
      trim: true,
    },
    logo: {
      type: String,
      default: '/logo.png',
      trim: true,
    },
    brands: {
      type: Array,
      default: DEFAULT_BRANDS,
    },
    announcements: {
      type: Object,
      default: DEFAULT_ANNOUNCEMENTS,
    },
    flashSale: {
      type: Object,
      default: DEFAULT_FLASH_SALE,
    },
    inquiryFormConfig: {
      type: Object,
      default: DEFAULT_INQUIRY_FORM_CONFIG,
    },
    heroTitle: {
      type: String,
      default: DEFAULT_SETTINGS.heroTitle,
      trim: true,
    },
    heroSubtitle: {
      type: String,
      default: DEFAULT_SETTINGS.heroSubtitle,
      trim: true,
    },
    announcementText: {
      type: String,
      default: DEFAULT_SETTINGS.announcementText,
      trim: true,
    },
    announcementHours: {
      type: String,
      default: DEFAULT_SETTINGS.announcementHours,
      trim: true,
    },
    contactPhone: {
      type: String,
      default: DEFAULT_SETTINGS.contactPhone,
      trim: true,
    },
    heroSlides: {
      type: Array,
      default: DEFAULT_HERO_SLIDES,
    },
    trustBadges: {
      type: Array,
      default: DEFAULT_TRUST_BADGES,
    },
    showrooms: {
      type: Array,
      default: DEFAULT_SHOWROOMS,
    },
    aboutText: {
      type: String,
      default: DEFAULT_SETTINGS.aboutText,
      trim: true,
    },
    certificateImage: {
      type: String,
      default: DEFAULT_SETTINGS.certificateImage,
      trim: true,
    },
    footerCopyright: {
      type: String,
      default: DEFAULT_SETTINGS.footerCopyright,
      trim: true,
    },
    footerVipBadge: {
      type: String,
      default: DEFAULT_SETTINGS.footerVipBadge,
      trim: true,
    },
    footerVipTitle: {
      type: String,
      default: DEFAULT_SETTINGS.footerVipTitle,
      trim: true,
    },
    footerVipSubtitle: {
      type: String,
      default: DEFAULT_SETTINGS.footerVipSubtitle,
      trim: true,
    },
    inquiryTitle: {
      type: String,
      default: DEFAULT_SETTINGS.inquiryTitle,
      trim: true,
    },
    inquirySubtitle: {
      type: String,
      default: DEFAULT_SETTINGS.inquirySubtitle,
      trim: true,
    },
    ads: {
      type: [adSchema],
      default: DEFAULT_ADS,
    },
  },
  {
    timestamps: true,
    strict: false, // Allows flexible updates for any new site customizer section
  }
);

// Helper static method to get single settings doc or initialize default
settingsSchema.statics.getSingleton = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create(DEFAULT_SETTINGS);
  } else {
    // Backfill defaults if missing
    let modified = false;
    if (!settings.ads || settings.ads.length === 0) {
      settings.ads = DEFAULT_ADS;
      modified = true;
    }
    if (!settings.heroSlides || settings.heroSlides.length === 0) {
      settings.heroSlides = DEFAULT_HERO_SLIDES;
      modified = true;
    }
    if (!settings.trustBadges || settings.trustBadges.length === 0) {
      settings.trustBadges = DEFAULT_TRUST_BADGES;
      modified = true;
    }
    if (!settings.showrooms || settings.showrooms.length === 0) {
      settings.showrooms = DEFAULT_SHOWROOMS;
      modified = true;
    }
    if (!settings.announcementHours) {
      settings.announcementHours = DEFAULT_SETTINGS.announcementHours;
      modified = true;
    }
    if (!settings.brands || settings.brands.length === 0) {
      settings.brands = DEFAULT_BRANDS;
      modified = true;
    }
    if (!settings.announcements || !settings.announcements.messages) {
      settings.announcements = DEFAULT_ANNOUNCEMENTS;
      modified = true;
    }
    if (!settings.logo || settings.logo === '/logo.png' || settings.logo === '/logo.jpg') {
      settings.logo = '/logo.webp';
      modified = true;
    }
    if (!settings.flashSale || typeof settings.flashSale.isActive === 'undefined') {
      settings.flashSale = DEFAULT_FLASH_SALE;
      modified = true;
    }
    if (!settings.footerVipBadge) {
      settings.footerVipBadge = DEFAULT_SETTINGS.footerVipBadge;
      modified = true;
    }
    if (!settings.footerVipTitle) {
      settings.footerVipTitle = DEFAULT_SETTINGS.footerVipTitle;
      modified = true;
    }
    if (!settings.footerVipSubtitle) {
      settings.footerVipSubtitle = DEFAULT_SETTINGS.footerVipSubtitle;
      modified = true;
    }
    if (!settings.inquiryFormConfig || !settings.inquiryFormConfig.fields || settings.inquiryFormConfig.fields.length === 0) {
      settings.inquiryFormConfig = DEFAULT_INQUIRY_FORM_CONFIG;
      modified = true;
    }
    if (modified) {
      await settings.save();
    }
  }
  return settings;
};

// Reset settings to factory defaults
settingsSchema.statics.resetDefaults = async function () {
  await this.deleteMany({});
  const fresh = await this.create(DEFAULT_SETTINGS);
  return fresh;
};

module.exports = mongoose.model('Settings', settingsSchema);
