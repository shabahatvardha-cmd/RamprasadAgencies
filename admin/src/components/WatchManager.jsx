import React, { useState, useRef } from 'react';
import {
  Plus,
  Upload,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Image as ImageIcon,
  X,
  Edit2,
  Eye,
  RotateCcw,
  Check,
  Tag,
  Star,
} from 'lucide-react';
import { uploadImageFile, createWatch, updateWatch, deleteWatch, getFullImageUrl } from '../utils/api';
import { formatINR } from '../utils/formatters';
import { getVerifiedBrandImage, BRAND_VERIFIED_WATCH_IMAGE } from '../utils/defaults';
import ConfirmationModal from './ConfirmationModal';

const POPULAR_BRANDS = [
  'Titan',
  'HMT',
  'Fastrack',
  'Sonata',
  'Tissot Swiss',
  'Rolex',
  'Omega',
  'TAG Heuer',
  'Cartier',
  'Seiko Presage',
  'Citizen Automatics',
  'Breitling',
  'Fossil Heritage',
  'Rado',
];

const CATEGORIES = [
  'Automatic',
  'Chronograph',
  'Dress',
  'Skeleton',
  'Vintage Aviator',
  'Field Watch',
  'Limited Edition',
  'Luxury Swiss',
];

const DEFAULT_SAMPLE_WATCHES = [
  {
    name: 'Titan Octane Chronograph Matte Black & Bold Orange',
    brand: 'Titan',
    category: 'Chronograph',
    price: 12995,
    movement: 'High-Precision Quartz Chronograph with Date',
    caseDiameter: '44mm',
    strapType: 'Perforated Racing Black Silicone & Leather Hybrid',
    waterResistance: '100m / 10 Bar',
    inStock: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1610006329898-2a4f12019450?auto=format&fit=crop&w=800&q=80',
    description: 'Bold dual-layer tachymeter dial with high-contrast orange chronograph accents, 100M water resistance, and racing date window.',
    storeLocation: 'Baldev Plaza & JalKal Building, Golghar, Gorakhpur',
  },
  {
    name: 'Titan Edge Ceramic Ultra-Slim 40mm',
    brand: 'Titan',
    category: 'Dress',
    price: 26995,
    movement: 'Titan In-House Ultra-Slim Quartz (4.2mm)',
    caseDiameter: '40mm',
    strapType: 'High-Tech Ceramic Link Bracelet',
    waterResistance: '30m / 3 Bar',
    inStock: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1561634343-3a2787687046?auto=format&fit=crop&w=800&q=80',
    description: 'One of the slimmest ceramic watches in the world. Featherweight scratch-resistant ceramic with sapphire crystal.',
    storeLocation: 'Baldev Plaza Flagship Showroom, Golghar',
  },
  {
    name: 'HMT Kohinoor 17-Jewel Manual-Wind Mechanical',
    brand: 'HMT',
    category: 'Automatic',
    price: 11500,
    movement: 'HMT Calibre 0231 17-Jewel Hand-Wound Mechanical',
    caseDiameter: '36mm',
    strapType: 'Vintage Stainless Steel Fold-Over Bracelet',
    waterResistance: '30m / 3 Bar',
    inStock: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80',
    description: 'The historic pride of Indian mechanical horology since 1961. Hand-wound 17-jewel caliber with audible mechanical sweep.',
    storeLocation: 'Baldev Plaza Flagship Showroom, Golghar',
  },
  {
    name: 'HMT Janata Devnagari Heritage Edition',
    brand: 'HMT',
    category: 'Automatic',
    price: 9995,
    movement: 'HMT Calibre 0231 17-Jewel Hand-Wound Mechanical',
    caseDiameter: '35.5mm',
    strapType: 'Top-Grain Saddle Tan Leather',
    waterResistance: '30m / 3 Bar',
    inStock: true,
    featured: false,
    image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=800&q=80',
    description: 'Historic Indian dress watch featuring authentic Devnagari numerals on an ivory enamel dial.',
    storeLocation: 'Baldev Plaza & JalKal Building, Golghar, Gorakhpur',
  },
  {
    name: 'Fastrack Street All-Black Diver Chrono 45mm',
    brand: 'Fastrack',
    category: 'Chronograph',
    price: 5495,
    movement: 'Multi-Function Sport Calibre with Dual Sub-Dials',
    caseDiameter: '45mm',
    strapType: 'Heavy-Duty All-Black Silicone Strap',
    waterResistance: '50m / 5 Bar',
    inStock: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1548907228-419a3f3d11d0?auto=format&fit=crop&w=800&q=80',
    description: 'Rugged street chronograph with angular gunmetal case, tactile pushers, and high-visibility indices.',
    storeLocation: 'Shop No. 1, JalKal Building Boutique, Golghar',
  },
  {
    name: 'Sonata Poze Classic Sunray Gold 40mm',
    brand: 'Sonata',
    category: 'Dress',
    price: 2995,
    movement: 'Sonata Reliable Quartz Calibre',
    caseDiameter: '40mm',
    strapType: 'Genuine Brown Croc-Pattern Leather',
    waterResistance: '30m / 3 Bar',
    inStock: true,
    featured: false,
    image: 'https://images.unsplash.com/photo-1518131672697-613becd4fab5?auto=format&fit=crop&w=800&q=80',
    description: 'Timeless everyday Indian elegance from the Tata family. Clean champagne sunray dial with minimalist baton markers.',
    storeLocation: 'Shop No. 1, JalKal Building Boutique, Golghar',
  },
  {
    name: 'Tissot PRX Powermatic 80 Ice Blue 40mm',
    brand: 'Tissot Swiss',
    category: 'Automatic',
    price: 62000,
    movement: 'Swiss Powermatic 80.111 Automatic (80H Reserve)',
    caseDiameter: '40mm',
    strapType: 'Integrated 316L Stainless Steel Bracelet',
    waterResistance: '100m / 10 Bar',
    inStock: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1715776314938-c7b1ab69ad80?auto=format&fit=crop&w=800&q=80',
    description: 'Tonneau silhouette with mesmerizing waffle tapisserie dial, Nivachron balance spring, and transparent caseback.',
    storeLocation: 'Baldev Plaza & JalKal Building, Golghar, Gorakhpur',
  },
  {
    name: 'Rolex Submariner Date 41mm Bluesy Two-Tone',
    brand: 'Rolex',
    category: 'Luxury Swiss',
    price: 1480000,
    movement: 'Rolex Calibre 3235 Superlative Chronometer',
    caseDiameter: '41mm',
    strapType: 'Oystersteel & 18ct Gold Oyster Bracelet with Glidelock',
    waterResistance: '300m / 30 Bar',
    inStock: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1670404160620-a3a86428560e?auto=format&fit=crop&w=800&q=80',
    description: 'Royal blue sunburst dial framed by blue Cerachrom ceramic bezel and signature Rolesor yellow gold and Oystersteel bracelet.',
    storeLocation: 'Baldev Plaza Flagship Showroom, Golghar',
  },
  {
    name: 'Omega Speedmaster Professional Moonwatch Co-Axial',
    brand: 'Omega',
    category: 'Luxury Swiss',
    price: 690000,
    movement: 'Omega Co-Axial Master Chronometer 3861',
    caseDiameter: '42mm',
    strapType: 'Brushed 5-Arched-Links-per-Row Stainless Steel',
    waterResistance: '50m / 5 Bar',
    inStock: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1556453007-ee036169934b?auto=format&fit=crop&w=800&q=80',
    description: 'The flight-qualified watch worn on all six lunar missions. Matte step dial with dot-over-ninety anodised aluminium bezel.',
    storeLocation: 'Baldev Plaza Flagship Showroom, Golghar',
  },
  {
    name: 'Seiko Presage Cocktail Time Skydiving 40.5mm',
    brand: 'Seiko Presage',
    category: 'Automatic',
    price: 45000,
    movement: 'Japanese 4R35 Mechanical Automatic',
    caseDiameter: '40.5mm',
    strapType: 'Solid Multi-Link Stainless Steel',
    waterResistance: '50m / 5 Bar',
    inStock: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1751437786613-905dff8fe021?auto=format&fit=crop&w=800&q=80',
    description: 'Radiant ice blue sunburst dial with heat-blued hands inspired by cocktail culture, date window, and exhibition back.',
    storeLocation: 'Baldev Plaza, Golghar, Gorakhpur',
  },
  {
    name: 'Citizen Promaster Eco-Drive 200M Diver',
    brand: 'Citizen Automatics',
    category: 'Automatic',
    price: 34995,
    movement: 'Citizen Eco-Drive Solar Calibre with Date',
    caseDiameter: '44mm',
    strapType: 'Heavy-Duty Ribbed Polyurethane Diver Strap',
    waterResistance: '200m / 20 Bar',
    inStock: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=800&q=80',
    description: 'ISO-compliant deep-sea professional diver with luminous hands, one-way rotating elapsed-time bezel, and Eco-Drive solar charge.',
    storeLocation: 'Baldev Plaza & JalKal Building, Golghar, Gorakhpur',
  },
  {
    name: 'Casio G-Shock 2100 CasiOak Octagon All-Black',
    brand: 'Casio Edifice',
    category: 'Chronograph',
    price: 9995,
    movement: 'Tough Quartz Dual Analog-Digital Movement',
    caseDiameter: '45.4mm',
    strapType: 'High-Durability Resin Band',
    waterResistance: '200m / 20 Bar',
    inStock: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1605583972593-1fda24a7bea2?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-thin octagonal bezel with carbon core guard structure, dual illuminator LED, and 200-meter water resistance.',
    storeLocation: 'Shop No. 1, JalKal Building Boutique, Golghar',
  },
  {
    name: 'Fossil Heritage Automatic Skeleton 43mm',
    brand: 'Fossil Heritage',
    category: 'Skeleton',
    price: 19995,
    movement: 'Japanese 21-Jewel Automatic Mechanical',
    caseDiameter: '43mm',
    strapType: 'Vegetable-Tanned Saddle Brown Leather',
    waterResistance: '50m / 5 Bar',
    inStock: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&w=800&q=80',
    description: 'Intricately skeletonized exhibition dial showing balance wheel oscillation, encased in antique steel with rich luggage leather strap.',
    storeLocation: 'Shop No. 1, JalKal Building Boutique, Golghar',
  },
  {
    name: 'Breitling Navitimer B01 Chronograph 43',
    brand: 'Breitling',
    category: 'Chronograph',
    price: 740000,
    movement: 'Breitling 01 Manufacture Automatic (COSC)',
    caseDiameter: '43mm',
    strapType: 'Navitimer 7-Row Stainless Steel Bracelet',
    waterResistance: '30m / 3 Bar',
    inStock: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1639564879163-a2a85682410e?auto=format&fit=crop&w=800&q=80',
    description: 'The quintessential pilot\'s watch since 1952. Circular slide rule flight calculation bezel and in-house COSC-certified Breitling 01 calibre.',
    storeLocation: 'Baldev Plaza Flagship Showroom, Golghar',
  },
];

export default function WatchManager({ watches = [], onRefresh, showToast }) {
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWatchId, setEditingWatchId] = useState(null);

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Fossil Heritage');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Automatic');
  const [movement, setMovement] = useState('Automatic Movement');
  const [caseDiameter, setCaseDiameter] = useState('42mm');
  const [strapType, setStrapType] = useState('Vegetable-Tanned Saddle Leather');
  const [waterResistance, setWaterResistance] = useState('100m / 10 Bar');
  const [storeLocation, setStoreLocation] = useState('Baldev Plaza & JalKal Building, Golghar, Gorakhpur');
  const [inStock, setInStock] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Confirmation Modals
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [watchToDelete, setWatchToDelete] = useState(null);

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingWatchId(null);
    setName('');
    setBrand('Titan');
    setPrice('');
    setCategory('Automatic');
    setMovement('Titan Automatic Mechanical Calibre');
    setCaseDiameter('42mm');
    setStrapType('Solid Stainless Steel / Genuine Leather');
    setWaterResistance('100m / 10 Bar');
    setStoreLocation('Baldev Plaza & JalKal Building, Golghar, Gorakhpur');
    setInStock(true);
    setFeatured(false);
    setDescription('');
    setImageUrl(BRAND_VERIFIED_WATCH_IMAGE.titan);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (w) => {
    setEditingWatchId(w._id || w.id);
    setName(w.name || '');
    setBrand(w.brand || 'Fossil Heritage');
    setPrice(w.price !== undefined ? String(w.price) : '');
    setCategory(w.category || 'Automatic');
    setMovement(w.movement || 'Automatic Movement');
    setCaseDiameter(w.caseDiameter || '42mm');
    setStrapType(w.strapType || 'Vegetable-Tanned Saddle Leather');
    setWaterResistance(w.waterResistance || '100m / 10 Bar');
    setStoreLocation(w.storeLocation || 'Baldev Plaza & JalKal Building, Golghar, Gorakhpur');
    setInStock(w.inStock !== false);
    setFeatured(Boolean(w.featured));
    setDescription(w.description || '');
    setImageUrl(w.image || '');
    setIsModalOpen(true);
  };

  // Upload image
  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await uploadImageFile(file);
      if (res?.imageUrl) {
        setImageUrl(res.imageUrl);
        showToast({
          type: 'success',
          title: 'Photo Uploaded',
          message: 'Watch photo uploaded and ready to save.',
        });
      }
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Upload Error',
        message: err.message || 'Could not upload image.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Submit Form (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast({ type: 'error', title: 'Name Required', message: 'Please enter watch model name.' });
      return;
    }
    if (!price || Number(price) <= 0) {
      showToast({ type: 'error', title: 'Price Required', message: 'Please specify a valid price in INR.' });
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: name.trim(),
        brand: brand.trim(),
        price: Number(price),
        category,
        movement,
        caseDiameter,
        strapType,
        waterResistance,
        storeLocation,
        inStock,
        featured,
        description: description.trim(),
        image: imageUrl || 'https://images.unsplash.com/photo-1670404160620-a3a86428560e?auto=format&fit=crop&w=800&q=80',
      };

      if (editingWatchId) {
        await updateWatch(editingWatchId, payload);
        showToast({
          type: 'success',
          title: 'Watch Updated',
          message: `"${payload.name}" updated successfully. Reflecting on storefront.`,
        });
      } else {
        await createWatch(payload);
        showToast({
          type: 'success',
          title: 'Watch Added',
          message: `"${payload.name}" added to showcase catalog.`,
        });
      }

      setIsModalOpen(false);
      onRefresh && onRefresh();
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: err.message || 'Failed to save timepiece.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle inStock
  const handleToggleStock = async (w) => {
    try {
      const id = w._id || w.id;
      const updatedStock = !w.inStock;
      await updateWatch(id, { inStock: updatedStock });
      showToast({
        type: 'info',
        title: updatedStock ? 'Marked In Stock' : 'Marked Out of Stock',
        message: `Status updated for ${w.name}.`,
      });
      onRefresh && onRefresh();
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not update stock status.',
      });
    }
  };

  // Delete watch confirmation
  const handleConfirmDelete = async () => {
    if (!watchToDelete) return;
    try {
      setDeletingId(watchToDelete._id || watchToDelete.id);
      await deleteWatch(watchToDelete._id || watchToDelete.id);
      showToast({
        type: 'success',
        title: 'Watch Removed',
        message: `Removed ${watchToDelete.name} from inventory.`,
      });
      setWatchToDelete(null);
      onRefresh && onRefresh();
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message || 'Could not delete watch.',
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Restore Default Catalog
  const handleRestoreCatalog = async () => {
    try {
      for (const sample of DEFAULT_SAMPLE_WATCHES) {
        await createWatch(sample);
      }
      showToast({
        type: 'success',
        title: 'Showcase Catalog Seeded',
        message: 'Loaded curated vintage automatic timepieces into the database.',
      });
      onRefresh && onRefresh();
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Restore Failed',
        message: err.message || 'Failed to restore default watches.',
      });
    }
  };

  // Filter watches
  const filteredWatches = watches.filter((w) => {
    const matchesSearch =
      !searchQuery.trim() ||
      w.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.movement?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'ALL' || w.category?.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brass-500/15 text-brass-800 border border-brass-600/30">
            <Sparkles className="w-3.5 h-3.5 text-brass-700" />
            <span>Showcase Horology Catalog</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mt-2">
            Watch Inventory & Carousels ({watches.length} Models)
          </h2>
          <p className="text-xs text-[#6B635B] mt-0.5 max-w-xl">
            Add new timepieces, edit specs, update pricing, or adjust stock status. Items instantly sync to customer carousels.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowRestoreModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#5A524A] hover:bg-[#F0EBE1] border border-[#DDD5C7] transition-all"
            title="Reset catalog to curated defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Seed Defaults</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-brass-600 to-amber-600 hover:from-brass-500 hover:to-amber-500 text-white shadow-md shadow-brass-600/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Watch</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#7C746B]" />
          <input
            type="text"
            placeholder="Search by model, brand, caliber..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-[#1A1A1A] placeholder-[#8C847A] focus:outline-none focus:border-brass-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-bold uppercase text-[#6B635B] shrink-0">
            Category:
          </span>
          {['ALL', 'Automatic', 'Chronograph', 'Dress', 'Skeleton'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                categoryFilter === cat
                  ? 'bg-brass-500 text-white shadow-sm'
                  : 'bg-[#FAF7F2] text-[#4A433D] hover:bg-[#F0EBE1] border border-[#DDD5C7]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Watches Cards Grid */}
      {filteredWatches.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-[#DDD5C7] space-y-3">
          <p className="text-sm font-serif font-bold text-[#1A1A1A]">
            No Timepieces Found
          </p>
          <p className="text-xs text-[#6B635B]">
            {searchQuery ? 'Try adjusting your search query or filter.' : 'Click "Add New Watch" or "Seed Defaults" to populate your catalog.'}
          </p>
          <button
            onClick={handleRestoreCatalog}
            className="px-4 py-2 rounded-xl text-xs font-bold text-brass-800 bg-brass-500/15 hover:bg-brass-500/25 border border-brass-600/30"
          >
            Seed Curated Showcase Timepieces
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredWatches.map((w) => {
            const id = w._id || w.id;
            const fullImg = getFullImageUrl(w.image);
            const isDeleting = deletingId === id;

            return (
              <div
                key={id}
                className="p-4 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
              >
                <div>
                  {/* Image Canvas with In-Stock Toggle */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E8E1D5] p-4 flex items-center justify-center">
                    <img
                      src={fullImg}
                      alt={w.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1670404160620-a3a86428560e?auto=format&fit=crop&w=600&q=80';
                      }}
                    />

                    {/* Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <button
                        onClick={() => handleToggleStock(w)}
                        className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-sm transition-all ${
                          w.inStock !== false
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                        title="Click to toggle stock status"
                      >
                        {w.inStock !== false ? '● In Stock' : '○ Out of Stock'}
                      </button>
                    </div>

                    {w.featured && (
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-brass-500 text-white shadow-sm flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>Hot</span>
                      </span>
                    )}
                  </div>

                  {/* Watch Details */}
                  <div className="mt-3 space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brass-800 font-bold block">
                      {w.brand} • {w.category || 'Automatic'}
                    </span>
                    <h4 className="font-serif text-sm font-bold text-[#1A1A1A] line-clamp-1">
                      {w.name}
                    </h4>
                    <p className="text-[11px] text-[#6B635B] line-clamp-1">
                      {w.strapType || w.movement || 'Automatic Movement'}
                    </p>
                  </div>
                </div>

                {/* Pricing & Actions */}
                <div className="pt-2 border-t border-[#E8E1D5] flex items-center justify-between">
                  <span className="font-serif text-sm font-bold text-[#1A1A1A]">
                    {formatINR(w.price)}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(w)}
                      className="p-1.5 rounded-lg text-[#5A524A] hover:text-[#1A1A1A] hover:bg-[#FAF7F2] border border-[#DDD5C7] transition-colors"
                      title="Edit Watch Specifications"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setWatchToDelete(w)}
                      disabled={isDeleting}
                      className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors"
                      title="Delete Watch"
                    >
                      {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Watch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div
            className="relative w-full max-w-2xl rounded-2xl bg-[#FAF7F2] border border-[#DDD5C7] shadow-2xl p-5 sm:p-7 space-y-5 my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D5]">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-brass-500/15 text-brass-700 flex items-center justify-center">
                  {editingWatchId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                    {editingWatchId ? 'Edit Timepiece Specifications' : 'Add New Timepiece'}
                  </h3>
                  <p className="text-[11px] text-[#6B635B]">
                    {editingWatchId ? `Modifying reference ID: ${editingWatchId}` : 'Add a new watch reference to your Golghar store catalog.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-[#7C746B] hover:text-[#1A1A1A] hover:bg-[#EAE4D8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Watch Name & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                    Watch Model Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Townsend Skeleton Automatic"
                    className="w-full bg-white border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-brass-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                    Brand / Manufacturer *
                  </label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Titan, HMT, Tissot, Rolex..."
                    className="w-full bg-white border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600"
                  />
                  {/* Quick Brand Selectors */}
                  <div className="flex flex-wrap gap-1 mt-1.5 max-h-16 overflow-y-auto">
                    {POPULAR_BRANDS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => {
                          setBrand(b);
                          const presetImg = getVerifiedBrandImage(b, '');
                          if (presetImg) setImageUrl(presetImg);
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                          brand.toLowerCase() === b.toLowerCase()
                            ? 'bg-brass-600 text-white shadow-sm'
                            : 'bg-white text-[#5A524A] border border-[#DDD5C7] hover:border-brass-600'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                    Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="18995"
                    className="w-full bg-white border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-brass-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                    Category Pillar
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-[#DDD5C7] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Caliber Movement & Case Diameter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                    Movement Caliber
                  </label>
                  <input
                    type="text"
                    value={movement}
                    onChange={(e) => setMovement(e.target.value)}
                    placeholder="Japanese 21-Jewel Automatic"
                    className="w-full bg-white border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                    Case Diameter / Size
                  </label>
                  <input
                    type="text"
                    value={caseDiameter}
                    onChange={(e) => setCaseDiameter(e.target.value)}
                    placeholder="44mm"
                    className="w-full bg-white border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Strap & Water Resistance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                    Strap / Bracelet
                  </label>
                  <input
                    type="text"
                    value={strapType}
                    onChange={(e) => setStrapType(e.target.value)}
                    placeholder="Vegetable-Tanned Saddle Leather"
                    className="w-full bg-white border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                    Water Resistance
                  </label>
                  <input
                    type="text"
                    value={waterResistance}
                    onChange={(e) => setWaterResistance(e.target.value)}
                    placeholder="100m / 10 Bar"
                    className="w-full bg-white border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Image Upload & URL */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                  Timepiece Photography *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://... or /uploads/..."
                    className="w-full flex-1 bg-white border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] font-mono focus:outline-none"
                  />
                  <label className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-brass-800 bg-brass-500/15 hover:bg-brass-500/25 border border-brass-600/30 cursor-pointer shrink-0">
                    {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFile}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Verified Brand Watch Presets */}
                <div className="mt-2.5 p-2 rounded-xl bg-white border border-[#DDD5C7]">
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brass-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-brass-600" />
                      <span>Verified Brand Watch Imagery (Click To Apply)</span>
                    </span>
                    {brand && (
                      <span className="text-[10px] text-[#6B635B]">
                        Selected: <strong className="text-brass-800">{brand}</strong>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {Object.entries(BRAND_VERIFIED_WATCH_IMAGE).map(([bKey, bImg]) => (
                      <button
                        key={bKey}
                        type="button"
                        onClick={() => {
                          setImageUrl(bImg);
                          setBrand(bKey.charAt(0).toUpperCase() + bKey.slice(1));
                        }}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-medium shrink-0 transition-all ${
                          imageUrl === bImg
                            ? 'bg-brass-600 text-white border-brass-700 shadow-sm'
                            : 'bg-[#FAF7F2] text-[#5A524A] border-[#DDD5C7] hover:border-brass-600'
                        }`}
                        title={`Select authentic ${bKey} watch photo`}
                      >
                        <img src={bImg} alt={bKey} className="w-3.5 h-3.5 rounded-full object-cover" />
                        <span className="capitalize">{bKey}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Thumbnail Preview */}
                {imageUrl && (
                  <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-white border border-[#DDD5C7]">
                    <img
                      src={getFullImageUrl(imageUrl)}
                      alt="Preview"
                      className="w-12 h-12 rounded-lg object-contain bg-[#FAF7F2] border border-[#DDD5C7]"
                      onError={(e) => {
                        e.target.src = getVerifiedBrandImage(brand, BRAND_VERIFIED_WATCH_IMAGE.titan);
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono text-brass-800 font-bold block">Active Photo URL</span>
                      <p className="text-[11px] text-[#5A524A] truncate">{imageUrl}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                  Overview & Craft Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Intricate exhibition dial showing balance wheel..."
                  className="w-full bg-white border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Toggles: In Stock & Featured */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1A1A1A]">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="w-4 h-4 rounded text-brass-600 focus:ring-brass-500 accent-brass-600"
                  />
                  <span>Mark as In Stock at Showroom</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1A1A1A]">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-brass-600 focus:ring-brass-500 accent-brass-600"
                  />
                  <span>Tag as Featured Hot Drop</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#E8E1D5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#4A433D] hover:bg-[#EFEAE1] border border-[#DDD5C7]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-brass-600 to-amber-600 hover:from-brass-500 hover:to-amber-500 text-white shadow-md shadow-brass-600/20 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{editingWatchId ? 'Update Watch' : 'Save New Watch'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Catalog Restore Modal */}
      <ConfirmationModal
        isOpen={showRestoreModal}
        title="Seed Default Watch Catalog?"
        message="This will add the curated Fossil Heritage automatic watches (Townsend Skeleton, Heritage Pilot Chrono, Neutra Smoked Amber) to your database."
        confirmText="Yes, Seed Default Watches"
        onConfirm={handleRestoreCatalog}
        onClose={() => setShowRestoreModal(false)}
      />

      {/* Confirm Delete Single Watch Modal */}
      <ConfirmationModal
        isOpen={Boolean(watchToDelete)}
        title="Delete Timepiece?"
        message={`Are you sure you want to permanently delete "${watchToDelete?.name}"? It will no longer appear on the storefront.`}
        confirmText="Yes, Delete Watch"
        isDangerous={true}
        onConfirm={handleConfirmDelete}
        onClose={() => setWatchToDelete(null)}
      />
    </div>
  );
}
