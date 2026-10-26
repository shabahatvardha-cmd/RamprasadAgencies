import React from 'react';
import { ShieldCheck, Sparkles, Clock, MapPin, Award, CheckCircle } from 'lucide-react';

const DEFAULT_PERKS = [
  {
    icon: ShieldCheck,
    title: '100% Genuine Imports',
    subtitle: 'Official Stamped International Warranty',
  },
  {
    icon: Award,
    title: 'Certified Horologists',
    subtitle: 'Free Bracelet Sizing & Ultrasonic Cleaning',
  },
  {
    icon: MapPin,
    title: 'Two Golghar Flagships',
    subtitle: 'Baldev Plaza & JalKal Building',
  },
  {
    icon: Clock,
    title: 'Open All 7 Days',
    subtitle: '10:30 AM to 9:00 PM Viewing',
  },
];

const ICONS = [ShieldCheck, Award, MapPin, Clock];

export default function TrustBadges({ trustBadges }) {
  const perks = (trustBadges && Array.isArray(trustBadges) && trustBadges.length > 0)
    ? trustBadges.map((b, idx) => ({
        ...b,
        icon: b.icon ? (ICONS[idx % ICONS.length]) : (ICONS[idx % ICONS.length]),
      }))
    : DEFAULT_PERKS;

  return (
    <div className="w-full bg-[#F5F2EB] border-y border-[#E8E1D5] py-4 sm:py-6">
      <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {perks.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="flex items-center gap-2.5 sm:gap-3.5 group">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-brass-500/15 border border-brass-600/30 text-brass-700 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-brass-600/60 transition-all">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1A] tracking-wide truncate">
                    {p.title}
                  </h4>
                  <p className="text-[9.5px] sm:text-[11px] text-[#6B635B] mt-0.5 line-clamp-1">
                    {p.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
