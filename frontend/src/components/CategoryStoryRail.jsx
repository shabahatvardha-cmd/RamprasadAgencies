import React from 'react';
import {
  Watch,
  Compass,
  Gauge,
  Crown,
  Sparkles,
  Flame,
  Gem,
  Award,
} from 'lucide-react';

const CATEGORY_STORIES = [
  {
    id: 'ALL',
    name: 'All Drops',
    tag: 'Vault',
    icon: Flame,
    color: 'from-amber-500 to-gold-500',
    border: 'border-gold-500/40',
  },
  {
    id: 'Automatic',
    name: 'Automatics',
    tag: 'Mechanical',
    icon: Gauge,
    color: 'from-blue-600 to-indigo-600',
    border: 'border-blue-500/40',
  },
  {
    id: 'Chronograph',
    name: 'Chronos',
    tag: 'Racing',
    icon: Compass,
    color: 'from-rose-600 to-amber-600',
    border: 'border-rose-500/40',
  },
  {
    id: 'Dress',
    name: 'Dress & Noir',
    tag: 'Minimal',
    icon: Gem,
    color: 'from-slate-600 to-zinc-600',
    border: 'border-zinc-500/40',
  },
  {
    id: 'Diver',
    name: 'Diver 200M',
    tag: 'Aquatic',
    icon: Watch,
    color: 'from-cyan-600 to-blue-700',
    border: 'border-cyan-500/40',
  },
  {
    id: 'Haute Horlogerie',
    name: 'Swiss Prestige',
    tag: 'Masterpiece',
    icon: Crown,
    color: 'from-amber-600 to-yellow-500',
    border: 'border-amber-500/40',
  },
  {
    id: 'Aviation',
    name: 'Aviation',
    tag: 'Pilot',
    icon: Award,
    color: 'from-emerald-600 to-teal-700',
    border: 'border-emerald-500/40',
  },
];

export default function CategoryStoryRail({ selectedCategory, onSelectCategory }) {
  return (
    <section className="py-5 sm:py-8 bg-obsidian-950/80 border-b border-white/5">
      <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping"></span>
            <span className="text-[11px] sm:text-xs uppercase font-extrabold tracking-widest text-gold-300">
              Discover by Persona & Movement
            </span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Scroll across curated horology categories
          </span>
        </div>

        {/* Horizontal Story Bubble Rail */}
        <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto pb-3 pt-1 scrollbar-none touch-pan-x -mx-3 px-3 sm:mx-0 sm:px-0">
          {CATEGORY_STORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="group flex flex-col items-center gap-2 shrink-0 transition-transform active:scale-95 text-center focus:outline-none"
              >
                {/* Circular Gradient Ring (Fastrack Story Look) */}
                <div
                  className={`p-[2.5px] rounded-full transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-tr from-gold-400 via-amber-300 to-white shadow-lg shadow-gold-500/25 scale-105'
                      : 'bg-gradient-to-tr from-white/10 to-white/5 hover:from-gold-500/60 hover:to-amber-400/60'
                  }`}
                >
                  <div
                    className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full flex flex-col items-center justify-center p-2 transition-all ${
                      isSelected
                        ? 'bg-obsidian-950 text-gold-300'
                        : 'bg-obsidian-900 text-slate-400 group-hover:text-white group-hover:bg-obsidian-850'
                    }`}
                  >
                    <Icon className="w-6 h-6 mb-0.5" />
                    <span className="text-[8px] font-mono uppercase tracking-wider opacity-75">
                      {cat.tag}
                    </span>
                  </div>
                </div>

                {/* Category Label */}
                <div className="space-y-0.5">
                  <span
                    className={`text-xs font-bold tracking-wide block transition-colors ${
                      isSelected
                        ? 'text-gold-300 font-extrabold'
                        : 'text-slate-300 group-hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
