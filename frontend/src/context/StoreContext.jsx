import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { fetchSettings, updateSettings, fetchWatches } from '../utils/api';

const LOCAL_STORAGE_KEY = 'fossil_storefront_state_v2';
const BROADCAST_CHANNEL_NAME = 'fossil_store_realtime_sync';

// ============================================================================
// CURATED VINTAGE-INSPIRED DEFAULT DATASET (Fossil Luxury Lifestyle Aesthetic)
// ============================================================================
export const DEFAULT_VINTAGE_STORE_DATA = {
  version: '2.6.0',
  brandName: 'RAM PRASAD AGENCIES',
  tagline: 'ramprasadWatchstore.in • Golghar',
  logo: '/logo.png',
  contactPhone: '+91 98765 43210',
  inquiryTitle: 'Bespoke Sourcing & Private Showroom Consultation',
  footerCopyright: 'Ram Prasad Agencies. Baldev Plaza & JalKal Building, Golghar, Gorakhpur. Authorized Watch Specialists. All rights reserved.',
  footerVipBadge: 'Vintage Collectors Circle',
  footerVipTitle: 'Receive 10% Off Your First Automatic Timepiece',
  footerVipSubtitle: 'Preview limited-edition capsule drops and private showroom fittings in Gorakhpur.',

  showrooms: [
    {
      id: 'store-1',
      name: 'Baldev Plaza Flagship Showroom',
      tagline: 'Swiss Horology & Automatic Heritage',
      address: 'Baldev Plaza, Main Market, Golghar, Gorakhpur - 273001',
      landmark: 'Opposite Town Hall / Commercial Center',
      hours: '10:30 AM – 9:00 PM (All 7 Days)',
      image: 'https://images.unsplash.com/photo-1783867872755-c998f4ab12a3?auto=format&fit=crop&w=1200&q=85',
      mapQuery: 'Baldev+Plaza+Golghar+Gorakhpur',
      phone: '+91 98765 43210',
      specialties: [
        'Official Swiss Collections (Tissot, Rado, Longines, Victorinox)',
        'Indian Heritage Horology (Titan Edge, Titan Mechanicals, HMT Kohinoor & Janata)',
        'Collector Import Consultations (Rolex, Omega, TAG Heuer)',
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
      image: 'https://images.unsplash.com/photo-1635462684825-3621c1df5403?auto=format&fit=crop&w=1200&q=85',
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

  // 1. TOP ANNOUNCEMENT TICKER & MARQUEE
  announcements: {
    isActive: true,
    speed: 'normal',
    messages: [
      '🇮🇳 INDIAN WATCH HERITAGE: Complete Collections for Titan, HMT, Fastrack & Sonata Available at Golghar',
      '⚡ FLASH SALE: Extra 15% Off Swiss, Japanese & Indian Mechanicals • Use Code: VINTAGE15',
      'Authorized Luxury Specialist for Tissot, Seiko, Titan, HMT, Citizen, Fossil & Swiss Calibers',
      'Direct Imports for Rolex, Omega & TAG Heuer with Stamped International Warranty',
      'Complimentary Watch Bracelet Sizing & Battery Health Check at Golghar Showrooms',
      'Free Insured Express Shipping on All Luxury Orders Across India',
    ],
  },

  // 2. FLASH SALE PROMOTION BANNER & COUNTDOWN
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

  // 3. HERO SECTION WATCH ADVERTISEMENT SHOWCASE
  hero: {
    activeSlide: 0,
    slides: [
      {
        id: 'hero-1',
        badge: 'SWISS PRECISION • EST. 1853',
        headline: 'Tissot PRX Powermatic 80 & Swiss Automatics',
        subheadline: 'Iconic 1970s integrated bracelet geometry powered by an 80-hour Nivachron anti-magnetic balance spring. Experience authentic Swiss horology at Ram Prasad Agencies.',
        ctaPrimary: 'Explore Tissot PRX',
        ctaPrimaryLink: '#new-arrivals',
        ctaSecondary: 'View Showrooms',
        ctaSecondaryLink: '#showrooms',
        image: 'https://images.unsplash.com/photo-1715776314938-c7b1ab69ad80?auto=format&fit=crop&w=1600&q=85',
        specsTag: 'Powermatic 80 Caliber • 100M Water Resistant • Anti-Magnetic',
      },
      {
        id: 'hero-2',
        badge: 'CERTIFIED SWISS LUXURY IMPORTS',
        headline: 'Rolex Submariner & Omega Speedmaster Showcase',
        subheadline: 'Legendary chronometers imported for discerning collectors in Eastern UP. Complete with official international stamped papers, presentation cases, and provenance.',
        ctaPrimary: 'Inquire Swiss Icons',
        ctaPrimaryLink: '#collector-capsule',
        ctaSecondary: 'WhatsApp Concierge',
        ctaSecondaryLink: '#inquiry',
        image: 'https://images.unsplash.com/photo-1670404160620-a3a86428560e?auto=format&fit=crop&w=1600&q=85',
        specsTag: 'Cerachrom Ceramic Bezel • Co-Axial Master Chronometer',
      },
      {
        id: 'hero-3',
        badge: 'JAPANESE AUTOMATIC MASTERY',
        headline: 'Seiko Presage Cocktail Time & Automatic Calibers',
        subheadline: 'Exquisite radial sunburst guilloché dials with heat-blued hands, crafted by master Japanese horologists. Powered by robust in-house mechanical movements.',
        ctaPrimary: 'Discover Seiko Presage',
        ctaPrimaryLink: '#our-icons',
        ctaSecondary: 'Book Private Fitting',
        ctaSecondaryLink: '#showrooms',
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1600&q=85',
        specsTag: 'In-House 4R35 Automatic • Box-Shaped Hardlex Crystal',
      },
    ],
  },

  // 4. MULTIPLE CAROUSELS DATA (Big Brand Watches in India)
  carousels: {
    newArrivals: [
      {
        id: 'na-1',
        name: 'Tissot PRX Powermatic 80 Ice Blue 40mm',
        brand: 'Tissot Swiss',
        category: 'Automatic',
        price: 62000,
        originalPrice: 68000,
        badge: 'New Arrival',
        badgeColor: 'brass',
        image: 'https://images.unsplash.com/photo-1715776314938-c7b1ab69ad80?auto=format&fit=crop&w=800&q=80',
        movement: 'Swiss Powermatic 80.111 (80-Hour Reserve)',
        caseSize: '40mm Tonneau 316L Steel',
        strap: 'Integrated 316L Stainless Steel Bracelet',
        inStock: true,
        description: 'Mesmerizing waffle tapisserie dial in ice blue with scratch-resistant sapphire crystal and transparent exhibition caseback.',
      },
      {
        id: 'na-2',
        name: 'Seiko Presage Cocktail Time Skydiving 40.5mm',
        brand: 'Seiko Presage',
        category: 'Automatic',
        price: 45000,
        originalPrice: 49995,
        badge: 'Best Seller',
        badgeColor: 'brass',
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
        movement: 'Japanese Calibre 4R35 Automatic',
        caseSize: '40.5mm Polished Steel',
        strap: 'Solid Multi-Link Stainless Steel Bracelet',
        inStock: true,
        description: 'Shimmering radial guilloché dial with heat-blued hands inspired by cocktail culture, date window and exhibition back.',
      },
      {
        id: 'na-3',
        name: 'Rolex Datejust 41 Two-Tone Fluted Bezel',
        brand: 'Rolex',
        category: 'Luxury Swiss',
        price: 1240000,
        originalPrice: 1310000,
        badge: 'Swiss Luxury',
        badgeColor: 'forest',
        image: 'https://images.unsplash.com/photo-1639006570490-79c0c53f1080?auto=format&fit=crop&w=800&q=80',
        movement: 'Rolex Calibre 3235 Superlative Chronometer',
        caseSize: '41mm Oystersteel & 18 ct Yellow Gold',
        strap: 'Five-Piece Link Jubilee Bracelet',
        inStock: true,
        description: 'Distinctive fluted 18 ct yellow gold bezel, intense black sunray dial, and iconic five-link Jubilee bracelet.',
      },
      {
        id: 'na-4',
        name: 'Citizen Tsuyosa Automatic Emerald Green 40mm',
        brand: 'Citizen Automatics',
        category: 'Automatic',
        price: 32000,
        originalPrice: 36000,
        badge: 'Trending Drop',
        badgeColor: 'rust',
        image: 'https://images.unsplash.com/photo-1613825539220-8321042d0707?auto=format&fit=crop&w=800&q=80',
        movement: 'Miyota 8210 Automatic Calibre (42H Reserve)',
        caseSize: '40mm Integrated Lugs',
        strap: 'Curved Presidential Stainless Steel Bracelet',
        inStock: true,
        description: 'Rich emerald green sunray dial with magnified date window at 3 o\'clock, recessed 4 o\'clock crown, and seamlessly integrated presidential links.',
      },
      {
        id: 'na-5',
        name: 'TAG Heuer Carrera Chronograph Glassbox 39mm',
        brand: 'TAG Heuer',
        category: 'Chronograph',
        price: 585000,
        originalPrice: 620000,
        badge: 'Motorsport',
        badgeColor: 'rust',
        image: 'https://images.unsplash.com/photo-1630262174975-38bf8d42745f?auto=format&fit=crop&w=800&q=80',
        movement: 'In-House TH20-00 Automatic Calibre (80H Reserve)',
        caseSize: '39mm Fine-Brushed Steel',
        strap: 'Perforated Black Calfskin Racing Strap',
        inStock: true,
        description: 'Signature domed Glassbox sapphire crystal seamlessly sweeping over the curved tachymetric scale, powered by the TH20-00 manufacture chronograph movement.',
      },
      {
        id: 'na-6',
        name: 'Fossil Heritage Automatic Skeleton 43mm',
        brand: 'Fossil Heritage',
        category: 'Skeleton',
        price: 19995,
        originalPrice: 24000,
        badge: 'Vintage Drop',
        badgeColor: 'brass',
        image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=800&q=80',
        movement: 'Japanese 21-Jewel Automatic Mechanical',
        caseSize: '43mm Antique Brushed Steel',
        strap: 'Vegetable-Tanned Saddle Brown Leather',
        inStock: true,
        description: 'Intricately skeletonized exhibition dial showing balance wheel oscillation, encased in antique steel with rich luggage leather strap.',
      },
    ],

    collectorCapsule: [
      {
        id: 'cc-1',
        name: 'Rolex Submariner Date 41mm Bluesy Two-Tone',
        brand: 'Rolex',
        category: 'Luxury Swiss',
        price: 1480000,
        originalPrice: 1550000,
        badge: 'Certified Import',
        badgeColor: 'forest',
        image: 'https://images.unsplash.com/photo-1670404160620-a3a86428560e?auto=format&fit=crop&w=800&q=80',
        movement: 'Rolex Calibre 3235 Superlative Chronometer',
        caseSize: '41mm Oystersteel & 18 ct Gold',
        strap: 'Oyster Bracelet with Glidelock Clasp',
        inStock: true,
        description: 'Royal blue sunburst dial framed by a blue Cerachrom ceramic bezel and signature two-tone 18 ct yellow gold and Oystersteel bracelet.',
      },
      {
        id: 'cc-2',
        name: 'Omega Speedmaster Professional Moonwatch Co-Axial',
        brand: 'Omega',
        category: 'Luxury Swiss',
        price: 690000,
        originalPrice: 730000,
        badge: 'Space Legend',
        badgeColor: 'brass',
        image: 'https://images.unsplash.com/photo-1556453007-ee036169934b?auto=format&fit=crop&w=800&q=80',
        movement: 'Omega Co-Axial Master Chronometer 3861',
        caseSize: '42mm Asymmetrical Steel',
        strap: 'Brushed 5-Arched-Links-per-Row Steel',
        inStock: true,
        description: 'The flight-qualified watch worn on all six lunar missions. Matte step dial with dot-over-ninety anodised aluminium bezel.',
      },
      {
        id: 'cc-3',
        name: 'Cartier Santos de Cartier Large Model Automatic',
        brand: 'Cartier',
        category: 'Luxury Swiss',
        price: 725000,
        originalPrice: 765000,
        badge: 'Iconic Square',
        badgeColor: 'brass',
        image: 'https://images.unsplash.com/photo-1747995525955-92010650c3ae?auto=format&fit=crop&w=800&q=80',
        movement: 'In-House Calibre 1847 MC Automatic',
        caseSize: '39.8mm Geometric Square Steel',
        strap: 'SmartLink Stainless Steel Bracelet with QuickSwitch',
        inStock: true,
        description: 'Iconic 1904 aviator design with square bezel, visible screws, blued sword hands, and QuickSwitch interchangeable bracelet system.',
      },
      {
        id: 'cc-4',
        name: 'Rolex Sea-Dweller 43mm Oystersteel Diver',
        brand: 'Rolex',
        category: 'Luxury Swiss',
        price: 1190000,
        originalPrice: 1250000,
        badge: 'Swiss Diver',
        badgeColor: 'forest',
        image: 'https://images.unsplash.com/photo-1526045431048-f857369baa09?auto=format&fit=crop&w=800&q=80',
        movement: 'Rolex Calibre 3235 Superlative Chronometer',
        caseSize: '43mm Oystersteel with Helium Valve',
        strap: 'Solid Oystersteel Bracelet with Fliplock',
        inStock: true,
        description: 'The ultra-resistant deep-sea diver with integrated helium escape valve, scratch-resistant Cerachrom bezel, and 4,000 ft water resistance.',
      },
      {
        id: 'cc-5',
        name: 'Breitling Navitimer B01 Chronograph 43',
        brand: 'Breitling',
        category: 'Chronograph',
        price: 740000,
        originalPrice: 790000,
        badge: 'Aviation Legend',
        badgeColor: 'rust',
        image: 'https://images.unsplash.com/photo-1639564879163-a2a85682410e?auto=format&fit=crop&w=800&q=80',
        movement: 'Breitling 01 Manufacture Automatic (COSC)',
        caseSize: '43mm Polished Steel',
        strap: 'Navitimer 7-Row Stainless Steel Bracelet',
        inStock: true,
        description: 'The quintessential pilot\'s watch since 1952. Circular slide rule flight calculation bezel and in-house COSC-certified Breitling 01 calibre.',
      },
    ],

    ourIcons: [
      {
        id: 'icon-1',
        name: 'Tissot PRX Powermatic 80 Swiss Edition',
        brand: 'Tissot Swiss',
        category: 'Automatic',
        price: 62000,
        originalPrice: 68000,
        badge: 'Everyday Luxury',
        badgeColor: 'brass',
        image: 'https://images.unsplash.com/photo-1715776314938-c7b1ab69ad80?auto=format&fit=crop&w=800&q=80',
        movement: 'Swiss Powermatic 80 with Nivachron Hairspring',
        caseSize: '40mm Integrated Tonneau',
        strap: 'Satin-Brushed Solid Stainless Steel',
        inStock: true,
        description: 'The consummate Swiss sports-dress companion featuring an anti-magnetic balance spring, 80-hour power reserve, and waffle dial.',
      },
      {
        id: 'icon-2',
        name: 'Seiko Presage Craftsmanship Guilloché Automatic',
        brand: 'Seiko Presage',
        category: 'Automatic',
        price: 45000,
        originalPrice: 49995,
        badge: 'Heritage Icon',
        badgeColor: 'brass',
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
        movement: 'Seiko 4R35 Mechanical Automatic',
        caseSize: '40.5mm Polished Steel',
        strap: 'Multi-Link Fine Stainless Steel Bracelet',
        inStock: true,
        description: 'Radial guilloché dial with blued leaf hands, date complication at 3 o\'clock, and exhibition caseback displaying the decorated Japanese movement.',
      },
      {
        id: 'icon-3',
        name: 'Breitling Navitimer Aviation Pilot Chronograph',
        brand: 'Breitling',
        category: 'Chronograph',
        price: 740000,
        originalPrice: 790000,
        badge: 'Pilot Chrono',
        badgeColor: 'rust',
        image: 'https://images.unsplash.com/photo-1639564879163-a2a85682410e?auto=format&fit=crop&w=800&q=80',
        movement: 'Manufacture Calibre 01 Automatic Chrono',
        caseSize: '43mm Fluted Bezel',
        strap: 'Solid Steel Multi-Row Bracelet',
        inStock: true,
        description: 'High-altitude aviation chronograph with reverse panda dial, red chronograph second hand, and circular aeronautical slide-rule.',
      },
      {
        id: 'icon-4',
        name: 'Rolex Sea-Dweller Professional 4000ft Diver',
        brand: 'Rolex',
        category: 'Luxury Swiss',
        price: 1190000,
        originalPrice: 1250000,
        badge: 'Indestructible',
        badgeColor: 'charcoal',
        image: 'https://images.unsplash.com/photo-1526045431048-f857369baa09?auto=format&fit=crop&w=800&q=80',
        movement: 'Rolex Calibre 3235 Superlative Chronometer',
        caseSize: '43mm Monobloc Oystersteel',
        strap: 'Solid Oystersteel with Oysterlock Safety Clasp',
        inStock: true,
        description: 'Heavyweight professional diving tool watch with black Cerachrom bezel, Chromalight blue luminescence, and helium valve.',
      },
      {
        id: 'icon-5',
        name: 'Fossil Neutra Smoked Amber Chrono 44mm',
        brand: 'Fossil Classic',
        category: 'Chronograph',
        price: 14995,
        originalPrice: 17995,
        badge: 'Vintage Style',
        badgeColor: 'brass',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
        movement: 'Precision Chronograph Multi-Hand',
        caseSize: '44mm',
        strap: 'Supple Luggage Brown Saddle Leather',
        inStock: true,
        description: 'Warm amber sunray dial with Roman numeral indices, brushed antique bezel, and quick-release genuine leather strap.',
      },
    ],

    flashDeals: [
      {
        id: 'fd-1',
        name: 'Citizen Tsuyosa Automatic Emerald Sunray 40mm',
        brand: 'Citizen Automatics',
        category: 'Automatic',
        price: 27995,
        originalPrice: 36000,
        badge: '22% OFF FLASH',
        badgeColor: 'rust',
        image: 'https://images.unsplash.com/photo-1613825539220-8321042d0707?auto=format&fit=crop&w=800&q=80',
        movement: 'Miyota 8210 Automatic Calibre',
        caseSize: '40mm Integrated Lugs',
        strap: 'Presidential Curved Steel Bracelet',
        inStock: true,
        description: 'Flash Deal: Emerald green sunray dial with cyclops date magnifier and integrated presidential bracelet at 22% off.',
      },
      {
        id: 'fd-2',
        name: 'Seiko Presage Craftsmanship Urushi Automatic',
        brand: 'Seiko Presage',
        category: 'Automatic',
        price: 36995,
        originalPrice: 46000,
        badge: '20% OFF FLASH',
        badgeColor: 'rust',
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
        movement: 'Japanese 4R35 Automatic Caliber',
        caseSize: '40.5mm Polished Steel',
        strap: 'Fine Multi-Link Stainless Steel',
        inStock: true,
        description: 'Flash Deal: Radial guilloché dial with blued hands and date window at special showroom pricing.',
      },
      {
        id: 'fd-3',
        name: 'Fossil Heritage Automatic Skeleton 43mm',
        brand: 'Fossil Heritage',
        category: 'Skeleton',
        price: 15995,
        originalPrice: 21000,
        badge: '24% OFF',
        badgeColor: 'brass',
        image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=800&q=80',
        movement: 'Japanese 21-Jewel Automatic Movement',
        caseSize: '43mm Antique Steel',
        strap: 'Genuine Vegetable-Tanned Saddle Leather',
        inStock: true,
        description: 'Flash Deal: Open-heart skeleton balance wheel and gear train with genuine saddle leather strap.',
      },
      {
        id: 'fd-4',
        name: 'Fossil Neutra Chronograph Amber Vintage Leather',
        brand: 'Fossil Classic',
        category: 'Chronograph',
        price: 11995,
        originalPrice: 16000,
        badge: '25% OFF',
        badgeColor: 'forest',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
        movement: 'Precision Multi-Function Chronograph',
        caseSize: '44mm',
        strap: 'Luggage Brown Saddle Leather',
        inStock: true,
        description: 'Flash Deal: Amber sunburst chronograph with Roman numeral markers and supple saddle leather.',
      },
    ],

    indianIcons: [
      {
        id: 'ind-1',
        name: 'Titan Edge Ceramic Ultra-Slim 40mm',
        brand: 'Titan',
        category: 'Dress',
        price: 26995,
        originalPrice: 29995,
        badge: 'Ultra-Slim Record',
        badgeColor: 'brass',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        movement: 'Titan In-House Ultra-Slim Quartz (4.2mm)',
        caseSize: '40mm High-Tech Ceramic',
        strap: 'Sapphire Crystal & Ceramic Link Bracelet',
        inStock: true,
        description: 'One of the slimmest ceramic watches in the world. Engineered in India by Titan with scratch-resistant sapphire crystal and featherweight ceramic craftsmanship.',
      },
      {
        id: 'ind-2',
        name: 'Titan Octane Chronograph Matte Black & Bold Orange',
        brand: 'Titan',
        category: 'Chronograph',
        price: 12995,
        originalPrice: 14995,
        badge: 'Sport Chrono',
        badgeColor: 'rust',
        image: 'https://images.unsplash.com/photo-1610006329898-2a4f12019450?auto=format&fit=crop&w=800&q=80',
        movement: 'High-Precision Quartz Chronograph with Date',
        caseSize: '44mm Black Ion-Plated Steel',
        strap: 'Perforated Racing Black Silicone & Leather Hybrid',
        inStock: true,
        description: 'Bold dual-layer tachymeter dial with high-contrast orange chronograph accents, 100M water resistance, and racing date window.',
      },
      {
        id: 'ind-3',
        name: 'HMT Kohinoor 17-Jewel Manual-Wind Mechanical',
        brand: 'HMT',
        category: 'Automatic',
        price: 11500,
        originalPrice: 13500,
        badge: 'Indian Legend',
        badgeColor: 'brass',
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80',
        movement: 'HMT Calibre 0231 17-Jewel Hand-Wound Mechanical',
        caseSize: '36mm Vintage Polished Steel',
        strap: 'Vintage 18mm Stainless Steel Fold-Over Bracelet',
        inStock: true,
        description: 'The historic pride of Indian horology since 1961. Hand-wound 17-jewel movement with audible mechanical sweep, polished steel case, and sunburst dial.',
      },
      {
        id: 'ind-4',
        name: 'Titan Regalia Two-Tone Gold & Steel Guilloché',
        brand: 'Titan',
        category: 'Dress',
        price: 15495,
        originalPrice: 17995,
        badge: 'Festive Royal',
        badgeColor: 'brass',
        image: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=800&q=80',
        movement: 'Titan Precision Three-Hand Quartz with Day-Date',
        caseSize: '41mm Two-Tone Gold & Steel',
        strap: 'Two-Tone 18ct Gold PVD & Stainless Steel Bracelet',
        inStock: true,
        description: 'Classic royal Indian festive styling with Roman numeral hour markers, champagne guilloché dial, and two-tone gold PVD link bracelet.',
      },
      {
        id: 'ind-5',
        name: 'HMT Janata Devnagari Mechanical Heritage Edition',
        brand: 'HMT',
        category: 'Automatic',
        price: 9995,
        originalPrice: 11995,
        badge: 'Heritage Devnagari',
        badgeColor: 'forest',
        image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=800&q=80',
        movement: 'HMT Calibre 0231 17-Jewels Hand-Wound Mechanical',
        caseSize: '35.5mm Classic Domed Acrylic Case',
        strap: 'Handcrafted Tan Top-Grain Leather Strap',
        inStock: true,
        description: 'Historic Indian dress watch featuring authentic Devnagari numerals on an ivory enamel dial, manufactured in Bangalore heritage facilities.',
      },
      {
        id: 'ind-6',
        name: 'Fastrack Street All-Black Diver Chrono 45mm',
        brand: 'Fastrack',
        category: 'Chronograph',
        price: 5495,
        originalPrice: 6495,
        badge: 'Youth Street',
        badgeColor: 'rust',
        image: 'https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?auto=format&fit=crop&w=800&q=80',
        movement: 'Multi-Function Sport Calibre with Dual Sub-Dials',
        caseSize: '45mm Gunmetal Ion-Plated Steel',
        strap: 'Textured Heavy-Duty All-Black Silicone Strap',
        inStock: true,
        description: 'Youth-inspired rugged street chronograph with gunmetal angular case, tactile pushers, 50M water resistance, and high-visibility indices.',
      },
      {
        id: 'ind-7',
        name: 'Sonata Poze Classic Sunray Gold 40mm',
        brand: 'Sonata',
        category: 'Dress',
        price: 2995,
        originalPrice: 3495,
        badge: 'Everyday Classic',
        badgeColor: 'brass',
        image: 'https://images.unsplash.com/photo-1518131672697-613becd4fab5?auto=format&fit=crop&w=800&q=80',
        movement: 'Sonata Reliable Quartz Calibre',
        caseSize: '40mm Yellow Gold Tone Case',
        strap: 'Genuine Brown Crocodile-Pattern Leather Strap',
        inStock: true,
        description: 'Timeless everyday Indian elegance from the Tata family. Clean champagne sunray dial with minimalist baton markers and croc-embossed leather.',
      },
      {
        id: 'ind-8',
        name: 'Titan Mechanical Open-Heart Automatic 43mm',
        brand: 'Titan',
        category: 'Skeleton',
        price: 24995,
        originalPrice: 28995,
        badge: 'Titan Automatic',
        badgeColor: 'forest',
        image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=800&q=80',
        movement: 'In-House 22-Jewel Automatic Mechanical (40H Reserve)',
        caseSize: '43mm Polished Steel',
        strap: 'Midnight Blue Embossed Alligator Leather Strap',
        inStock: true,
        description: 'Titan\'s flagship automatic mechanical masterpiece with visible balance-wheel exhibition aperture at 7 o\'clock and sapphire crystal.',
      },
    ],
  },

  // 5. SHOP BY HOROLOGY CATEGORY (All Big Brand Watches in India)
  categories: [
    {
      id: 'cat-indian',
      title: 'Indian Heritage & Brands',
      subtitle: 'Titan Edge, Octane, HMT Mechanicals, Fastrack & Sonata',
      itemCount: '45+ Timepieces',
      tag: '🇮🇳 Proud Indian Horology',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      filterKey: 'Indian Brands',
    },
    {
      id: 'cat-swiss',
      title: 'Swiss Luxury & Automatics',
      subtitle: 'Rolex, Omega, Tissot, Rado & Cartier',
      itemCount: '38 Timepieces',
      tag: 'Swiss Certified',
      image: 'https://images.unsplash.com/photo-1670404160620-a3a86428560e?auto=format&fit=crop&w=800&q=80',
      filterKey: 'Automatic',
    },
    {
      id: 'cat-japanese',
      title: 'Japanese Presage & Automatics',
      subtitle: 'Seiko Presage, Prospex & Citizen Tsuyosa',
      itemCount: '29 Timepieces',
      tag: 'In-House Calibers',
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
      filterKey: 'Automatic',
    },
    {
      id: 'cat-chronos',
      title: 'Racing Chronographs & Aviators',
      subtitle: 'TAG Heuer Carrera, Omega Moonwatch & Breitling',
      itemCount: '24 Chronographs',
      tag: 'Split-Second Precision',
      image: 'https://images.unsplash.com/photo-1630262174975-38bf8d42745f?auto=format&fit=crop&w=800&q=80',
      filterKey: 'Chronograph',
    },
    {
      id: 'cat-skeletons',
      title: 'Heritage Skeletons & Exhibition',
      subtitle: 'Fossil Heritage, Open Heart & 21-Jewel Automatics',
      itemCount: '19 Open-Heart Pieces',
      tag: 'Exhibition Glass',
      image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=800&q=80',
      filterKey: 'Skeleton',
    },
  ],

  // 6. BACKGROUND WATCH ADVERTISEMENT SHOWCASE (SIGNATURE EDITORIAL)
  editorialAd: {
    badge: 'SWISS HOROLOGY MASTERPIECE • GORAKHPUR FLAGSHIPS',
    title: 'The Heritage of Rolex Oystersteel & 18 ct Yellow Gold',
    quote: '“A fine mechanical watch doesn’t just count hours. It preserves generations of precision engineering and personal triumphs.”',
    description: 'Ram Prasad Agencies is Eastern UP\'s authorized destination for world-renowned horological houses. Every timepiece across our Baldev Plaza and JalKal Building showrooms is 100% authentic, accompanied by official international stamped warranty cards, tamper-proof serial numbers, and lifetime battery and ultrasonic bracelet sizing support.',
    caliber: 'Rolex Calibre 3235 Superlative Chronometer (70-Hour Reserve)',
    material: 'Oystersteel & 18 ct Yellow Gold Rolesor with Fluted Bezel',
    strapLeather: 'Five-Piece Link Jubilee Bracelet with Easylink Extension',
    glass: 'Domed Scratch-Proof Sapphire Crystal with Cyclops Magnifier Lens Over Date',
    waterResistance: '100 Meters / 330 Feet Waterproof Twinlock System',
    image: 'https://images.unsplash.com/photo-1639006570490-79c0c53f1080?auto=format&fit=crop&w=1200&q=85',
    price: 1240000,
  },

  // 6B. THE MAISON PORTFOLIO BRANDS
  brands: [
    { name: 'Titan', country: 'India', desc: 'Edge, Octane & Regalia Flagships' },
    { name: 'HMT', country: 'India', desc: 'Kohinoor & Janata Mechanical Heritage' },
    { name: 'Fastrack', country: 'India', desc: 'Youth Sport & Street Chronographs' },
    { name: 'Sonata', country: 'India', desc: 'Everyday Reliable Indian Horology' },
    { name: 'Tissot', country: 'Swiss', desc: 'PRX & Heritage Swiss Precision' },
    { name: 'Rolex', country: 'Swiss', desc: 'Certified Swiss Luxury Imports' },
    { name: 'Omega', country: 'Swiss', desc: 'Moonwatch & Co-Axial Chronometers' },
    { name: 'Seiko', country: 'Japan', desc: 'Automatic & Presage Craft' },
    { name: 'Citizen', country: 'Japan', desc: 'Tsuyosa & Eco-Drive Calibers' },
    { name: 'Breitling', country: 'Swiss', desc: 'Navitimer Aviation Chronographs' },
    { name: 'Fossil', country: 'USA', desc: 'Heritage Automatics & Vintage Styling' },
    { name: 'Rado', country: 'Swiss', desc: 'Master of High-Tech Ceramic' },
  ],

  // 6C. TRUST & AUTHENTICITY BADGES
  trustBadges: [
    { title: 'Official Stamped 2-Yr Warranty', subtitle: 'International Manufacturer Backed' },
    { title: 'Baldev Plaza & JalKal Flagships', subtitle: 'Twin Experience Stores in Golghar' },
    { title: 'Authentic Imported Horology', subtitle: 'Swiss, Japanese & Indian Calibers' },
  ],

  // 7. BRAND & APPEARANCE SYSTEM
  appearance: {
    primaryColor: '#C5A059',
    backgroundColor: '#FAF7F2',
    charcoalColor: '#1A1A1A',
    cardBg: '#FFFFFF',
    accentColor: '#B85D38',
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Plus Jakarta Sans',
    fontSizeScale: 'medium',
  },

  // 8. CONSULTATION & INQUIRY FORM BUILDER CONFIGURATION
  inquiryFormConfig: {
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
          'Custom Sourcing for Imported Reference (Rolex, Omega, Tissot, Seiko)',
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
  },
};

export const DEFAULT_INQUIRY_FORM_CONFIG = DEFAULT_VINTAGE_STORE_DATA.inquiryFormConfig;

// Helper to safely merge saved data with complete defaults
export const sanitizeStoreData = (data) => {
  if (!data || typeof data !== 'object') return DEFAULT_VINTAGE_STORE_DATA;
  const rawTagline = data.tagline;
  const cleanTagline = (!rawTagline || rawTagline.includes('Authorized & Imported') || rawTagline.includes('Vintage Horology') || rawTagline.includes('TheWatchStore.in'))
    ? DEFAULT_VINTAGE_STORE_DATA.tagline
    : rawTagline;

  return {
    ...DEFAULT_VINTAGE_STORE_DATA,
    ...data,
    tagline: cleanTagline,
    footerVipBadge: data.footerVipBadge || DEFAULT_VINTAGE_STORE_DATA.footerVipBadge,
    footerVipTitle: data.footerVipTitle || DEFAULT_VINTAGE_STORE_DATA.footerVipTitle,
    footerVipSubtitle: data.footerVipSubtitle || DEFAULT_VINTAGE_STORE_DATA.footerVipSubtitle,
    logo: data.logo || DEFAULT_VINTAGE_STORE_DATA.logo || '/logo.png',
    announcements: {
      ...DEFAULT_VINTAGE_STORE_DATA.announcements,
      ...(data.announcements || {}),
      messages: (data.announcements?.messages && data.announcements.messages.length > 0)
        ? data.announcements.messages
        : DEFAULT_VINTAGE_STORE_DATA.announcements.messages,
    },
    flashSale: {
      ...DEFAULT_VINTAGE_STORE_DATA.flashSale,
      ...(data.flashSale?.flashSale ? data.flashSale.flashSale : (data.flashSale || {})),
    },
    hero: {
      ...DEFAULT_VINTAGE_STORE_DATA.hero,
      ...(data.hero || {}),
      slides: (data.hero?.slides && Array.isArray(data.hero.slides) && data.hero.slides.length > 0)
        ? data.hero.slides
        : DEFAULT_VINTAGE_STORE_DATA.hero.slides,
    },
    carousels: {
      ...DEFAULT_VINTAGE_STORE_DATA.carousels,
      ...(data.carousels || {}),
      newArrivals: (data.carousels?.newArrivals && Array.isArray(data.carousels.newArrivals) && data.carousels.newArrivals.length > 0)
        ? data.carousels.newArrivals
        : DEFAULT_VINTAGE_STORE_DATA.carousels.newArrivals,
      collectorCapsule: (data.carousels?.collectorCapsule && Array.isArray(data.carousels.collectorCapsule) && data.carousels.collectorCapsule.length > 0)
        ? data.carousels.collectorCapsule
        : DEFAULT_VINTAGE_STORE_DATA.carousels.collectorCapsule,
      ourIcons: (data.carousels?.ourIcons && Array.isArray(data.carousels.ourIcons) && data.carousels.ourIcons.length > 0)
        ? data.carousels.ourIcons
        : DEFAULT_VINTAGE_STORE_DATA.carousels.ourIcons,
      flashDeals: (data.carousels?.flashDeals && Array.isArray(data.carousels.flashDeals) && data.carousels.flashDeals.length > 0)
        ? data.carousels.flashDeals
        : DEFAULT_VINTAGE_STORE_DATA.carousels.flashDeals,
      indianIcons: (data.carousels?.indianIcons && Array.isArray(data.carousels.indianIcons) && data.carousels.indianIcons.length > 0)
        ? data.carousels.indianIcons
        : DEFAULT_VINTAGE_STORE_DATA.carousels.indianIcons,
    },
    categories: (data.categories && Array.isArray(data.categories) && data.categories.length > 0)
      ? data.categories
      : DEFAULT_VINTAGE_STORE_DATA.categories,
    editorialAd: {
      ...DEFAULT_VINTAGE_STORE_DATA.editorialAd,
      ...(data.editorialAd || {}),
    },
    appearance: {
      primaryColor: '#C5A059',
      backgroundColor: '#FAF7F2',
      charcoalColor: '#1A1A1A',
      cardBg: '#FFFFFF',
      accentColor: '#B85D38',
      headingFont: 'Plus Jakarta Sans',
      bodyFont: 'Plus Jakarta Sans',
      fontSizeScale: 'medium',
      ...(data.appearance || {}),
    },
    showrooms: (data.showrooms && Array.isArray(data.showrooms) && data.showrooms.length > 0 && Array.isArray(data.showrooms[0]?.specialties))
      ? data.showrooms
      : DEFAULT_VINTAGE_STORE_DATA.showrooms,
    brands: (data.brands && Array.isArray(data.brands) && data.brands.length > 0)
      ? data.brands
      : DEFAULT_VINTAGE_STORE_DATA.brands,
    trustBadges: (data.trustBadges && Array.isArray(data.trustBadges) && data.trustBadges.length > 0)
      ? data.trustBadges
      : DEFAULT_VINTAGE_STORE_DATA.trustBadges,
    inquiryFormConfig: {
      ...DEFAULT_INQUIRY_FORM_CONFIG,
      ...(data.inquiryFormConfig || {}),
      fields: (data.inquiryFormConfig?.fields && Array.isArray(data.inquiryFormConfig.fields) && data.inquiryFormConfig.fields.length > 0)
        ? data.inquiryFormConfig.fields
        : DEFAULT_INQUIRY_FORM_CONFIG.fields,
    },
  };
};

// ============================================================================
// STORE CONTEXT & REALTIME BROADCAST ENGINE
// ============================================================================
export const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [storeData, setStoreData] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return sanitizeStoreData(parsed);
      }
    } catch (e) {
      console.warn('LocalStorage read error:', e);
    }
    return DEFAULT_VINTAGE_STORE_DATA;
  });

  const [lastSyncTime, setLastSyncTime] = useState(Date.now());
  const [syncStatus, setSyncStatus] = useState('synchronized'); // 'synchronized' | 'saving' | 'synced-external'
  const broadcastChannelRef = useRef(null);

  // Initialize BroadcastChannel for instant cross-tab real-time updates
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        broadcastChannelRef.current = channel;

        channel.onmessage = (event) => {
          if (event?.data?.type === 'STORE_UPDATED' && event.data.payload) {
            setStoreData(sanitizeStoreData(event.data.payload));
            setLastSyncTime(event.data.timestamp || Date.now());
            setSyncStatus('synced-external');
            setTimeout(() => setSyncStatus('synchronized'), 2500);
          }
        };
      }
    } catch (err) {
      console.warn('BroadcastChannel not supported or error:', err);
    }

    // Listen to window storage events (in case BroadcastChannel isn't supported)
    const handleStorageChange = (e) => {
      if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setStoreData(sanitizeStoreData(parsed));
          setLastSyncTime(Date.now());
          setSyncStatus('synced-external');
          setTimeout(() => setSyncStatus('synchronized'), 2500);
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Sync with backend API (watches, settings, hero slides) on mount, window focus, and every 4s polling
  useEffect(() => {
    const syncWithBackend = async () => {
      try {
        const [settings, backendWatches] = await Promise.all([
          fetchSettings().catch(() => null),
          fetchWatches().catch(() => null),
        ]);

        setStoreData((prev) => {
          let merged = { ...prev };

          // 1. If backend has vintageStoreData, prioritize it
          if (settings?.vintageStoreData) {
            Object.assign(merged, settings.vintageStoreData);
          }

          // 2. Synchronize Admin Settings fields from MongoDB
          if (settings) {
            if (settings.contactPhone) {
              merged.contactPhone = settings.contactPhone;
            }
            if (settings.logo) {
              merged.logo = settings.logo;
            }
            if (settings.heroSlides && Array.isArray(settings.heroSlides) && settings.heroSlides.length > 0) {
              merged.hero = {
                ...merged.hero,
                slides: settings.heroSlides.map((s, idx) => ({
                  id: s.id || `slide-${idx}`,
                  badge: s.badge || 'EST. 1984 • VINTAGE HERITAGE',
                  headline: s.headline || s.title || 'Vintage Timepiece Showcase',
                  subheadline: s.subheadline || s.subtitle || '',
                  ctaPrimary: s.ctaPrimary || 'Shop The Capsule',
                  ctaPrimaryLink: s.ctaPrimaryLink || '#new-arrivals',
                  ctaSecondary: s.ctaSecondary || 'View Showrooms',
                  ctaSecondaryLink: s.ctaSecondaryLink || '#showrooms',
                  image: s.image,
                  specsTag: s.tag || s.specsTag || 'Official International Warranty',
                })),
              };
            }
            if (settings.heroTitle && merged.hero?.slides?.[0]) {
              merged.hero.slides[0].headline = settings.heroTitle;
            }
            if (settings.heroSubtitle && merged.hero?.slides?.[0]) {
              merged.hero.slides[0].subheadline = settings.heroSubtitle;
            }
            if (settings.showrooms && Array.isArray(settings.showrooms) && settings.showrooms.length > 0) {
              merged.showrooms = settings.showrooms;
            }
            if (settings.brands && Array.isArray(settings.brands) && settings.brands.length > 0) {
              merged.brands = settings.brands;
            }
            if (settings.trustBadges && Array.isArray(settings.trustBadges) && settings.trustBadges.length > 0) {
              merged.trustBadges = settings.trustBadges;
            }
            if (settings.announcements) {
              merged.announcements = {
                ...merged.announcements,
                ...settings.announcements,
              };
            }
            if (settings.inquiryTitle) {
              merged.inquiryTitle = settings.inquiryTitle;
            }
            if (settings.inquirySubtitle) {
              merged.inquirySubtitle = settings.inquirySubtitle;
            }
            if (settings.footerCopyright) {
              merged.footerCopyright = settings.footerCopyright;
            }
            if (settings.flashSale) {
              const fs = settings.flashSale.flashSale || settings.flashSale;
              merged.flashSale = {
                ...merged.flashSale,
                ...fs,
              };
            }
            if (settings.inquiryFormConfig) {
              merged.inquiryFormConfig = {
                ...merged.inquiryFormConfig,
                ...settings.inquiryFormConfig,
              };
            }
          }

          // 3. Synchronize Live Watches from MongoDB / Admin WatchManager
          if (backendWatches && Array.isArray(backendWatches) && backendWatches.length > 0) {
            const formattedWatches = backendWatches.map((w) => ({
              id: w._id || w.id,
              name: w.name,
              brand: w.brand,
              price: w.price,
              originalPrice: w.originalPrice || (w.price ? Math.round((w.price * 1.15) / 100) * 100 : 0),
              badge: w.badge || (w.featured ? 'Featured Drop' : 'In Stock'),
              badgeColor: 'brass',
              image: w.image,
              movement: w.movement || w.category || 'Automatic Movement',
              caseSize: w.caseDiameter || '40mm',
              strap: w.strapType || 'Top-Grain Leather',
              inStock: w.inStock !== false,
              description: w.description || '',
              storeLocation: w.storeLocation || 'Baldev Plaza & JalKal Building, Golghar, Gorakhpur',
              category: w.category || 'Automatic',
              collectionName: w.collectionName || 'newArrivals',
            }));

            // Group watches into their targeted carousels
            const newArrivalsBackend = formattedWatches.filter((w) => !w.collectionName || w.collectionName === 'newArrivals');
            const collectorBackend = formattedWatches.filter((w) => w.collectionName === 'collectorCapsule');
            const ourIconsBackend = formattedWatches.filter((w) => w.collectionName === 'ourIcons');
            const flashDealsBackend = formattedWatches.filter((w) => w.collectionName === 'flashDeals');
            const indianBackend = formattedWatches.filter((w) =>
              w.collectionName === 'indianIcons' ||
              ['titan', 'hmt', 'fastrack', 'sonata'].some((b) => (w.brand || '').toLowerCase().includes(b))
            );

            // Defaults fallback
            const defNA = DEFAULT_VINTAGE_STORE_DATA.carousels?.newArrivals || [];
            const nonDupNA = defNA.filter((d) => !newArrivalsBackend.some((bw) => bw.name.toLowerCase() === d.name.toLowerCase()));

            const defCol = DEFAULT_VINTAGE_STORE_DATA.carousels?.collectorCapsule || [];
            const nonDupCol = defCol.filter((d) => !collectorBackend.some((bw) => bw.name.toLowerCase() === d.name.toLowerCase()));

            const defIcons = DEFAULT_VINTAGE_STORE_DATA.carousels?.ourIcons || [];
            const nonDupIcons = defIcons.filter((d) => !ourIconsBackend.some((bw) => bw.name.toLowerCase() === d.name.toLowerCase()));

            const defFlash = DEFAULT_VINTAGE_STORE_DATA.carousels?.flashDeals || [];
            const nonDupFlash = defFlash.filter((d) => !flashDealsBackend.some((bw) => bw.name.toLowerCase() === d.name.toLowerCase()));

            const defInd = DEFAULT_VINTAGE_STORE_DATA.carousels?.indianIcons || [];
            const nonDupInd = defInd.filter((d) => !indianBackend.some((bw) => bw.name.toLowerCase() === d.name.toLowerCase()));

            merged.carousels = {
              ...merged.carousels,
              newArrivals: [...newArrivalsBackend, ...nonDupNA],
              collectorCapsule: collectorBackend.length > 0 ? [...collectorBackend, ...nonDupCol] : defCol,
              ourIcons: ourIconsBackend.length > 0 ? [...ourIconsBackend, ...nonDupIcons] : defIcons,
              flashDeals: flashDealsBackend.length > 0 ? [...flashDealsBackend, ...nonDupFlash] : defFlash,
              indianIcons: indianBackend.length > 0 ? [...indianBackend, ...nonDupInd] : defInd,
            };
          }

          return sanitizeStoreData(merged);
        });
      } catch (err) {
        console.warn('Backend sync error:', err);
      }
    };

    syncWithBackend();

    const pollInterval = setInterval(syncWithBackend, 4000);
    window.addEventListener('focus', syncWithBackend);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('focus', syncWithBackend);
    };
  }, []);

  // Save changes locally, broadcast to other tabs, and persist to backend
  const commitStoreData = useCallback((updater) => {
    setSyncStatus('saving');
    setStoreData((prev) => {
      const updated = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      
      // 1. Save to LocalStorage
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }

      // 2. Broadcast to other tabs/windows in real time
      try {
        if (broadcastChannelRef.current) {
          broadcastChannelRef.current.postMessage({
            type: 'STORE_UPDATED',
            payload: updated,
            timestamp: Date.now(),
          });
        }
      } catch (err) {
        console.warn('Broadcast send error:', err);
      }

      // 3. Dispatch CustomEvent for intra-window reactivity
      try {
        window.dispatchEvent(new CustomEvent('fossil-store-updated', { detail: updated }));
      } catch {
        // ignore
      }

      // 4. Asynchronously push to backend API so it persists permanently in MongoDB
      updateSettings({
        vintageStoreData: updated,
        heroTitle: updated.hero?.slides?.[0]?.headline || prev.heroTitle,
        heroSubtitle: updated.hero?.slides?.[0]?.subheadline || prev.heroSubtitle,
        announcementText: updated.announcements?.messages?.[0] || prev.announcementText,
      }).catch(() => {
        // Backend silent fallback
      });

      setLastSyncTime(Date.now());
      setTimeout(() => setSyncStatus('synchronized'), 800);
      return updated;
    });
  }, []);

  // --------------------------------------------------------------------------
  // Granular Updaters for Admin Panel
  // --------------------------------------------------------------------------
  const updateAnnouncements = useCallback((announcementPayload) => {
    commitStoreData((prev) => ({
      ...prev,
      announcements: {
        ...prev.announcements,
        ...announcementPayload,
      },
    }));
  }, [commitStoreData]);

  const toggleFlashSale = useCallback((active) => {
    commitStoreData((prev) => ({
      ...prev,
      flashSale: {
        ...prev.flashSale,
        isActive: active !== undefined ? active : !prev.flashSale.isActive,
      },
    }));
  }, [commitStoreData]);

  const updateFlashSale = useCallback((flashSalePayload) => {
    commitStoreData((prev) => ({
      ...prev,
      flashSale: {
        ...prev.flashSale,
        ...flashSalePayload,
      },
    }));
  }, [commitStoreData]);

  const updateHeroSlides = useCallback((slides) => {
    commitStoreData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        slides,
      },
    }));
  }, [commitStoreData]);

  const updateHeroSlide = useCallback((index, slideData) => {
    commitStoreData((prev) => {
      const slides = [...(prev.hero?.slides || [])];
      slides[index] = { ...slides[index], ...slideData };
      return {
        ...prev,
        hero: {
          ...prev.hero,
          slides,
        },
      };
    });
  }, [commitStoreData]);

  const addHeroSlide = useCallback((newSlide) => {
    commitStoreData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        slides: [
          ...(prev.hero?.slides || []),
          {
            id: `hero-${Date.now()}`,
            badge: 'NEW CAMPAIGN',
            headline: 'New Timepiece Showcase',
            subheadline: 'Describe the vintage craft and imported horology release here.',
            ctaPrimary: 'Shop Now',
            ctaPrimaryLink: '#new-arrivals',
            ctaSecondary: 'Learn More',
            ctaSecondaryLink: '#showrooms',
            image: 'https://images.unsplash.com/photo-1715776314938-c7b1ab69ad80?auto=format&fit=crop&w=1600&q=85',
            ...newSlide,
          },
        ],
      },
    }));
  }, [commitStoreData]);

  const removeHeroSlide = useCallback((index) => {
    commitStoreData((prev) => {
      const slides = [...(prev.hero?.slides || [])];
      if (slides.length <= 1) return prev; // keep at least 1
      slides.splice(index, 1);
      return {
        ...prev,
        hero: {
          ...prev.hero,
          slides,
        },
      };
    });
  }, [commitStoreData]);

  const updateCarouselItems = useCallback((carouselKey, items) => {
    commitStoreData((prev) => ({
      ...prev,
      carousels: {
        ...prev.carousels,
        [carouselKey]: items,
      },
    }));
  }, [commitStoreData]);

  const addProductToCarousel = useCallback((carouselKey, product) => {
    commitStoreData((prev) => {
      const currentList = prev.carousels?.[carouselKey] || [];
      const newProduct = {
        id: `prod-${Date.now()}`,
        name: 'New Vintage Timepiece',
        brand: 'Fossil Heritage',
        category: 'Automatic',
        price: 14995,
        originalPrice: 17995,
        badge: 'New Release',
        badgeColor: 'brass',
        image: 'https://images.unsplash.com/photo-1670404160620-a3a86428560e?auto=format&fit=crop&w=800&q=80',
        movement: 'Japanese Automatic',
        caseSize: '42mm',
        strap: 'Italian Leather',
        inStock: true,
        description: 'Exquisite vintage timepiece crafted with precision.',
        ...product,
      };
      return {
        ...prev,
        carousels: {
          ...prev.carousels,
          [carouselKey]: [newProduct, ...currentList],
        },
      };
    });
  }, [commitStoreData]);

  const updateProductInCarousel = useCallback((carouselKey, productId, updatedFields) => {
    commitStoreData((prev) => {
      const currentList = prev.carousels?.[carouselKey] || [];
      const updatedList = currentList.map((item) =>
        item.id === productId ? { ...item, ...updatedFields } : item
      );
      return {
        ...prev,
        carousels: {
          ...prev.carousels,
          [carouselKey]: updatedList,
        },
      };
    });
  }, [commitStoreData]);

  const removeProductFromCarousel = useCallback((carouselKey, productId) => {
    commitStoreData((prev) => {
      const currentList = prev.carousels?.[carouselKey] || [];
      const updatedList = currentList.filter((item) => item.id !== productId);
      return {
        ...prev,
        carousels: {
          ...prev.carousels,
          [carouselKey]: updatedList,
        },
      };
    });
  }, [commitStoreData]);

  const updateCategories = useCallback((categories) => {
    commitStoreData((prev) => ({
      ...prev,
      categories,
    }));
  }, [commitStoreData]);

  const updateEditorialAd = useCallback((editorialAd) => {
    commitStoreData((prev) => ({
      ...prev,
      editorialAd: {
        ...prev.editorialAd,
        ...editorialAd,
      },
    }));
  }, [commitStoreData]);

  const resetToDefaults = useCallback(() => {
    commitStoreData(() => DEFAULT_VINTAGE_STORE_DATA);
  }, [commitStoreData]);

  const value = {
    storeData,
    lastSyncTime,
    syncStatus,
    commitStoreData,
    updateAnnouncements,
    toggleFlashSale,
    updateFlashSale,
    updateHeroSlides,
    updateHeroSlide,
    addHeroSlide,
    removeHeroSlide,
    updateCarouselItems,
    addProductToCarousel,
    updateProductInCarousel,
    removeProductFromCarousel,
    updateCategories,
    updateEditorialAd,
    resetToDefaults,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
