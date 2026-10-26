import React, { useState, useEffect } from 'react';
import {
  Watch,
  Sliders,
  MapPin,
  Activity,
  ExternalLink,
  Sparkles,
  Zap,
  Image as ImageIcon,
  Layers,
  Building2,
  Tag,
  Palette,
  RotateCcw,
} from 'lucide-react';
import { checkHealth } from '../utils/api';
import BrandLogo from './BrandLogo';

export default function Navbar({
  activeTab,
  setActiveTab,
  watchCount = 0,
  onOpenMasterRestore,
}) {
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  useEffect(() => {
    const testConnection = async () => {
      const connected = await checkHealth();
      setIsBackendConnected(connected);
    };

    testConnection();
    const interval = setInterval(testConnection, 8000);
    return () => clearInterval(interval);
  }, []);

  const navTabs = [
    { id: 'inventory', label: 'Watch Catalog', icon: Watch, count: watchCount },
    { id: 'hero', label: 'Hero Slides', icon: ImageIcon },
    { id: 'flashSale', label: 'Flash Sale', icon: Zap },
    { id: 'lifestyle', label: 'Categories & Story', icon: Layers },
    { id: 'showrooms', label: 'Showroom Flagships', icon: Building2 },
    { id: 'branding', label: 'Brand & Inquiries', icon: Tag },
    { id: 'appearance', label: 'Colors & Styling', icon: Palette },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/98 backdrop-blur-xl border-b border-[#E8E1D5] shadow-sm text-[#1A1A1A]">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Header */}
          <div className="flex items-center gap-3.5">
            <BrandLogo className="w-11 h-11" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-base sm:text-lg font-bold tracking-wide text-[#1A1A1A]">
                  RAM PRASAD AGENCIES
                </h1>
                <span className="hidden sm:inline-block text-[9.5px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-brass-500/15 text-brass-800 border border-brass-600/30">
                  Storefront Studio
                </span>
              </div>
              <p className="text-[11px] text-[#6B635B] flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-brass-700 shrink-0" />
                <span className="truncate">Baldev Plaza & JalKal Building, Golghar, Gorakhpur</span>
              </p>
            </div>
          </div>

          {/* Right Header Status & Navigation Links */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Live Backend Connection Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#DDD5C7] text-xs text-[#4A433D] shadow-sm">
              <span className="relative flex h-2 w-2">
                {isBackendConnected && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isBackendConnected ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                ></span>
              </span>
              <span className="font-medium text-[11px]">
                {isBackendConnected ? 'Connected to :5000' : 'Connecting to :5000...'}
              </span>
            </div>

            {/* Restore Entire Website Button */}
            <button
              onClick={onOpenMasterRestore}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 transition-all shadow-sm"
              title="Restore entire website back to default settings"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Reset Whole Website</span>
            </button>

            {/* View Live Storefront Button */}
            <a
              href={window.location.hostname.includes('lvh.me') ? 'http://ramprasadwatchstore.lvh.me/#showrooms' : 'http://ramprasadwatchstore.in/#showrooms'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-brass-600 to-amber-600 hover:from-brass-500 hover:to-amber-500 text-white shadow-sm shadow-brass-600/20 transition-all active:scale-95"
              title="Open Customer Storefront at http://ramprasadwatchstore.in/#showrooms"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ramprasadWatchstore.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Tab Navigation Row */}
        <div className="flex gap-1.5 border-t border-[#E8E1D5] pt-2 pb-2 overflow-x-auto scrollbar-none">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-brass-500 text-white shadow-sm font-bold'
                    : 'bg-white hover:bg-[#F2ECE1] text-[#3D3731] border border-[#DDD5C7]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white font-bold' : 'bg-[#FAF7F2] text-[#6B635B]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
