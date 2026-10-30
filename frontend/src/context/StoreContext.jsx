import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { fetchSettings, updateSettings, fetchWatches } from '../utils/api';

const LOCAL_STORAGE_KEY = 'fossil_storefront_state_v2';
const BROADCAST_CHANNEL_NAME = 'fossil_store_realtime_sync';

// ============================================================================
// CURATED VINTAGE-INSPIRED DEFAULT DATASET (Fossil Luxury Lifestyle Aesthetic)
// ============================================================================
export const DEFAULT_VINTAGE_STORE_DATA = {
  version: '7.0.0',
  brandName: 'RAM PRASAD AGENCIES',
  tagline: 'WATCHSTORE.IN',
  logo: '/logo.png',
  contactPhone: '+91 98765 43210',
  inquiryTitle: 'Bespoke Sourcing & Private Showroom Consultation',
  footerCopyright: 'Ram Prasad Agencies. Baldev Plaza & JalKal Building, Golghar, Gorakhpur. Authorized Watch Specialists. All rights reserved.',
  footerVipBadge: 'Vintage Collectors Circle',
  footerVipTitle: 'Receive 10% Off Your First Automatic Timepiece',
  footerVipSubtitle: 'Preview limited-edition capsule drops and private showroom fittings in Gorakhpur.',
  certificateImage: '/images/about/heritage-certificate.webp',

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
        'Official Swiss Collections (Tissot, Rado, Breitling, Omega)',
        'Indian Heritage Horology (Titan Edge, Titan Mechanicals, HMT Kohinoor & Janata)',
        'Collector Import Consultations (Omega, Breitling, Rado)',
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
        'Casual Luxury & Chronographs (Fossil, Fastrack, Sonata)',
        'Designer horology collections (Titan Raga, Fossil Heritage)',
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
      '🇮🇳 INDIAN WATCH HERITAGE: Complete Collections for Titan, Titan Raga, HMT, Fastrack & Sonata Available at Golghar',
      '⚡ FLASH SALE: Extra 15% Off Swiss, Japanese & Indian Mechanicals • Use Code: VINTAGE15',
      'Authorized Luxury Specialist for Tissot, Seiko, Titan, HMT, Citizen, Fossil & Swiss Calibers',
      'Direct Imports for Omega, Tissot & Breitling with Stamped International Warranty',
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
        badge: 'SWISS PRECISION',
        headline: 'Tissot PRX & Swiss Automatics',
        subheadline: 'Iconic 1970s integrated bracelet design powered by an 80-hour Nivachron anti-magnetic movement.',
        ctaPrimary: 'Explore Maisons',
        ctaPrimaryLink: '#brands',
        ctaSecondary: 'View Showrooms',
        ctaSecondaryLink: '#showrooms',
        image: '/images/watches/tissot-prx-powermatic-80.webp',
      },
      {
        id: 'hero-2',
        badge: 'CERTIFIED SWISS IMPORTS',
        headline: 'Omega & Tissot Swiss Showcase',
        subheadline: 'Certified authentic Swiss chronometers with international warranty and stamped papers in Gorakhpur.',
        ctaPrimary: 'Explore Brands',
        ctaPrimaryLink: '#brands',
        ctaSecondary: 'WhatsApp Concierge',
        ctaSecondaryLink: '#inquiry',
        image: '/images/hero-omega-showcase.webp',
      },
      {
        id: 'hero-3',
        badge: 'JAPANESE CRAFTSMANSHIP',
        headline: 'Seiko Presage Automatics',
        subheadline: 'Exquisite radial sunburst guilloché dials crafted with authentic in-house mechanical calibers.',
        ctaPrimary: 'Explore Maisons',
        ctaPrimaryLink: '#brands',
        ctaSecondary: 'View Showrooms',
        ctaSecondaryLink: '#showrooms',
        image: '/images/watches/seiko-presage-cocktail-time.webp',
      },
      {
        id: 'hero-4',
        badge: 'TITAN COLLECTION',
        headline: 'Titan Edge & Regalia Heritage',
        subheadline: 'Engineered in India: the world-renowned ultra-slim ceramic calibers and royal festive guilloché timepieces by the Tata legacy.',
        ctaPrimary: 'Explore Titan',
        ctaPrimaryLink: '#brands',
        ctaSecondary: 'View Showrooms',
        ctaSecondaryLink: '#showrooms',
        image: '/images/hero-titan-regalia.webp',
      },
      {
        id: 'hero-5',
        badge: 'HMT MECHANICAL',
        headline: 'HMT Kohinoor & Janata Mechanicals',
        subheadline: 'Authentic 17-jewel hand-wound mechanical calibers with timeless Devnagari dials since 1961.',
        ctaPrimary: 'Explore HMT',
        ctaPrimaryLink: '#brands',
        ctaSecondary: 'WhatsApp Concierge',
        ctaSecondaryLink: '#inquiry',
        image: '/images/hero-hmt-kohinoor-vintage.webp',
      },
      {
        id: 'hero-6',
        badge: 'FASTRACK & SONATA',
        headline: 'Fastrack Chronos & Sonata Classics',
        subheadline: 'Bold youth street chronographs and dependable everyday classics crafted for Indian lifestyle, with showroom warranty in Golghar.',
        ctaPrimary: 'Explore Collections',
        ctaPrimaryLink: '#brands',
        ctaSecondary: 'Visit Showrooms',
        ctaSecondaryLink: '#showrooms',
        image: '/images/fastrack-banner.webp',
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
        image: '/images/watches/tissot-prx-35-ice-blue.webp',
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
        image: '/images/watches/seiko-presage-cocktail-time.webp',
        movement: 'Japanese Calibre 4R35 Automatic',
        caseSize: '40.5mm Polished Steel',
        strap: 'Solid Multi-Link Stainless Steel Bracelet',
        inStock: true,
        description: 'Shimmering radial guilloché dial with heat-blued hands inspired by cocktail culture, date window and exhibition back.',
      },
      {
        id: 'na-3',
        name: 'Omega Seamaster Aqua Terra 150M Master Chronometer',
        brand: 'Omega',
        category: 'Luxury Swiss',
        price: 595000,
        originalPrice: 630000,
        badge: 'Swiss Luxury',
        badgeColor: 'forest',
        image: '/images/watches/omega-seamaster-aqua-terra.webp',
        movement: 'Omega Co-Axial Master Chronometer 8900',
        caseSize: '41mm Stainless Steel',
        strap: 'Integrated Stainless Steel Bracelet',
        inStock: true,
        description: 'Horizontal teak concept dial inspired by wooden decks of luxury yachts, date window at 6 o’clock, and certified METAS anti-magnetic precision.',
      },
      {
        id: 'na-4',
        name: 'Citizen Tsuyosa Automatic Emerald Sunray 40mm',
        brand: 'Citizen Automatics',
        category: 'Automatic',
        price: 32000,
        originalPrice: 36000,
        badge: 'Trending Drop',
        badgeColor: 'rust',
        image: '/images/watches/citizen-tsuyosa-emerald-green.webp',
        movement: 'Miyota 8210 Automatic Calibre (42H Reserve)',
        caseSize: '40mm Integrated Lugs',
        strap: 'Curved Presidential Stainless Steel Bracelet',
        inStock: true,
        description: 'Rich emerald green sunray dial with magnified date window at 3 o\'clock, recessed 4 o\'clock crown, and seamlessly integrated presidential links.',
      },
      {
        id: 'na-5',
        name: 'Breitling Navitimer B01 Chronograph 43mm',
        brand: 'Breitling',
        category: 'Chronograph',
        price: 785000,
        originalPrice: 820000,
        badge: 'Aviation Icon',
        badgeColor: 'rust',
        image: '/images/watches/breitling/01.webp',
        movement: 'Manufacture Breitling Caliber 01 Automatic',
        caseSize: '43mm Stainless Steel',
        strap: 'Seven-Row Stainless Steel Navitimer Bracelet',
        inStock: true,
        description: 'Iconic circular slide rule bezel with column-wheel chronograph movement, contrasting sub-dials, and sapphire crystal exhibition caseback.',
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
        image: '/images/watches/fossil-heritage-automatic.webp',
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
        name: 'Rado Captain Cook High-Tech Ceramic Diver 300m',
        brand: 'Rado',
        category: 'Luxury Swiss',
        price: 345000,
        originalPrice: 380000,
        badge: 'Swiss Ceramic',
        badgeColor: 'forest',
        image: '/images/watches/rado-captain-cook-ceramic.webp',
        movement: 'Rado Calibre R763 Automatic (80H Power Reserve)',
        caseSize: '43mm Matte Plasma High-Tech Ceramic',
        strap: 'High-Tech Ceramic Bracelet with Titanium Clasp',
        inStock: true,
        description: 'Pioneering plasma high-tech ceramic monobloc case with tinted black sapphire crystal dial, Nivachron antimagnetic hairspring, and ISO 6425 diving certification.',
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
        image: '/images/watches/omega-speedmaster-moonwatch.webp',
        movement: 'Omega Co-Axial Master Chronometer 3861',
        caseSize: '42mm Asymmetrical Steel',
        strap: 'Brushed 5-Arched-Links-per-Row Steel',
        inStock: true,
        description: 'The flight-qualified watch worn on all six lunar missions. Matte step dial with dot-over-ninety anodised aluminium bezel.',
      },
      {
        id: 'cc-3',
        name: 'Titan Edge Ceramic Slimmest Quartz',
        brand: 'Titan',
        category: 'Dress',
        price: 29995,
        originalPrice: 34995,
        badge: 'Slimmest Ceramic',
        badgeColor: 'brass',
        image: '/images/watches/titan/01.webp',
        movement: 'In-House Titan T9081 Slim Quartz Movement',
        caseSize: '40mm Ultra-Slim Ceramic',
        strap: 'High-Tech Scratch-Resistant Ceramic Bracelet',
        inStock: true,
        description: 'World-renowned ultra-slim design engineering with full high-tech ceramic construction and sapphire glass.',
      },
      {
        id: 'cc-4',
        name: 'Seiko Presage Cocktail Time Automatic',
        brand: 'Seiko',
        category: 'Automatic',
        price: 45000,
        originalPrice: 49500,
        badge: 'Japanese Craft',
        badgeColor: 'forest',
        image: '/images/watches/seiko/01.webp',
        movement: 'Seiko 4R35 Automatic Hand-Winding Movement',
        caseSize: '40.5mm Stainless Steel',
        strap: 'Polished Multi-Link Stainless Steel Bracelet',
        inStock: true,
        description: 'Deep sunburst radial pattern dial inspired by vintage cocktail bars with box-shaped Hardlex crystal and exhibition caseback.',
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
        image: '/images/watches/breitling-navitimer-b01-chronograph.webp',
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
        image: '/images/watches/tissot-prx-powermatic-80.webp',
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
        image: '/images/watches/seiko-presage-cocktail-time.webp',
        movement: 'Seiko 4R35 Mechanical Automatic',
        caseSize: '40.5mm Polished Steel',
        strap: 'Multi-Link Fine Stainless Steel Bracelet',
        inStock: true,
        description: 'Radial guilloché dial with blued leaf hands, date complication at 3 o\'clock, and exhibition caseback displaying the decorated Japanese movement.',
      },
      {
        id: 'icon-3',
        name: 'Breitling Top Time B01 Triumph Chronograph',
        brand: 'Breitling',
        category: 'Chronograph',
        price: 645000,
        originalPrice: 695000,
        badge: 'Racing Heritage',
        badgeColor: 'brass',
        image: '/images/watches/breitling-top-time-b01-chronograph.webp',
        movement: 'Breitling Manufacture Calibre 01 Automatic (COSC)',
        caseSize: '41mm Polished Steel',
        strap: 'Perforated Black Racing Calfskin Strap',
        inStock: true,
        description: 'Vintage 1960s café-racer heritage chronograph featuring an ice-blue bow-tie "Zorro" dial, contrasting black squircle subdials, and in-house COSC B01 calibre.',
      },
      {
        id: 'icon-4',
        name: 'Tissot Seastar 2000 Professional Powermatic 80',
        brand: 'Tissot',
        category: 'Luxury Swiss',
        price: 98000,
        originalPrice: 108000,
        badge: 'Professional Diver',
        badgeColor: 'charcoal',
        image: '/images/watches/tissot-seastar-2000-diver.webp',
        movement: 'Swiss Powermatic 80 Automatic (80-Hour Reserve)',
        caseSize: '46mm 316L Stainless Steel',
        strap: 'Solid Stainless Steel Diver Bracelet with Extension',
        inStock: true,
        description: 'ISO 6425 certified professional diver with helium escape valve, wave motif gradient dial, ceramic bezel, and 600m water resistance.',
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
        image: '/images/watches/fossil-neutra-chronograph.webp',
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
        name: 'Citizen Tsuyosa Automatic Canary Yellow 40mm',
        brand: 'Citizen Automatics',
        category: 'Automatic',
        price: 29995,
        originalPrice: 36000,
        badge: '20% OFF FLASH',
        badgeColor: 'rust',
        image: '/images/watches/citizen-tsuyosa-canary-yellow.webp',
        movement: 'Miyota 8210 Automatic Calibre (42H Reserve)',
        caseSize: '40mm Integrated Lugs',
        strap: 'Presidential Curved Steel Bracelet',
        inStock: true,
        description: 'Flash Deal: Vibrant canary yellow sunray dial with cyclops date magnifier and integrated presidential bracelet at 20% off.',
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
        image: '/images/watches/seiko-presage-cocktail-time.webp',
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
        image: '/images/watches/fossil-heritage-automatic.webp',
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
        image: '/images/watches/fossil-townsman-automatic.webp',
        movement: 'Precision Multi-Function Chronograph',
        caseSize: '44mm',
        strap: 'Luggage Brown Saddle Leather',
        inStock: true,
        description: 'Flash Deal: Amber sunburst chronograph with Roman numeral markers and supple saddle leather.',
      },
    ],

    indianIcons: [
      {
        id: 'titan-01-edge-ultra-slim',
        name: 'Titan Edge Ultra-Slim (1696SL02)',
        brand: 'Titan',
        category: 'Dress',
        badge: 'Ultra-Slim Flagship',
        badgeColor: 'brass',
        image: '/images/watches/titan/01.webp',
        movement: 'Ultra-Slim Quartz',
        caseSize: '40mm Ceramic Composite',
        strap: 'Slim Leather Strap',
        inStock: true,
        description: "World's slimmest design philosophy targeting elite corporate professionals.",
      },
      {
        id: 'titan-02-neo-splash',
        name: 'Titan Neo Splash (1805QM01)',
        brand: 'Titan',
        category: 'Sport',
        badge: 'Sport Edition',
        badgeColor: 'rust',
        image: '/images/watches/titan/02.webp',
        movement: 'Quartz',
        caseSize: '42mm Stainless Steel',
        strap: 'Stainless Steel Bracelet',
        inStock: true,
        description: "Rugged yet sleek styling crafted for casual weekend adventures.",
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
        image: '/images/watches/hmt-kohinoor-mechanical.webp',
        movement: 'HMT Calibre 0231 17-Jewel Hand-Wound Mechanical',
        caseSize: '36mm Vintage Polished Steel',
        strap: 'Vintage 18mm Stainless Steel Fold-Over Bracelet',
        inStock: true,
        description: 'The historic pride of Indian horology since 1961. Hand-wound 17-jewel movement with audible mechanical sweep, polished steel case, and sunburst dial.',
      },
      {
        id: 'titan-04-regalia-classic',
        name: 'Titan Regalia Classic (1650SM01)',
        brand: 'Titan',
        category: 'Dress',
        badge: 'Festive Royal',
        badgeColor: 'brass',
        image: '/images/watches/titan/04.webp',
        movement: 'Quartz',
        caseSize: '41mm Stainless Steel',
        strap: 'Regal Jewelry-Inspired Link Bracelet',
        inStock: true,
        description: "Regal jewelry-inspired link bracelet design for festive occasions.",
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
        image: '/images/watches/hmt-janata-devnagari.webp',
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
        image: '/images/watches/fastrack-street-diver-chrono.webp',
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
        image: '/images/watches/sonata-poze-sunray-gold.webp',
        movement: 'Sonata Reliable Quartz Calibre',
        caseSize: '40mm Yellow Gold Tone Case',
        strap: 'Genuine Brown Crocodile-Pattern Leather Strap',
        inStock: true,
        description: 'Timeless everyday Indian elegance from the Tata family. Clean champagne sunray dial with minimalist baton markers and croc-embossed leather.',
      },
      {
        id: 'titan-08-automatics-neo',
        name: 'Titan Automatics Neo (90118SL01)',
        brand: 'Titan',
        category: 'Automatic',
        badge: 'Titan Automatic',
        badgeColor: 'forest',
        image: '/images/watches/titan/08.webp',
        movement: 'Automatic Skeleton',
        caseSize: '43mm Stainless Steel',
        strap: 'Embossed Leather Strap',
        inStock: true,
        description: "Exhibition open-heart mechanical movement at an accessible price point.",
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
      image: '/images/watches/titan-octane-chronograph.webp',
      filterKey: 'Indian Brands',
    },
    {
      id: 'cat-swiss',
      title: 'Swiss Luxury & Automatics',
      subtitle: 'Omega, Tissot, Rado & Breitling',
      itemCount: '38 Timepieces',
      tag: 'Swiss Certified',
      image: '/images/categories/swiss-luxury.webp',
      filterKey: 'Automatic',
    },
    {
      id: 'cat-japanese',
      title: 'Japanese Presage & Automatics',
      subtitle: 'Seiko Presage, Prospex & Citizen Tsuyosa',
      itemCount: '29 Timepieces',
      tag: 'In-House Calibers',
      image: '/images/watches/seiko-presage-cocktail-time.webp',
      filterKey: 'Automatic',
    },
    {
      id: 'cat-chronos',
      title: 'Racing Chronographs & Aviators',
      subtitle: 'Breitling Navitimer, Omega Moonwatch & Tissot',
      itemCount: '24 Chronographs',
      tag: 'Split-Second Precision',
      image: '/images/categories/sport-chronographs.webp',
      filterKey: 'Chronograph',
    },
    {
      id: 'cat-skeletons',
      title: 'Heritage Skeletons & Exhibition',
      subtitle: 'Fossil Heritage, Open Heart & 21-Jewel Automatics',
      itemCount: '19 Open-Heart Pieces',
      tag: 'Exhibition Glass',
      image: '/images/categories/skeleton-openheart.webp',
      filterKey: 'Skeleton',
    },
  ],

  // 6. BACKGROUND WATCH ADVERTISEMENT SHOWCASE (SIGNATURE EDITORIAL)
  editorialAd: {
    badge: 'SWISS HOROLOGY MASTERPIECE • GORAKHPUR FLAGSHIPS',
    title: 'The Heritage of Swiss Master Chronometer Precision',
    quote: '“A fine mechanical watch doesn’t just count hours. It preserves generations of precision engineering and personal triumphs.”',
    description: 'Ram Prasad Agencies is Eastern UP\'s authorized destination for world-renowned horological houses. Every timepiece across our Baldev Plaza and JalKal Building showrooms is 100% authentic, accompanied by official international stamped warranty cards, tamper-proof serial numbers, and lifetime battery and ultrasonic bracelet sizing support.',
    caliber: 'Omega Co-Axial Master Chronometer Calibre 3861 (50-Hour Reserve)',
    material: '316L Stainless Steel with Hesalite & Sapphire Crystal',
    strapLeather: 'Brushed Five-Arched-Links-per-Row Stainless Steel Bracelet',
    glass: 'Domed Scratch-Resistant Sapphire Crystal with Anti-Reflective Treatment',
    waterResistance: '50 Meters / 167 Feet Water Resistance',
    image: '/images/editorial-baldev-flagship.webp',
    price: 690000,
  },

  // 6B. THE MAISON PORTFOLIO BRANDS
  brands: [
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
  },
};

export const DEFAULT_INQUIRY_FORM_CONFIG = DEFAULT_VINTAGE_STORE_DATA.inquiryFormConfig;

const BRAND_VERIFIED_WATCH_IMAGE = {
  titan: '/images/watches/titan/01.webp',
  hmt: '/images/watches/hmt/01.webp',
  fastrack: '/images/watches/fastrack-street-diver-chrono.webp',
  sonata: '/images/watches/sonata-poze-sunray-gold.webp',
  tissot: '/images/watches/tissot/01.webp',
  omega: '/images/watches/omega/01.webp',
  seiko: '/images/watches/seiko/01.webp',
  citizen: '/images/watches/citizen-tsuyosa-emerald-green.webp',
  fossil: '/images/watches/fossil-heritage-automatic.webp',
  breitling: '/images/watches/breitling/01.webp',
  rado: '/images/watches/rado/01.webp',
  'titan raga': '/images/watches/titan-raga/01.webp',
  raga: '/images/watches/titan-raga/01.webp',
};

// Check if an image URL is a known non-watch offender (makeup, shoe, bag, coffee, etc.)
export const isOffenderImage = (url) => {
  if (!url || typeof url !== 'string') return true;
  return (
    url.toLowerCase().includes('rolex') ||
    url.includes('photo-1587925358603') || // Rolex Daytona close up dial
    url.includes('photo-1670404160620-a3a86428560e') ||
    url.includes('photo-1620625515032-6ed0c1790c75') ||
    url.includes('photo-1639006570490-79c0c53f1080') ||
    url.includes('photo-1526045431048-f857369baa09') ||
    url.includes('photo-1522335789203') || // Makeup & cosmetics palette
    url.includes('photo-1539185441755') || // Sneaker shoe
    url.includes('photo-1543163521') ||    // Shoes & footwear
    url.includes('photo-1548036328') ||    // Handbag
    url.includes('photo-1509042239860') || // Coffee cups
    url.includes('photo-1508615039623') || // Blank sunset sky
    url.includes('photo-1526045612212') || // Person on smartphone
    url.includes('photo-1547996160') ||    // 404 broken image
    url.includes('photo-1523275335684')    // Generic white plastic 3D mockup
  );
};

export const getVerifiedBrandImage = (brand, fallback) => {
  if (!brand) return fallback;
  const brandLower = brand.toLowerCase();
  for (const [key, verifiedUrl] of Object.entries(BRAND_VERIFIED_WATCH_IMAGE)) {
    if (brandLower.includes(key)) return verifiedUrl;
  }
  return fallback;
};

// Helper to safely merge saved data with complete defaults
export const sanitizeStoreData = (data) => {
  if (!data || typeof data !== 'object') return DEFAULT_VINTAGE_STORE_DATA;
  const rawTagline = data.tagline;
  let cleanTagline = (!rawTagline || rawTagline.includes('Authorized & Imported') || rawTagline.includes('Vintage Horology') || rawTagline.includes('TheWatchStore.in'))
    ? DEFAULT_VINTAGE_STORE_DATA.tagline
    : rawTagline;
  if (cleanTagline.toLowerCase().includes('ramprasadwatchstore')) {
    cleanTagline = 'WATCHSTORE.IN';
  }

  const serialized = JSON.stringify(data);
  const hasOffenders = isOffenderImage(serialized);
  const hasUnsplash = serialized.includes('unsplash.com');
  const isOldVersion = !data.version || data.version !== '7.0.0';
  const shouldResetImagery = hasOffenders || hasUnsplash || isOldVersion || serialized.toLowerCase().includes('rolex') || serialized.includes('1587925358603');

  const sanitizeWatchList = (list, defaultList) => {
    if (shouldResetImagery || !list || !Array.isArray(list) || list.length === 0) {
      return defaultList;
    }
    const cleanList = list.filter((w) => {
      const b = (w?.brand || '').toLowerCase();
      const n = (w?.name || '').toLowerCase();
      return b !== 'rolex' && !n.includes('rolex');
    });
    return cleanList.map((w) => {
      if (isOffenderImage(w.image)) {
        return { ...w, image: getVerifiedBrandImage(w.brand, defaultList[0]?.image || DEFAULT_VINTAGE_STORE_DATA.hero.slides[0].image) };
      }
      return w;
    });
  };

  const sanitized = {
    ...DEFAULT_VINTAGE_STORE_DATA,
    ...data,
    certificateImage: data.certificateImage
      ? String(data.certificateImage).replace(/\.jpg$/i, '.webp')
      : '/images/about/heritage-certificate.webp',
    version: '6.7.0',
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
      slides: shouldResetImagery
        ? DEFAULT_VINTAGE_STORE_DATA.hero.slides
        : (data.hero?.slides && Array.isArray(data.hero.slides) && data.hero.slides.length > 0
          ? data.hero.slides.map((s, idx) => {
              if (s.id === 'hero-6' || s.headline?.toLowerCase().includes('fastrack')) {
                return { ...s, image: '/images/fastrack-banner.webp' };
              }
              if (s.id === 'hero-5' || s.headline?.toLowerCase().includes('hmt')) {
                return { ...s, image: '/images/hero-hmt-kohinoor-vintage.webp' };
              }
              if (s.id === 'hero-2' || s.headline?.toLowerCase().includes('omega')) {
                return { ...s, image: '/images/hero-omega-showcase.webp' };
              }
              return isOffenderImage(s.image)
                ? (DEFAULT_VINTAGE_STORE_DATA.hero.slides[idx]?.image || DEFAULT_VINTAGE_STORE_DATA.hero.slides[0].image)
                : s;
            })
          : DEFAULT_VINTAGE_STORE_DATA.hero.slides),
    },
    carousels: {
      ...DEFAULT_VINTAGE_STORE_DATA.carousels,
      newArrivals: sanitizeWatchList(data.carousels?.newArrivals, DEFAULT_VINTAGE_STORE_DATA.carousels.newArrivals),
      collectorCapsule: sanitizeWatchList(data.carousels?.collectorCapsule, DEFAULT_VINTAGE_STORE_DATA.carousels.collectorCapsule),
      ourIcons: sanitizeWatchList(data.carousels?.ourIcons, DEFAULT_VINTAGE_STORE_DATA.carousels.ourIcons),
      flashDeals: sanitizeWatchList(data.carousels?.flashDeals, DEFAULT_VINTAGE_STORE_DATA.carousels.flashDeals),
      indianIcons: sanitizeWatchList(data.carousels?.indianIcons, DEFAULT_VINTAGE_STORE_DATA.carousels.indianIcons),
    },
    categories: shouldResetImagery || !data.categories || !Array.isArray(data.categories) || data.categories.length === 0
      ? DEFAULT_VINTAGE_STORE_DATA.categories
      : data.categories.map((c, idx) => (isOffenderImage(c.image) ? DEFAULT_VINTAGE_STORE_DATA.categories[idx] || c : c)),
    editorialAd: shouldResetImagery || isOffenderImage(data.editorialAd?.image)
      ? DEFAULT_VINTAGE_STORE_DATA.editorialAd
      : {
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
    brands: (() => {
      if (data.brands && Array.isArray(data.brands) && data.brands.length > 0) {
        const valid = data.brands.filter((b) => {
          const name = (typeof b === 'string' ? b : b?.name || '').toLowerCase().trim();
          return name && name !== 'rolex';
        });
        if (valid.length > 0) return valid;
      }
      return DEFAULT_VINTAGE_STORE_DATA.brands;
    })(),
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

  // If we cleaned any offender imagery or updated version, persist sanitized data
  try {
    if (typeof window !== 'undefined' && shouldResetImagery) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sanitized));
    }
  } catch {
    // ignore storage quota errors
  }

  return sanitized;
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
  const [liveWatches, setLiveWatches] = useState([]);
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

        if (backendWatches && Array.isArray(backendWatches) && backendWatches.length > 0) {
          setLiveWatches(backendWatches);
        }

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
            const dynamicBrands = settings.brands || settings.vintageStoreData?.brands;
            if (dynamicBrands && Array.isArray(dynamicBrands) && dynamicBrands.length > 0) {
              const valid = dynamicBrands.filter((b) => {
                const name = (typeof b === 'string' ? b : b?.name || '').toLowerCase().trim();
                return name && name !== 'rolex';
              });
              if (valid.length > 0) {
                merged.brands = valid;
              }
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
            if (settings.certificateImage) {
              merged.certificateImage = String(settings.certificateImage).replace(/\.jpg$/i, '.webp');
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
            image: '/images/watches/tissot-prx-powermatic-80.webp',
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
        image: '/images/watches/default-watch.webp',
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
    liveWatches,
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
