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
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import WatchCard from '../components/WatchCard';
import { FALLBACK_WATCHES, getWatchGender } from '../data/fallbackWatches';
import { getBrandReferenceImage } from '../components/BrandMarquee';
import { getWhatsAppLink, getStoredCustomerProfile } from '../utils/api';

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
  casio: {
    name: 'Casio',
    country: 'Japan',
    tagline: 'Edifice Solar & Vintage Steel',
    history:
      'From cult 1980s retro digital classics to Bluetooth-connected Edifice solar racing chronographs, engineering legendary durability and utilitarian design.',
    showrooms: 'Shop No. 1, JalKal Building, Golghar',
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
  cartier: {
    name: 'Cartier',
    country: 'Swiss',
    tagline: 'Santos, Tank & Parisian Haute Horlogerie',
    history:
      'Founded in Paris in 1847, the jeweler of kings and the king of jewelers. Renowned for inventing the modern men’s wristwatch with the Santos in 1904, iconic Roman dials, and blue sapphire cabochon crowns.',
    showrooms: 'Baldev Plaza Flagship Showroom, Golghar',
  },
  'tag-heuer': {
    name: 'TAG Heuer',
    country: 'Swiss',
    tagline: 'Carrera, Monaco & Swiss Avant-Garde',
    history:
      'Swiss precision sports timekeeping since 1860, world-famous for motor racing chronographs, Carrera Glassbox dials, and unwavering avant-garde engineering.',
    showrooms: 'Baldev Plaza Flagship Showroom, Golghar',
  },
  'tag heuer': {
    name: 'TAG Heuer',
    country: 'Swiss',
    tagline: 'Carrera, Monaco & Swiss Avant-Garde',
    history:
      'Swiss precision sports timekeeping since 1860, world-famous for motor racing chronographs, Carrera Glassbox dials, and unwavering avant-garde engineering.',
    showrooms: 'Baldev Plaza Flagship Showroom, Golghar',
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
      badge: `${(meta.country || 'GLOBAL').toUpperCase()} HOROLOGY • OFFICIAL CAMPAIGN`,
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
export const isWatchInBrand = (w, slug) => {
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
  if (clean === 'tag-heuer' || clean === 'tag heuer') {
    return b === 'tag heuer' || b === 'tag-heuer';
  }
  return b === clean || b.replace(/\s+/g, '-') === clean;
};

export default function BrandPage({
  watches = [],
  contactPhone = '+91 98765 43210',
  wishlist = [],
  onToggleWishlist,
  onSelectWatch,
}) {
  const { brandSlug } = useParams();
  const navigate = useNavigate();

  // Normalize slug & retrieve brand details first
  const cleanSlug = (brandSlug || '').toLowerCase().trim();
  const meta =
    BRAND_METADATA[cleanSlug] || {
      name: (brandSlug || 'Maison').toUpperCase(),
      country: 'Global',
      tagline: 'Authorized Gorakhpur Showroom Showcase',
      history: 'Exclusive luxury timepiece collection available at Ram Prasad Agencies, Gorakhpur.',
      showrooms: 'Baldev Plaza & JalKal Building, Golghar',
    };

  const brandImage = getBrandReferenceImage(meta.name);

  // Selected gender filter: 'ALL' | 'Men' | 'Women' | 'Unisex'
  const [selectedGender, setSelectedGender] = useState('ALL');
  const [searchInBrand, setSearchInBrand] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'name'
  const [showroomFilter, setShowroomFilter] = useState('ALL'); // 'ALL' | 'Baldev Plaza' | 'JalKal'

  // Campaign Ad Carousel State & Controls
  const [isAdOpen, setIsAdOpen] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Retrieve curated campaign ads for this brand
  const campaignAds = useMemo(() => {
    return getBrandCampaignAds(cleanSlug, meta, brandImage);
  }, [cleanSlug, meta, brandImage]);

  // Reset slide index on brand change
  useEffect(() => {
    setCurrentSlide(0);
  }, [cleanSlug]);

  // Auto-play timer (every 6 seconds, pauses on mouse hover)
  useEffect(() => {
    if (!isAdOpen || isPaused || !campaignAds || campaignAds.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % campaignAds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAdOpen, isPaused, campaignAds]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + campaignAds.length) % campaignAds.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % campaignAds.length);
  };

  // Scroll to top immediately and update document title
  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch { }
    const originalTitle = document.title;
    document.title = `${meta.name} Timepieces | Ram Prasad Agencies Gorakhpur`;
    return () => {
      document.title = originalTitle;
    };
  }, [cleanSlug, meta.name]);

  // Filter watches strictly for this brand: merges live updates from admin/backend with the curated collection
  const brandWatches = useMemo(() => {
    const curated = FALLBACK_WATCHES.filter((w) => isWatchInBrand(w, cleanSlug));
    const liveList = (watches || []).filter((w) => isWatchInBrand(w, cleanSlug));

    if (liveList.length === 0) {
      return curated;
    }

    // Index live updates by id and name for instant reactivity
    const liveById = new Map();
    const liveByName = new Map();
    liveList.forEach((w) => {
      if (w.id) liveById.set(w.id, w);
      if (w._id) liveById.set(w._id, w);
      if (w.name) liveByName.set(w.name.toLowerCase().trim(), w);
    });

    // Merge: live updates override curated base fields
    const merged = curated.map((base) => {
      const match =
        (base.id && liveById.get(base.id)) ||
        (base._id && liveById.get(base._id)) ||
        (base.name && liveByName.get(base.name.toLowerCase().trim()));
      return match ? { ...base, ...match } : base;
    });

    // Also include any new brand timepieces added via admin studio
    liveList.forEach((lw) => {
      const alreadyIncluded = merged.some(
        (m) =>
          (m.id && (m.id === lw.id || m.id === lw._id)) ||
          (m._id && (m._id === lw.id || m._id === lw._id)) ||
          (m.name && lw.name && m.name.toLowerCase().trim() === lw.name.toLowerCase().trim())
      );
      if (!alreadyIncluded) {
        merged.push(lw);
      }
    });

    return merged;
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

  // Active Campaign Slide & Dedicated WhatsApp Link
  const activeAd = (campaignAds && campaignAds[currentSlide]) || (campaignAds && campaignAds[0]) || {};
  const adWaMessage = `Hello Ram Prasad Agencies,

My name is ${customerName}. I am inquiring about the "${activeAd?.headline || meta.name}" featured in your showroom campaign banner.

You can reach me at ${customerPhone} or ${customerEmail}. Looking forward to your guidance on availability and showroom viewing. Thank you!`;

  const adWaLink = getWhatsAppLink(contactPhone, adWaMessage);

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
            <Link to="/#brands" className="hover:text-brass-700 transition-colors">
              Brands
            </Link>
            <span className="text-stone-400">/</span>
            <span className="font-bold text-stone-900 truncate">{meta.name}</span>
          </div>

          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900 hover:bg-brass-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Brands</span>
          </button>
        </div>
      </div>

      {/* 2. Hero Portion: Big Banner Campaign Ad Carousel OR Collapsed Brand Heritage Overview */}
      <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-6 sm:pt-8 pb-4">
        {isAdOpen ? (
          /* =========================================================================
             A. BIG BANNER BRAND CAMPAIGN AD CAROUSEL (WITH CLOSE 'X' BUTTON)
             ========================================================================= */
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-[#FAF7F2] via-[#F5ECE0] to-[#EAE0D0] border border-[#DDD5C7] shadow-[0_20px_50px_rgba(180,150,110,0.14)] transition-all duration-300"
          >
            {/* Top Brass Accent Trim */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brass-500/80 to-transparent z-20" />

            {/* Ambient Sapphire Crystal Glint */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
              <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/50 to-transparent rotate-12 animate-[pulse_7s_ease-in-out_infinite]" />
            </div>

            {/* Background Watch Watermark Photo */}
            <div className="absolute inset-0 pointer-events-none">
              <img
                src={activeAd.image || brandImage}
                alt={activeAd.headline || meta.name}
                className="w-full h-full object-cover object-right-top lg:object-center opacity-10 mix-blend-multiply scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/90 to-[#FAF7F2]/50" />
            </div>

            {/* Top Controls Strip: Campaign Badge, Slide Counter & Close 'X' Button */}
            <div className="relative z-20 px-6 sm:px-10 pt-5 sm:pt-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brass-700/10 border border-brass-600/30 text-brass-800 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-brass-700 animate-pulse" />
                  <span>Official Maison Campaign</span>
                </div>
                <span className="text-[11px] font-mono text-stone-600 font-bold bg-white/80 px-2 py-0.5 rounded-full border border-stone-200">
                  Slide {currentSlide + 1} of {campaignAds.length}
                </span>
              </div>

              {/* Close Ad Banner Button */}
              <button
                onClick={() => setIsAdOpen(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-stone-900 text-stone-700 hover:text-white border border-[#D5CCBC] shadow-xs text-xs font-bold transition-all cursor-pointer group"
                title="Close campaign ad carousel"
              >
                <span className="text-[11px] font-semibold hidden sm:inline">Close Ads</span>
                <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>

            {/* Main Slide Content: Left Text/CTA, Right Timepiece Showcase */}
            <div className="relative z-10 px-6 sm:px-10 md:px-12 py-5 sm:py-7 lg:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
              {/* Left Column (Content & CTA) */}
              <div className="lg:col-span-7 space-y-3 sm:space-y-3.5 text-stone-900">
                <span className="inline-block text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-brass-800 font-bold bg-amber-100/70 px-2.5 py-0.5 rounded-md border border-amber-200/80">
                  {activeAd.badge}
                </span>

                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-stone-950 tracking-tight leading-tight">
                  {activeAd.headline}
                </h2>

                <p className="font-serif text-sm sm:text-base md:text-lg text-brass-800 font-bold tracking-wide">
                  {activeAd.subheadline}
                </p>

                <p className="text-xs sm:text-sm text-[#4A4238] leading-relaxed max-w-xl font-normal">
                  {activeAd.description}
                </p>

                {/* Quick Specs Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {activeAd.specs && activeAd.specs.map((spec, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/85 border border-[#DDD5C7] text-stone-700 text-[11px] font-medium shadow-xs"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{spec}</span>
                    </span>
                  ))}
                </div>

                {/* Inquire on WhatsApp & Showroom Info */}
                <div className="pt-2 flex flex-wrap items-center gap-3.5">
                  <a
                    href={adWaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/20 hover:shadow-emerald-700/30 transition-all hover:scale-102 active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Inquire Campaign on WhatsApp</span>
                  </a>
                  <div className="flex items-center gap-1.5 text-xs text-stone-600">
                    <MapPin className="w-3.5 h-3.5 text-brass-700 shrink-0" />
                    <span>{activeAd.storeAvailability}</span>
                  </div>
                </div>
              </div>

              {/* Right Column (Big Timepiece Visual Showcase Card) */}
              <div className="lg:col-span-5 flex items-center justify-center relative">
                <div className="relative group w-48 h-48 sm:w-60 sm:h-60 md:w-68 md:h-68 lg:w-72 lg:h-72 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-xl border border-brass-600/30 p-3 shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                  <img
                    src={activeAd.image}
                    alt={activeAd.headline}
                    className="w-full h-full object-cover object-center rounded-2xl group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  {/* Luminous border glint */}
                  <div className="absolute inset-0 rounded-3xl border border-white/40 pointer-events-none" />
                  {/* Floating Brand Badge */}
                  <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-black/65 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono font-bold flex items-center justify-between">
                    <span>{meta.name}</span>
                    <span className="text-amber-300 font-semibold">100% Genuine</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Carousel Controls Bar: Dots & Prev/Next */}
            <div className="relative z-20 px-6 sm:px-10 pb-4 sm:pb-5 flex items-center justify-between border-t border-[#E5DEC9]/60 pt-3">
              {/* Slide Indicator Dots */}
              <div className="flex items-center gap-1.5">
                {campaignAds.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${currentSlide === idx ? 'w-6 bg-brass-800' : 'w-2 bg-stone-300 hover:bg-stone-400'
                      }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Navigation Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevSlide}
                  className="w-8 h-8 rounded-full bg-white/90 hover:bg-stone-900 text-stone-700 hover:text-white border border-[#DDD5C7] flex items-center justify-center transition-all shadow-xs cursor-pointer"
                  aria-label="Previous Campaign"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextSlide}
                  className="w-8 h-8 rounded-full bg-white/90 hover:bg-stone-900 text-stone-700 hover:text-white border border-[#DDD5C7] flex items-center justify-center transition-all shadow-xs cursor-pointer"
                  aria-label="Next Campaign"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
             B. COLLAPSED BRAND HERITAGE OVERVIEW (WITH 'VIEW BRAND ADS' BUTTON)
             ========================================================================= */
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

            {/* Collapsed Heritage Banner Content */}
            <div className="relative z-10 p-6 sm:p-10 md:p-12 lg:p-14">
              <div className="max-w-3xl space-y-3 sm:space-y-4 text-stone-900">
                {/* Header Strip with Reopen Campaign Ads Button */}
                <div className="flex items-center justify-between flex-wrap gap-2 pb-1">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brass-700/10 border border-brass-600/30 text-brass-800 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-brass-700 animate-pulse" />
                    <span>{meta.country} Horology • Authorized Portfolio</span>
                  </div>

                  <button
                    onClick={() => setIsAdOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-stone-900 text-stone-800 hover:text-white border border-[#DDD5C7] text-xs font-bold transition-all shadow-xs cursor-pointer group"
                    title="View Brand Campaign Ads Carousel"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-brass-700 group-hover:text-amber-300 animate-pulse" />
                    <span>View Campaign Ads ({campaignAds.length})</span>
                  </button>
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
                </div>
              </div>
            </div>
          </div>
        )}
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
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {displayedWatches.map((watch) => (
              <WatchCard
                key={watch._id || watch.id}
                watch={watch}
                onQuickView={onSelectWatch}
                contactPhone={contactPhone}
                isWishlisted={wishlist.some(
                  (w) => (w._id || w.id) === (watch._id || watch.id)
                )}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        )}
      </div>

      {/* 6. Bottom Showroom Assistance Banner */}
      <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 mt-12 sm:mt-16">
        <div className="rounded-2xl sm:rounded-3xl bg-[#EDE7DB] border border-[#DDD5C7] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
              Looking for a specific {meta.name} reference not listed here?
            </h4>
            <p className="text-xs text-stone-600 mt-1">
              Visit our Baldev Plaza or JalKal Building showrooms in Golghar, or message our horology experts on WhatsApp with your desired reference number.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 text-xs font-bold transition-all border border-stone-300"
            >
              Explore Other Maisons
            </button>
            <a
              href={brandWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-brass-700 text-white text-xs font-bold transition-all shadow-md"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Direct WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
