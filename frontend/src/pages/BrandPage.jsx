import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  MapPin,
  MessageCircle,
  Search,
  Filter,
  SlidersHorizontal,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
  X,
  Tag,
  Zap,
  Flame,
} from 'lucide-react';
import WatchCard from '../components/WatchCard';
import { FALLBACK_WATCHES, getWatchGender } from '../data/fallbackWatches';
import { getBrandReferenceImage } from '../components/BrandMarquee';
import { getWhatsAppLink, getStoredCustomerProfile } from '../utils/api';
import { useStore } from '../context/StoreContext';

const BRAND_METADATA = {
  titan: {
    name: 'Titan',
    country: 'India',
    tagline: 'Edge, Octane & Regalia Flagships',
    history:
      'Pioneering contemporary Indian horology since 1984 under the Tata Group, renowned for the world-renowned ultra-slim Edge calibers, Octane chronographs, and Regal luxury series.',
    showrooms: 'Baldev Plaza & JalKal Building, Golghar',
  },
  hmt: {
    name: 'HMT',
    country: 'India',
    tagline: 'Kohinoor, Pilot & Janata Mechanical Heritage',
    history:
      'The timekeeper to the nation since 1961. Legendary manual-wind 17-jewel mechanical movements, Devnagari dials, and military aviation classics.',
    showrooms: 'Baldev Plaza Flagship Showroom, Golghar',
  },
  fastrack: {
    name: 'Fastrack',
    country: 'India',
    tagline: 'Youth Sport & Street Chronographs',
    history:
      "India's vibrant youth lifestyle icon since 1998, known for edgy angular cases, bold sports chronos, and unapologetic street fashion styling.",
    showrooms: 'Shop No. 1, JalKal Building, Golghar',
  },
  sonata: {
    name: 'Sonata',
    country: 'India',
    tagline: 'Everyday Reliable Indian Horology',
    history:
      'India’s largest selling watch brand from the house of Tata, delivering trusted everyday reliability, festive wedding timepieces, and enduring value.',
    showrooms: 'Baldev Plaza & JalKal Building, Golghar',
  },
  tissot: {
    name: 'Tissot',
    country: 'Swiss',
    tagline: 'PRX & Heritage Swiss Precision',
    history:
      'Swiss watchmaker founded in Le Locle in 1853, globally celebrated for the Powermatic 80 movements, iconic PRX integrated bracelets, and sports timing accuracy.',
    showrooms: 'Baldev Plaza Flagship Showroom, Golghar',
  },
  omega: {
    name: 'Omega',
    country: 'Swiss',
    tagline: 'Moonwatch & Co-Axial Chronometers',
    history:
      'Historic Swiss watchmaker founded in 1848, the official watch of NASA space exploration, Olympic timekeeping, and Master Chronometer antimagnetic excellence.',
    showrooms: 'Baldev Plaza Flagship Showroom, Golghar',
  },
  seiko: {
    name: 'Seiko',
    country: 'Japan',
    tagline: 'Automatic & Presage Craft',
    history:
      'Japanese master watchmaker since 1881, world-renowned for mechanical Presage enamel and cocktail dials, durable Seiko 5 sports calibers, and Spring Drive innovation.',
    showrooms: 'Baldev Plaza & JalKal Building, Golghar',
  },
  citizen: {
    name: 'Citizen',
    country: 'Japan',
    tagline: 'Tsuyosa & Eco-Drive Calibers',
    history:
      'Pioneers of light-powered Eco-Drive technology that never requires battery replacement, alongside the viral Tsuyosa integrated automatic sports series.',
    showrooms: 'Baldev Plaza & JalKal Building, Golghar',
  },
  breitling: {
    name: 'Breitling',
    country: 'Swiss',
    tagline: 'Navitimer Aviation Chronographs',
    history:
      'Founded in 1884, the premier specialist in pilot instruments, circular slide rule bezels, and COSC-certified in-house automatic chronographs.',
    showrooms: 'Baldev Plaza Flagship Showroom, Golghar',
  },
  rado: {
    name: 'Rado',
    country: 'Swiss',
    tagline: 'Master of High-Tech Ceramic',
    history:
      'Swiss horological innovator famous as the "Master of Materials" for pioneering scratchproof high-tech ceramic, monobloc cases, and minimalist design.',
    showrooms: 'Baldev Plaza Flagship Showroom, Golghar',
  },
  fossil: {
    name: 'Fossil',
    country: 'USA',
    tagline: 'Heritage Automatics & Vintage Styling',
    history:
      'American vintage design since 1984, celebrating mid-century automotive aesthetics, skeleton automatics, and rich vegetable-tanned leather straps.',
    showrooms: 'Shop No. 1, JalKal Building, Golghar',
  },
  'titan-raga': {
    name: 'Titan Raga',
    country: 'India',
    tagline: 'Sensual Elegance & Fine Jewelry Horology',
    history:
      'Designed for the modern Indian woman, Titan Raga transforms timepieces into exquisite wearable jewelry. Featuring mother-of-pearl dials, faceted mineral crystals, rose gold PVD finishes, and delicate asymmetric link bracelets inspired by nature and Indian couture.',
    showrooms: 'Baldev Plaza & JalKal Building, Golghar',
  },
  'titan raga': {
    name: 'Titan Raga',
    country: 'India',
    tagline: 'Sensual Elegance & Fine Jewelry Horology',
    history:
      'Designed for the modern Indian woman, Titan Raga transforms timepieces into exquisite wearable jewelry. Featuring mother-of-pearl dials, faceted mineral crystals, rose gold PVD finishes, and delicate asymmetric link bracelets inspired by nature and Indian couture.',
    showrooms: 'Baldev Plaza & JalKal Building, Golghar',
  },
  raga: {
    name: 'Titan Raga',
    country: 'India',
    tagline: 'Sensual Elegance & Fine Jewelry Horology',
    history:
      'Designed for the modern Indian woman, Titan Raga transforms timepieces into exquisite wearable jewelry. Featuring mother-of-pearl dials, faceted mineral crystals, rose gold PVD finishes, and delicate asymmetric link bracelets inspired by nature and Indian couture.',
    showrooms: 'Baldev Plaza & JalKal Building, Golghar',
  },
};

// Curated Big Banner Campaign Advertisements per Brand
const BRAND_CAMPAIGN_ADS = {
  rado: [
    {
      id: 'rado-ad-1',
      badge: 'SWISS CERAMIC MASTERPIECE',
      headline: 'Rado Captain Cook High-Tech Ceramic Diver',
      subheadline: 'The Master of Materials • 80-Hour Nivachron Power Reserve',
      description: 'Scratchproof plasma high-tech monobloc ceramic case with tinted black sapphire dial revealing the skeleton Swiss automatic movement. Engineered for extreme longevity and wrist prestige.',
      specs: ['Plasma High-Tech Ceramic', '80-Hour Reserve', '300M Water Resistance', 'Anti-Magnetic Nivachron'],
      image: '/images/watches/rado/01.webp',
      storeAvailability: 'Baldev Plaza Flagship Showroom, Golghar',
    },
    {
      id: 'rado-ad-2',
      badge: 'AVANT-GARDE GEOMETRY',
      headline: 'Rado True Square Open Heart Automatic',
      subheadline: 'Pioneering Monobloc Square Ceramic Craftsmanship',
      description: 'Smooth injection-molded black high-tech ceramic case with cut-out skeleton dial displaying exquisite Swiss horological mechanical balance and Côtes de Genève finishing.',
      specs: ['Square Monobloc Ceramic', 'Skeleton Balance Wheel', 'Sapphire Crystal Caseback', 'Gorakhpur Certified Stock'],
      image: '/images/watches/rado/02.webp',
      storeAvailability: 'Baldev Plaza Flagship Showroom, Golghar',
    },
    {
      id: 'rado-ad-3',
      badge: 'TIMELESS LUXURY HOROLOGY',
      headline: 'Rado Centrix Automatic Diamonds',
      subheadline: 'Pure Liquid Metal & Curved Sapphire Glass',
      description: 'Conical bracelet silhouette blending tapered high-tech ceramic links with warm gold PVD and Top Wesselton genuine diamond hour markers.',
      specs: ['Top Wesselton Diamonds', 'High-Tech Ceramic Links', 'Curved Sapphire Crystal', 'Instant Showroom Fitting'],
      image: '/images/watches/rado/03.webp',
      storeAvailability: 'Baldev Plaza Flagship Showroom, Golghar',
    },
  ],
  tissot: [
    {
      id: 'tissot-ad-1',
      badge: 'SWISS ICON • EST. 1853',
      headline: 'Tissot PRX Powermatic 80',
      subheadline: 'Integrated 1978 Retro-Futuristic Geometry',
      description: 'Embossed waffle dial, satin-finished integrated bracelet, and an 80-hour Nivachron Swiss movement that sets the global benchmark for modern luxury value.',
      specs: ['Powermatic 80 Calibre', 'Nivachron Balance Spring', '100M Water Resistant', 'Baldev Plaza Flagship'],
      image: '/images/watches/tissot/01.webp',
      storeAvailability: 'Baldev Plaza Flagship Showroom, Golghar',
    },
    {
      id: 'tissot-ad-2',
      badge: 'DEEP SEA DIVER 2000',
      headline: 'Tissot Seastar 2000 Professional',
      subheadline: 'ISO 6425 Certified 600M Helium Valve Diver',
      description: 'Graduated ceramic dive bezel, wave-pattern sapphire dial, and automatic helium escape valve for extreme underwater exploration and wrist presence.',
      specs: ['600M / 2000FT Rating', 'Unidirectional Ceramic', 'Helium Escape Valve', 'Certified Showroom Stock'],
      image: '/images/watches/tissot/13.webp',
      storeAvailability: 'Baldev Plaza Flagship Showroom, Golghar',
    },
  ],
  seiko: [
    {
      id: 'seiko-ad-1',
      badge: 'JAPANESE ARTISAN GUILLOCHÉ',
      headline: 'Seiko Presage Cocktail Time Automatic',
      subheadline: 'Inspired by Tokyo Glamour & Radial Enamel dials',
      description: 'Deep sunburst radial guilloché dials with 7 layers of clear lacquer finish. Hand-assembled Japanese 4R35 automatic movement with exhibition caseback.',
      specs: ['Calibre 4R35 Automatic', 'Radial Lacquer Dial', 'Box-Shaped Hardlex', 'Baldev Plaza Showroom'],
      image: '/images/watches/seiko/03.webp',
      storeAvailability: 'Baldev Plaza & JalKal Building, Golghar',
    },
    {
      id: 'seiko-ad-2',
      badge: 'SOLAR PRECISION CHRONO',
      headline: 'Seiko Prospex Speedtimer 1969',
      subheadline: 'Tachymeter Bezel & 6-Month Solar Power Reserve',
      description: 'Sand-textured dial with high-contrast dual sub-dials. Powered by any light source, keeping 1/5th second chronograph accuracy with zero battery changes.',
      specs: ['Solar Chronograph V192', 'Curved Sapphire Crystal', 'Tachymeter Scale', 'Gorakhpur Authorized Stock'],
      image: '/images/watches/seiko/07.webp',
      storeAvailability: 'Baldev Plaza Flagship Showroom, Golghar',
    },
  ],
  titan: [
    {
      id: 'titan-ad-1',
      badge: 'FEATHERWEIGHT CERAMIC',
      headline: 'Titan Edge Ceramic Ultra-Slim',
      subheadline: 'World’s Slimmest Ceramic Horology at 4.4mm',
      description: 'Pioneered by Titan India with aerospace-grade scratchproof ceramic and high-purity sapphire glass. Ultra-light, whisper-quiet wrist luxury.',
      specs: ['4.4mm Ceramic Case', 'In-House Edge Calibre', 'Pure Sapphire Crystal', 'Both Gorakhpur Showrooms'],
      image: '/images/brands/titan.webp',
      storeAvailability: 'Baldev Plaza & JalKal Building, Golghar',
    },
    {
      id: 'titan-ad-2',
      badge: 'RACING CHRONOGRAPHS',
      headline: 'Titan Octane Sports Chronometer',
      subheadline: 'Multi-Dial Dual Timezone Tachymeter',
      description: 'Precision chronograph sub-dials with sculpted knurled pushers and 100M water resistance for dynamic performance.',
      specs: ['100M Water Resistant', 'Precision Chronograph', 'Tachymeter Bezel', 'JalKal Building Boutique'],
      image: '/images/brand-ad-titan.webp',
      storeAvailability: 'Shop No. 1, JalKal Building, Golghar',
    },
  ],
  'titan-raga': [
    {
      id: 'raga-ad-1',
      badge: 'FINE JEWELRY HOROLOGY',
      headline: 'Titan Raga Aurora Asymmetrical Crystal',
      subheadline: 'Handcrafted Crystals & Sensual Fluidity',
      description: 'Curved mother-of-pearl dial with Swarovski crystal pavé accents and organic asymmetric bracelet designed for Indian festive couture.',
      specs: ['Faceted Crystal Accent', 'Mother-of-Pearl Dial', 'Rose Gold PVD Finish', 'Baldev Plaza Showroom'],
      image: '/images/brands/raga.webp',
      storeAvailability: 'Baldev Plaza & JalKal Building, Golghar',
    },
  ],
  hmt: [
    {
      id: 'hmt-ad-1',
      badge: 'TIMEKEEPERS TO THE NATION • EST. 1961',
      headline: 'HMT Janata Mechanical Heritage',
      subheadline: 'The Historic Indian Hand-Wound Mechanical Masterpiece',
      description: 'Manufactured with legendary 17-jewel mechanical movements. The authentic timepiece worn across generations of Indian leaders, civil servants, and horological visionaries.',
      specs: ['17-Jewel Hand-Wound', 'Classic Enamel Dial', 'In-House Calibre 0231', 'Baldev Plaza Flagship'],
      image: '/images/watches/hmt/01.webp',
      storeAvailability: 'Baldev Plaza & JalKal Building, Golghar',
    },
    {
      id: 'hmt-ad-2',
      badge: 'MILITARY AVIATION LEGEND',
      headline: 'HMT Pilot Mechanical 35mm',
      subheadline: 'High-Contrast Luminescent Arabic Numerals',
      description: 'The historic Indian Air Force aviation watch with audible mechanical sweep, rugged stainless steel case, and timeless vintage utilitarian presence.',
      specs: ['Military Heritage', 'Luminous Hands & Markers', 'Mechanical Calibre', 'Certified Showroom Stock'],
      image: '/images/watches/hmt/04.webp',
      storeAvailability: 'Baldev Plaza Flagship Showroom, Golghar',
    },
  ],
  omega: [
    {
      id: 'omega-ad-1',
      badge: 'THE FIRST WATCH ON THE MOON',
      headline: 'Omega Speedmaster Professional Moonwatch',
      subheadline: 'Co-Axial Master Chronometer Calibre 3861',
      description: 'The historic chronograph worn by Apollo 11 astronauts. Certified by METAS for 15,000 gauss antimagnetic resistance and legendary chronograph sweep.',
      specs: ['METAS Master Chronometer', 'Calibre 3861 Manual', 'Hesalite / Sapphire Glass', 'Gorakhpur Import Showcase'],
      image: '/images/watches/omega/01.webp',
      storeAvailability: 'Baldev Plaza Flagship Showroom, Golghar',
    },
    {
      id: 'omega-ad-2',
      badge: 'CO-AXIAL OCEAN DIVER',
      headline: 'Omega Seamaster Diver 300M',
      subheadline: 'Laser-Engraved Wave Dial & Ceramic Bezel',
      description: 'The legendary James Bond timepiece featuring polished ceramic dial with laser-engraved waves, helium escape valve, and 300M diving integrity.',
      specs: ['Master Chronometer 8800', 'Laser Wave Dial', 'Helium Escape Valve', 'Direct Maison Warranty'],
      image: '/images/watches/omega/02.webp',
      storeAvailability: 'Baldev Plaza Flagship Showroom, Golghar',
    },
  ],
  breitling: [
    {
      id: 'breitling-ad-1',
      badge: 'AVIATION ICON • EST. 1884',
      headline: 'Breitling Navitimer B01 Chronograph 43',
      subheadline: 'The Legendary Pilot’s Instrument • In-House Calibre 01',
      description: 'The world’s most iconic pilot chronograph with circular aeronautical slide rule bezel, reverse panda dial, and COSC-certified Breitling 01 manufacture movement.',
      specs: ['Breitling 01 Manufacture', 'Slide-Rule Bezel', 'COSC Chronometer', 'Baldev Plaza Flagship'],
      image: '/images/watches/breitling/01.webp',
      storeAvailability: 'Baldev Plaza Flagship Showroom, Golghar',
    },
    {
      id: 'breitling-ad-2',
      badge: 'DEEP SEA PERFORMANCE',
      headline: 'Breitling Superocean Automatic 44 Diver',
      subheadline: 'Turquoise Blue Dial & 1000M Diving Integrity',
      description: 'Bold square-tipped diving hands, high-contrast chapter ring, and scratchproof ceramic bezel engineered for aquatic adventures and modern luxury versatility.',
      specs: ['1000M Water Resistant', 'Ceramic Dive Bezel', 'COSC Automatic', 'Gorakhpur Authorized Stock'],
      image: '/images/watches/breitling/05.webp',
      storeAvailability: 'Baldev Plaza Flagship Showroom, Golghar',
    },
  ],
};

// Retrieve or generate high-impact campaign ads for any brand
const getBrandCampaignAds = (slug, meta, brandImage) => {
  const clean = (slug || '').toLowerCase().trim();
  if (BRAND_CAMPAIGN_ADS[clean]) return BRAND_CAMPAIGN_ADS[clean];
  for (const [k, ads] of Object.entries(BRAND_CAMPAIGN_ADS)) {
    if (clean.includes(k) || k.includes(clean)) return ads;
  }
  return [
    {
      id: `${clean}-ad-1`,
      badge: `${(meta.country || 'GLOBAL').toUpperCase()} HOROLOGY • SPECIAL SHOWROOM DROP`,
      headline: `${meta.name} Flagship Exhibition`,
      subheadline: meta.tagline || 'Masterpiece Collection Available in Gorakhpur',
      description: meta.history || 'Exclusive luxury timepiece collection available at Ram Prasad Agencies, Gorakhpur.',
      specs: ['100% Genuine Certified Stock', 'Official Maison Warranty', 'Baldev Plaza Flagship', 'Gorakhpur Showrooms'],
      image: brandImage || '/images/brands/default.webp',
      storeAvailability: meta.showrooms || 'Baldev Plaza & JalKal Building, Golghar',
    },
    {
      id: `${clean}-ad-2`,
      badge: 'EXCLUSIVE SHOWROOM SPOTLIGHT',
      headline: `${meta.name} Signature Horology`,
      subheadline: 'Certified International Warranty & Complimentary Fitting',
      description: 'Explore authentic imported calibers with official manufacturer warranty stamped at time of acquisition in Golghar, Gorakhpur.',
      specs: ['Master Horologist Inspected', 'Precision Movement', 'Instant Showroom Fitting', 'Authentic Import'],
      image: brandImage || '/images/brands/default.webp',
      storeAvailability: meta.showrooms || 'Baldev Plaza Flagship Showroom, Golghar',
    },
  ];
};

// Strict Brand Matcher Helper: guarantees exact 20 watches per brand
const isWatchInBrand = (w, slug) => {
  if (!w) return false;
  const b = (w.brand || '').toLowerCase().trim();
  const clean = (slug || '').toLowerCase().trim();

  if (clean === 'titan') {
    // Strictly Titan (never Titan Raga)
    return b === 'titan';
  }
  if (clean === 'titan-raga' || clean === 'raga' || clean === 'titan raga') {
    return b === 'titan raga' || b === 'raga';
  }
  return b === clean || b.replace(/\s+/g, '-') === clean;
};

// Curated festive & showroom discount privileges per brand
const getBrandDiscountBadge = (cleanSlug, idx) => {
  const discounts = {
    omega: ['UP TO 15% FESTIVE PRIVILEGE', 'COMPLIMENTARY 5-YEAR WARRANTY', 'ZERO-COST EMI AVAILABLE'],
    rado: ['FLAT 15% OFF IN-STORE', 'COMPLIMENTARY ULTRASONIC SPA', 'UP TO ₹18,000 SAVINGS'],
    breitling: ['EXCLUSIVE 15% HOROLOGY BENEFIT', 'CERTIFIED CHRONOMETER PERK', 'SPECIAL SHOWROOM PRICING'],
    tissot: ['UP TO 20% OFF IN-STORE', 'ZERO-COST 6-MONTH EMI', 'SPECIAL FESTIVE SAVINGS'],
    seiko: ['FLAT 15% - 20% OFF', 'COMPLIMENTARY BRACELET SIZING', 'FESTIVE DISCOUNT ACTIVE'],
    citizen: ['UP TO 25% OFF ECO-DRIVE', 'FLAT 20% OFF IN-STORE', 'COMPLIMENTARY SPA PERK'],
    titan: ['UP TO 20% OFF EDGE & OCTANE', 'FLAT 15% OFF AT SHOWROOM', 'SPECIAL FESTIVE DROP'],
    'titan-raga': ['UP TO 25% OFF RAGA JEWELS', 'FLAT 20% FESTIVE DISCOUNT', 'SPECIAL GIFT COMBO PRIVILEGE'],
    fossil: ['FLAT 25% OFF THIS WEEK', 'UP TO 30% OFF HERITAGE SKELETONS', 'SPECIAL SHOWROOM DEAL'],
    fastrack: ['FLAT 20% OFF YOUTH CHRONOS', 'BUY 1 GET EXTRA 10% OFF', 'SPECIAL STORE DISCOUNT'],
    sonata: ['FLAT 20% OFF EVERYDAY WATCHES', 'UP TO 25% OFF IN-STORE', 'FESTIVE OFFER ACTIVE'],
    hmt: ['SPECIAL GORAKHPUR COLLECTOR DROP', 'LIFETIME POLISHING BENEFIT', 'CERTIFIED MECHANICAL HERITAGE']
  };
  const list = discounts[cleanSlug] || ['UP TO 20% OFF IN-STORE', 'SPECIAL FESTIVE DISCOUNT', 'ZERO-COST EMI AVAILABLE'];
  return list[idx % list.length];
};

export default function BrandPage({
  watches = [],
  contactPhone = '+91 98765 43210',
  onSelectWatch,
}) {
  const { brandSlug } = useParams();
  const navigate = useNavigate();
  const storeContext = useStore ? useStore() : null;
  const storeBrands = storeContext?.storeData?.brands || [];

  // Normalize slug & retrieve brand details first
  const cleanSlug = (brandSlug || '').toLowerCase().trim();

  // Look up custom brand dynamically configured by admin
  const customBrand = storeBrands.find((b) => {
    const bName = typeof b === 'string' ? b : b?.name;
    if (!bName) return false;
    const s = bName.toLowerCase().trim().replace(/\s+/g, '-');
    return s === cleanSlug || bName.toLowerCase().trim() === cleanSlug;
  });

  const meta =
    BRAND_METADATA[cleanSlug] || (customBrand ? {
      name: customBrand.name,
      country: customBrand.country || 'Global',
      tagline: customBrand.desc || customBrand.tagline || `${customBrand.name} Authorized Collection`,
      history: customBrand.story || customBrand.history || `Official collections of ${customBrand.name} available at Ram Prasad Agencies authorized showroom in Gorakhpur.`,
      showrooms: customBrand.showrooms || 'Baldev Plaza & JalKal Building, Golghar',
      image: customBrand.image || null,
    } : {
      name: (brandSlug || 'Maison').toUpperCase(),
      country: 'Global',
      tagline: 'Authorized Gorakhpur Showroom Showcase',
      history: 'Exclusive luxury timepiece collection available at Ram Prasad Agencies, Gorakhpur.',
      showrooms: 'Baldev Plaza & JalKal Building, Golghar',
    });

  const brandImage = customBrand?.image || getBrandReferenceImage(meta.name);

  // Selected gender filter: 'ALL' | 'Men' | 'Women' | 'Unisex'
  const [selectedGender, setSelectedGender] = useState('ALL');
  const [searchInBrand, setSearchInBrand] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'name'
  const [showroomFilter, setShowroomFilter] = useState('ALL'); // 'ALL' | 'Baldev Plaza' | 'JalKal'

  // Retrieve curated campaign ads for this brand
  const campaignAds = useMemo(() => {
    return getBrandCampaignAds(cleanSlug, meta, brandImage);
  }, [cleanSlug, meta, brandImage]);

  // Seamless looping items for continuous moving right-to-left strip
  const marqueeAds = useMemo(() => {
    if (!campaignAds || campaignAds.length === 0) return [];
    let list = [...campaignAds];
    while (list.length < 6) {
      list = [...list, ...campaignAds];
    }
    return [...list, ...list];
  }, [campaignAds]);

  // Scroll to top immediately and update document title
  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch { }
    const originalTitle = 'Ram Prasad Agencies | watchstore.in';
    document.title = `Ram Prasad Agencies | ${meta.name} • watchstore.in`;
    return () => {
      document.title = originalTitle;
    };
  }, [cleanSlug, meta.name]);

  // Filter watches strictly for this brand:
  const brandWatches = useMemo(() => {
    const liveList = (watches || []).filter((w) => isWatchInBrand(w, cleanSlug));
    if (liveList.length > 0) {
      return liveList;
    }
    return FALLBACK_WATCHES.filter((w) => isWatchInBrand(w, cleanSlug));
  }, [cleanSlug, watches]);

  // Gender counts within this brand
  const counts = useMemo(() => {
    let men = 0;
    let women = 0;
    let unisex = 0;
    for (const w of brandWatches) {
      const g = getWatchGender(w);
      if (g === 'Men') men++;
      else if (g === 'Women') women++;
      else if (g === 'Unisex') unisex++;
    }
    return {
      all: brandWatches.length,
      men,
      women,
      unisex,
    };
  }, [brandWatches]);

  // Filtered & sorted watches
  const displayedWatches = useMemo(() => {
    let list = [...brandWatches];

    // 1. Gender Filter
    if (selectedGender !== 'ALL') {
      list = list.filter((w) => getWatchGender(w) === selectedGender);
    }

    // 2. Showroom Filter
    if (showroomFilter !== 'ALL') {
      const sf = showroomFilter.toLowerCase();
      list = list.filter((w) => (w.storeLocation || '').toLowerCase().includes(sf));
    }

    // 3. Multi-token search query within brand
    if (searchInBrand.trim()) {
      const tokens = searchInBrand.toLowerCase().trim().split(/\s+/).filter(Boolean);
      list = list.filter((w) => {
        const name = (w.name || '').toLowerCase();
        const cat = (w.category || '').toLowerCase();
        const mov = (w.movement || '').toLowerCase();
        const desc = (w.description || '').toLowerCase();
        const strap = (w.strapType || w.strap || '').toLowerCase();
        const caseSize = (w.caseDiameter || w.caseSize || '').toLowerCase();
        const combined = `${name} ${cat} ${mov} ${desc} ${strap} ${caseSize}`;
        return tokens.every((token) => combined.includes(token));
      });
    }

    // 4. Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'name') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return list;
  }, [brandWatches, selectedGender, showroomFilter, searchInBrand, sortBy]);

  // Pre-filled WhatsApp concierge link in clean 3-paragraph format with customer details
  const profile = getStoredCustomerProfile() || {};
  const customerName = profile.name?.trim() || '[Your Name]';
  const customerPhone = profile.phone?.trim() || '[Your Phone Number]';
  const customerEmail = profile.email?.trim() || '[Your Email ID]';

  const brandWaMessage = `Hello Ram Prasad Agencies,

My name is ${customerName}. I am exploring your ${meta.name} collection (${selectedGender !== 'ALL' ? selectedGender + " Watches" : "all models"}) and would like assistance on showroom availability at Gorakhpur.

You can reach me at ${customerPhone} or ${customerEmail}. Looking forward to your guidance. Thank you!`;

  const brandWaLink = getWhatsAppLink(contactPhone, brandWaMessage);

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] text-[#1A1A1A] pb-24">
      {/* 1. Breadcrumb & Back Navigation Bar */}
      <div className="w-full bg-[#F4EFE6] border-b border-[#E5DEC9]">
        <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-3 sm:py-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-stone-600 font-medium truncate">
            <Link to="/" className="hover:text-brass-700 transition-colors">
              Home
            </Link>
            <span className="text-stone-400">/</span>
            <Link
              to={`/#brand-${cleanSlug}`}
              onClick={() => {
                try {
                  sessionStorage.setItem('rpa_last_viewed_brand', cleanSlug);
                } catch {}
              }}
              className="hover:text-brass-700 transition-colors"
            >
              Brands
            </Link>
            <span className="text-stone-400">/</span>
            <span className="font-bold text-stone-900 truncate">{meta.name}</span>
          </div>

          <button
            onClick={() => {
              try {
                sessionStorage.setItem('rpa_last_viewed_brand', cleanSlug);
              } catch {}
              navigate(`/#brand-${cleanSlug}`);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900 hover:bg-brass-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Brands</span>
          </button>
        </div>
      </div>

      {/* 2. Brand Hero Portion: Continuous Moving Campaign Strip (TOP) + Permanent Brand Heritage Overview (BELOW) */}
      <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-5 sm:pt-7 pb-4 space-y-4 sm:space-y-5">
        {/* A. BROADER, SLOW CONTINUOUS SPECIAL OFFERS & DISCOUNTS STRIP (ABOVE BRAND CARD) */}
        {marqueeAds && marqueeAds.length > 0 && (
          <div
            className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-[#FAF7F2] via-[#F4EDE1] to-[#FAF7F2] border border-[#DDD5C7] shadow-sm group/adstrip transition-all"
            aria-label="Active Brand Offers and Discounts"
          >
            {/* Subtle soft gradient fade masks on left and right for seamless loop */}
            <div className="absolute left-0 inset-y-0 w-8 sm:w-20 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 inset-y-0 w-8 sm:w-20 bg-gradient-to-l from-[#FAF7F2] via-[#FAF7F2]/80 to-transparent z-10 pointer-events-none" />

            <div className="flex items-center">
              {/* Left Pinned Luxury Emblem (Warm Champagne & Polished Brass - No Harsh Black) */}
              <div className="relative shrink-0 z-20 flex items-center bg-gradient-to-r from-[#F5EAD7] via-[#EDE0C8] to-[#E5D2B3] px-3.5 sm:px-5 py-2.5 sm:py-3.5 border-r border-[#D8C6A5] shadow-sm select-none">
                {/* Ambient Sweeping Pearlescent Glint */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover/adstrip:translate-x-full transition-transform duration-1000 pointer-events-none" />

                <div className="relative z-10 flex flex-col justify-center">
                  {/* Top Privilege Tag with Live Ruby Pulsing Dot */}
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-80" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600 shadow-2xs" />
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-mono font-extrabold tracking-widest text-[#7C5A1E] uppercase">
                      EXCLUSIVE PRIVILEGE
                    </span>
                  </div>

                  {/* Main Title with Fire Icon in Rich Horological Brass */}
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 fill-rose-600 animate-pulse" />
                    <span className="font-serif font-black text-xs sm:text-sm tracking-wider uppercase text-[#38240D]">
                      SPECIAL OFFERS
                    </span>
                  </div>
                </div>
              </div>

              {/* Continuous Moving Marquee Track (Gentle, Slower Pace Moving Right to Left) */}
              <div className="flex overflow-hidden select-none w-full">
                <div className="flex items-center gap-10 whitespace-nowrap animate-[marquee_65s_linear_infinite] group-hover/adstrip:[animation-play-state:paused] py-3 sm:py-3.5 md:py-4 cursor-default">
                  {marqueeAds.map((ad, idx) => {
                    const discount = getBrandDiscountBadge(cleanSlug, idx);
                    return (
                      <div key={idx} className="inline-flex items-center gap-3.5 shrink-0">
                        {/* High-Impact Red/Amber Discount Offer Pill */}
                        <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] sm:text-xs font-mono font-black tracking-wider uppercase shadow-xs flex items-center gap-1">
                          <Tag className="w-3 h-3 text-amber-300 fill-amber-300" />
                          <span>{discount}</span>
                        </span>

                        {/* Broader Watch Cutout Thumbnail Stage */}
                        {ad.image && (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border border-[#E5DEC9] p-1 flex items-center justify-center shrink-0 shadow-xs">
                            <img
                              src={ad.image}
                              alt=""
                              className="w-full h-full object-contain drop-shadow-xs"
                              loading="lazy"
                            />
                          </div>
                        )}

                        {/* Category Badge */}
                        <span className="px-2.5 py-1 rounded-full bg-brass-700/15 border border-brass-600/30 text-brass-900 text-[10px] sm:text-xs font-mono font-extrabold uppercase tracking-wider">
                          {ad.badge.replace(/CAMPAIGN/gi, 'SPECIAL')}
                        </span>

                        {/* Headline */}
                        <strong className="font-serif text-stone-950 font-extrabold text-sm sm:text-base">
                          {ad.headline}
                        </strong>

                        {/* Subheadline Highlight */}
                        <span className="text-stone-700 text-xs sm:text-sm font-medium hidden md:inline">
                          — {ad.subheadline}
                        </span>

                        {/* Quick WhatsApp Inquiry Pill */}
                        <a
                          href={getWhatsAppLink(
                            contactPhone,
                            `Hello Ram Prasad Agencies, I want to claim the Special Discount Offer (${discount}) for ${meta.name} "${ad.headline}". Please confirm availability at your Gorakhpur showrooms.`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer ml-1 active:scale-95"
                          title={`Claim ${discount} on WhatsApp`}
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>Claim Offer &rarr;</span>
                        </a>

                        {/* Elegant Separator Diamond */}
                        <span className="text-brass-700/60 font-serif text-sm ml-4 select-none">◆</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* B. Brand Heritage Overview (PROMINENTLY DISPLAYED BELOW CAMPAIGN STRIP) */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-[#FAF7F2] via-[#F4ECE1] to-[#EAE0D0] border border-[#DDD5C7] shadow-[0_20px_50px_rgba(180,150,110,0.12)] transition-all duration-300">
          {/* Subtle Top Brass Accent Trim */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brass-500/80 to-transparent z-20" />

          {/* Animated Sweeping Light Shimmer */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/50 to-transparent rotate-12 animate-[pulse_7s_ease-in-out_infinite]" />
          </div>

          {/* Background Reference Photo with Light Ivory Vignette */}
          <div className="absolute inset-0 pointer-events-none">
            <img
              src={brandImage}
              alt={`${meta.name} flagship timepiece`}
              className="w-full h-full object-cover object-right-top lg:object-center opacity-15 mix-blend-multiply scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/90 to-[#FAF7F2]/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2]/90 via-transparent to-[#FAF7F2]/40" />
          </div>

          {/* Animated Kinetic Horological Gears Watermark (SVG) */}
          <div className="absolute right-[-40px] md:right-8 lg:right-20 top-1/2 -translate-y-1/2 pointer-events-none select-none opacity-25 md:opacity-35 z-0">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              {/* Master Horological Gear - Clockwise Rotation */}
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full text-brass-700 animate-[spin_70s_linear_infinite]"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="100" cy="100" r="82" strokeWidth="1.5" strokeDasharray="3 4" />
                <circle cx="100" cy="100" r="70" strokeWidth="1.5" />
                <circle cx="100" cy="100" r="48" strokeWidth="1" strokeDasharray="6 3" />
                <circle cx="100" cy="100" r="24" strokeWidth="2" fill="currentColor" fillOpacity="0.06" />
                <circle cx="100" cy="100" r="6" fill="currentColor" />
                {/* Spokes */}
                {[0, 30, 60, 90, 120, 150].map((deg) => (
                  <line
                    key={deg}
                    x1="100"
                    y1="30"
                    x2="100"
                    y2="170"
                    strokeWidth="1.5"
                    transform={`rotate(${deg} 100 100)`}
                  />
                ))}
                {/* Outer Gear Teeth */}
                {Array.from({ length: 24 }).map((_, i) => (
                  <rect
                    key={i}
                    x="97"
                    y="10"
                    width="6"
                    height="12"
                    rx="1.5"
                    fill="currentColor"
                    fillOpacity="0.4"
                    transform={`rotate(${i * 15} 100 100)`}
                  />
                ))}
              </svg>

              {/* Counter-Rotating Pinion Gear */}
              <svg
                viewBox="0 0 120 120"
                className="absolute -top-10 -left-10 w-36 h-36 sm:w-44 sm:h-44 text-amber-700 animate-[spin_40s_linear_infinite_reverse]"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="60" cy="60" r="48" strokeWidth="1.5" strokeDasharray="2 3" />
                <circle cx="60" cy="60" r="32" strokeWidth="1.5" />
                <circle cx="60" cy="60" r="14" strokeWidth="1.5" fill="currentColor" fillOpacity="0.08" />
                <circle cx="60" cy="60" r="4" fill="currentColor" />
                {[0, 45, 90, 135].map((deg) => (
                  <line
                    key={deg}
                    x1="60"
                    y1="16"
                    x2="60"
                    y2="104"
                    strokeWidth="1.2"
                    transform={`rotate(${deg} 60 60)`}
                  />
                ))}
                {Array.from({ length: 16 }).map((_, i) => (
                  <rect
                    key={i}
                    x="58"
                    y="6"
                    width="4"
                    height="8"
                    rx="1"
                    fill="currentColor"
                    fillOpacity="0.4"
                    transform={`rotate(${i * 22.5} 60 60)`}
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Heritage Banner Content */}
          <div className="relative z-10 p-6 sm:p-10 md:p-12 lg:p-14">
            <div className="max-w-3xl space-y-3 sm:space-y-4 text-stone-900">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brass-700/10 border border-brass-600/30 text-brass-800 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-brass-700 animate-pulse" />
                <span>{meta.country} Horology • Authorized Portfolio</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-stone-950 tracking-tight">
                {meta.name}
              </h1>

              <p className="font-serif text-base sm:text-lg md:text-xl text-brass-800 font-bold tracking-wide">
                {meta.tagline}
              </p>

              <p className="text-xs sm:text-sm text-[#4A4238] leading-relaxed max-w-2xl font-normal">
                {meta.history}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
                <div className="flex items-center gap-2 bg-white/85 hover:bg-white text-stone-800 px-3.5 py-1.5 rounded-full border border-[#DDD5C7] shadow-xs backdrop-blur-md transition-all">
                  <MapPin className="w-3.5 h-3.5 text-brass-700 shrink-0" />
                  <span className="font-medium text-stone-800">{meta.showrooms}</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50/90 hover:bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/90 shadow-xs backdrop-blur-md transition-all">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="font-semibold text-emerald-900">100% Genuine Certified Stock</span>
                </div>
                <a
                  href={brandWaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-full shadow-xs transition-all font-bold text-xs cursor-pointer active:scale-98"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Showroom</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Gender / Category Filter Tabs (Men, Women, Unisex) */}
      <div
        className="sticky top-16 sm:top-20 z-30 bg-[#FAF7F2] border-y border-[#D8CEBC] shadow-md py-3.5 sm:py-4 transition-all"
        style={{ backgroundColor: '#FAF7F2' }}
      >
        <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
            {/* Gender Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedGender('ALL')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${selectedGender === 'ALL'
                  ? 'bg-stone-900 text-white shadow-md ring-2 ring-stone-900'
                  : 'bg-[#EDE7DB] text-stone-700 hover:bg-[#E2D9C8] hover:text-stone-900'
                  }`}
              >
                <span>All Watches</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedGender === 'ALL' ? 'bg-amber-400 text-stone-950 font-black' : 'bg-stone-300 text-stone-800'
                    }`}
                >
                  {counts.all}
                </span>
              </button>

              <button
                onClick={() => setSelectedGender('Men')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${selectedGender === 'Men'
                  ? 'bg-stone-900 text-white shadow-md ring-2 ring-stone-900'
                  : 'bg-[#EDE7DB] text-stone-700 hover:bg-[#E2D9C8] hover:text-stone-900'
                  }`}
              >
                <span>Men's Watches</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedGender === 'Men' ? 'bg-amber-400 text-stone-950 font-black' : 'bg-stone-300 text-stone-800'
                    }`}
                >
                  {counts.men}
                </span>
              </button>

              <button
                onClick={() => setSelectedGender('Women')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${selectedGender === 'Women'
                  ? 'bg-stone-900 text-white shadow-md ring-2 ring-stone-900'
                  : 'bg-[#EDE7DB] text-stone-700 hover:bg-[#E2D9C8] hover:text-stone-900'
                  }`}
              >
                <span>Women's Watches</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedGender === 'Women' ? 'bg-amber-400 text-stone-950 font-black' : 'bg-stone-300 text-stone-800'
                    }`}
                >
                  {counts.women}
                </span>
              </button>

              <button
                onClick={() => setSelectedGender('Unisex')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${selectedGender === 'Unisex'
                  ? 'bg-stone-900 text-white shadow-md ring-2 ring-stone-900'
                  : 'bg-[#EDE7DB] text-stone-700 hover:bg-[#E2D9C8] hover:text-stone-900'
                  }`}
              >
                <span>Unisex Timepieces</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedGender === 'Unisex' ? 'bg-amber-400 text-stone-950 font-black' : 'bg-stone-300 text-stone-800'
                    }`}
                >
                  {counts.unisex}
                </span>
              </button>
            </div>

            {/* Quick Live Search within Brand & Price Sort */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="relative w-44 sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-500" />
                <input
                  type="text"
                  placeholder={`Search ${meta.name}...`}
                  value={searchInBrand}
                  onChange={(e) => setSearchInBrand(e.target.value)}
                  className="w-full bg-[#EDE7DB] border border-[#DDD5C7] focus:border-brass-600 rounded-xl pl-8 pr-3 py-1.5 text-xs text-stone-900 placeholder-stone-500 focus:outline-none"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#EDE7DB] border border-[#DDD5C7] rounded-xl px-2.5 py-1.5 text-xs font-semibold text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="featured">Curated Drops</option>
                <option value="name">Model Name (A – Z)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Active Selection Feedback Bar */}
      <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-5 pb-2">
        <div className="flex items-center justify-between text-xs text-stone-600">
          <div>
            Showing <strong className="text-stone-900">{displayedWatches.length}</strong>{' '}
            {selectedGender === 'ALL' ? 'total' : selectedGender.toLowerCase()} timepieces for{' '}
            <strong className="text-stone-900">{meta.name}</strong>
          </div>

          {searchInBrand && (
            <button
              onClick={() => setSearchInBrand('')}
              className="text-brass-700 hover:underline font-bold text-xs"
            >
              Clear search filter
            </button>
          )}
        </div>
      </div>

      {/* 5. Watches Collection Grid */}
      <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 mt-4">
        {displayedWatches.length === 0 ? (
          /* Empty / Custom Sourcing State */
          <div className="rounded-3xl bg-white border border-[#E5DEC9] p-8 sm:p-14 text-center max-w-2xl mx-auto shadow-sm space-y-4 my-8">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              Private Sourcing for {meta.name} ({selectedGender !== 'ALL' ? selectedGender : 'Special Editions'})
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              We frequently stock and source private collector references, limited anniversary editions, and specialty sizes for {meta.name} at our Gorakhpur showrooms.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={brandWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire Custom {meta.name} Model</span>
              </a>
              <button
                onClick={() => {
                  setSelectedGender('ALL');
                  setSearchInBrand('');
                }}
                className="px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-all"
              >
                View All {meta.name} Models
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {displayedWatches.map((watch) => (
              <WatchCard
                key={watch._id || watch.id}
                watch={watch}
                onQuickView={onSelectWatch}
                contactPhone={contactPhone}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
