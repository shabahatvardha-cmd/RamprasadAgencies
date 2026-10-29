import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Palette,
  RotateCcw,
  ExternalLink,
  Plus,
  Eye,
  Edit3,
  Sliders,
  ChevronDown,
  Zap,
  Award,
  Compass,
  MapPin,
  MessageSquare,
  LogOut,
  Layers,
  Store,
} from 'lucide-react';
import BrandLogo from '../BrandLogo';

export default function AdminTopBar({
  isEditMode,
  setIsEditMode,
  onOpenModal,
  onOpenMasterRestore,
  onOpenLeads,
  onOpenInventory,
  onLogout,
  newLeadsCount = 0,
}) {
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const quickMenuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (quickMenuRef.current && !quickMenuRef.current.contains(e.target)) {
        setIsQuickMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const sections = [
    { label: 'Hero Showcase', href: '#hero' },
    { label: 'The Maison Portfolio', href: '#brands' },
    { label: 'Showrooms', href: '#showrooms' },
    { label: 'Inquiry Form', href: '#inquiry' },
    { label: 'Footer & VIP', href: '#footer' },
  ];

  const handleSmoothScroll = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickEdit = (modalType) => {
    setIsQuickMenuOpen(false);
    if (!isEditMode) {
      setIsEditMode(true);
    }
    onOpenModal(modalType);
  };

  return (
    <header className="sticky top-0 z-[60] bg-[#141415]/98 text-white border-b border-brass-600/30 backdrop-blur-xl shadow-2xl transition-all font-sans">
      {/* Primary Top Bar Row */}
      <div className="w-full px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand & Status */}
        <div className="flex items-center gap-3">
          <BrandLogo className="w-8 h-8" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-xs sm:text-sm font-extrabold tracking-wider text-white">
                RAM PRASAD AGENCIES
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-brass-500/20 text-brass-300 border border-brass-500/40">
                admin.watchstore.in
              </span>
            </div>
            <p className="text-[10px] text-[#A0988E] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live Synced with Storefront</span>
            </p>
          </div>
        </div>

        {/* Center: Clean Two-State Segmented Switch */}
        <div className="flex items-center">
          <div className="inline-flex p-1 bg-[#222224] rounded-2xl border border-white/10 shadow-inner">
            <button
              onClick={() => setIsEditMode(true)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isEditMode
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-950/60 ring-1 ring-emerald-400/30'
                  : 'text-[#A0988E] hover:text-white hover:bg-white/5'
              }`}
              title="Show edit buttons to customize sections, text, and images"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Mode</span>
              {isEditMode && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>}
            </button>

            <button
              onClick={() => setIsEditMode(false)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                !isEditMode
                  ? 'bg-brass-500 text-[#141415] shadow-md font-extrabold'
                  : 'text-[#A0988E] hover:text-white hover:bg-white/5'
              }`}
              title="Preview the exact website view as seen by customers without edit buttons"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Mode</span>
            </button>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Customer Leads Desk */}
          <button
            onClick={() => onOpenLeads && onOpenLeads()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#222224] hover:bg-[#2c2c30] text-emerald-400 border border-emerald-500/30 hover:border-emerald-400 transition-all shadow-sm active:scale-95"
            title="View customer consultation requests and WhatsApp leads"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Leads</span>
            {newLeadsCount > 0 ? (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-500 text-[#141415] animate-pulse">
                {newLeadsCount} New
              </span>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            )}
          </button>

          {/* Timepiece Inventory Catalog Desk */}
          <button
            onClick={() => onOpenInventory ? onOpenInventory() : handleQuickEdit('inventory')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#222224] hover:bg-[#2c2c30] text-amber-300 border border-brass-600/30 hover:border-brass-400 transition-all shadow-sm active:scale-95"
            title="Open Full Timepiece Inventory Desk"
          >
            <Layers className="w-3.5 h-3.5 text-brass-400" />
            <span className="hidden sm:inline">Inventory</span>
          </button>

          {/* Quick Section Editors Dropdown */}
          <div className="relative" ref={quickMenuRef}>
            <button
              onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#222224] hover:bg-[#2c2c30] text-white border border-brass-600/40 hover:border-brass-400 shadow-sm transition-all"
              title="Choose any section to edit immediately"
            >
              <Zap className="w-3.5 h-3.5 text-brass-400" />
              <span>Quick Edit</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isQuickMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isQuickMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#1C1C1F] border border-brass-600/40 rounded-2xl shadow-2xl p-2 z-50 text-xs animate-fade-in backdrop-blur-2xl">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest text-brass-400 border-b border-white/10 mb-1">
                  Section Editors
                </div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => handleQuickEdit('hero')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white hover:bg-brass-500/15 text-left transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-brass-400" />
                    <div>
                      <div className="font-bold">Hero Showcase Slides</div>
                      <div className="text-[10px] text-[#A0988E]">Headlines, photos & badges</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickEdit('branding')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white hover:bg-brass-500/15 text-left transition-colors"
                  >
                    <Award className="w-3.5 h-3.5 text-brass-400" />
                    <div>
                      <div className="font-bold">The Maison Brands Portfolio</div>
                      <div className="text-[10px] text-[#A0988E]">Brand list & heritage badges</div>
                    </div>
                  </button>

                  <button
                    onClick={() => onOpenInventory ? onOpenInventory() : handleQuickEdit('inventory')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white hover:bg-brass-500/15 text-left transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <div>
                      <div className="font-bold">Timepiece Inventory Desk</div>
                      <div className="text-[10px] text-[#A0988E]">Add, edit, seed & filter watches</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickEdit('showrooms')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white hover:bg-brass-500/15 text-left transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-brass-400" />
                    <div>
                      <div className="font-bold">Golghar Showrooms</div>
                      <div className="text-[10px] text-[#A0988E]">Baldev Plaza & JalKal Building</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickEdit('inquiry')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white hover:bg-brass-500/15 text-left transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5 text-brass-400" />
                    <div>
                      <div className="font-bold">Consultation Form Builder</div>
                      <div className="text-[10px] text-[#A0988E]">Add custom inputs & options</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickEdit('branding')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white hover:bg-brass-500/15 text-left transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-brass-400" />
                    <div>
                      <div className="font-bold">Footer VIP & Helpline</div>
                      <div className="text-[10px] text-[#A0988E]">VIP teaser, phone & logo</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickEdit('appearance')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white hover:bg-brass-500/15 text-left transition-colors"
                  >
                    <Palette className="w-3.5 h-3.5 text-brass-400" />
                    <div>
                      <div className="font-bold">Colors & Fonts</div>
                      <div className="text-[10px] text-[#A0988E]">Customize palette & font size</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Add Timepiece */}
          <button
            onClick={() => onOpenModal('watch-add')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-brass-600 hover:bg-brass-500 text-white shadow-md transition-all active:scale-95"
            title="Add a new watch to the catalog"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Watch</span>
          </button>

          {/* Master Site Restore */}
          <button
            onClick={onOpenMasterRestore}
            className="p-1.5 rounded-xl text-xs font-semibold bg-[#222224] hover:bg-rose-950/60 text-[#A0988E] hover:text-rose-300 border border-white/10 transition-all"
            title="Restore Entire Website to Factory Defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
          </button>

          {/* View Live Storefront */}
          <a
            href={window.location.hostname.includes('lvh.me') ? 'http://watchstore.lvh.me/#showrooms' : 'http://watchstore.in/#showrooms'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all"
            title="Open customer storefront at http://watchstore.in/#showrooms"
          >
            <Store className="w-3.5 h-3.5 text-brass-400" />
            <span className="hidden md:inline">watchstore.in</span>
            <ExternalLink className="w-3 h-3 text-brass-400" />
          </a>

          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all"
              title="Sign out of Admin Studio"
            >
              <LogOut className="w-3 h-3 text-rose-400" />
              <span className="hidden lg:inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Section Anchor Jump Bar */}
      <div className="w-full px-3 sm:px-6 py-1.5 bg-[#18181A] border-t border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
        <span className="text-[10px] uppercase font-mono tracking-widest text-brass-400 font-bold shrink-0 mr-1 flex items-center gap-1">
          <Layers className="w-3 h-3" />
          Jump To:
        </span>
        {sections.map((sec) => (
          <a
            key={sec.href}
            href={sec.href}
            onClick={(e) => handleSmoothScroll(e, sec.href)}
            className="px-2.5 py-0.5 rounded-full bg-white/5 hover:bg-brass-500/20 hover:text-brass-300 text-[#C7BFB5] shrink-0 transition-colors"
          >
            {sec.label}
          </a>
        ))}
      </div>
    </header>
  );
}
