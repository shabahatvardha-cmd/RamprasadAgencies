import React from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Navigation,
  Sparkles,
  CheckCircle2,
  Edit2,
} from 'lucide-react';
import { getFullImageUrl } from '../../utils/api';

export default function VisualShowrooms({ showrooms, isEditMode, onOpenEdit }) {
  const showroomList = Array.isArray(showrooms) ? showrooms : [];

  return (
    <section id="showrooms" className="relative py-12 sm:py-24 bg-[#FAF7F2] border-t border-[#E8E1D5] overflow-hidden">
      {/* Visual Admin Edit Trigger Badge */}
      {isEditMode && (
        <div className="absolute top-4 right-4 z-30">
          <button
            onClick={() => onOpenEdit('showrooms')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-brass-600 hover:bg-brass-500 text-white shadow-2xl hover:scale-105 transition-all border border-white/30 backdrop-blur-md"
            title="Edit Showroom Photos, Operating Hours, Phone, Addresses, and Specialties"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Showrooms ({showroomList.length} Locations)</span>
          </button>
        </div>
      )}

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brass-500/10 border border-brass-500/30 text-brass-800 text-[11px] sm:text-xs font-bold uppercase tracking-widest">
            <MapPin className="w-3.5 h-3.5 text-brass-700" />
            <span>Dual Showroom Experience</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1A1A1A]">
            Visit Our Showrooms in Golghar
          </h2>
          <p className="text-xs sm:text-sm text-[#6B635B]">
            Conveniently situated in the prime commercial heart of Gorakhpur. Step in for personalized fitting, certified watch sizing, and private timepiece consultations.
          </p>
        </div>

        {/* 2-Column Showrooms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {showroomList.map((store, index) => {
            const storeImg = getFullImageUrl(store.image);
            const specialtiesList = Array.isArray(store.specialties)
              ? store.specialties
              : typeof store.specialties === 'string' && store.specialties.trim().length > 0
              ? store.specialties.split('\n').filter(Boolean)
              : [
                  'Official Swiss collections (Tissot, Rado, Victorinox)',
                  'Japanese Automatics & Presage timepieces (Seiko, Citizen)',
                  'Luxury presentation boxes & collector timepieces',
                  'Watch battery, bracelet adjustment & precision servicing',
                ];

            return (
              <div
                key={store.id || index}
                className="rounded-3xl overflow-hidden border border-[#DDD5C7] bg-white shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                {/* Image Banner */}
                <div className="relative h-48 sm:h-64 overflow-hidden group">
                  <img
                    src={storeImg}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent"></div>

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-white/95 text-brass-800 border border-brass-600/30 shadow-sm backdrop-blur-md">
                      Store #{index + 1} • {index === 0 ? 'Baldev Plaza' : 'JalKal Building'}
                    </span>
                  </div>

                  <div className="absolute bottom-3.5 left-3.5 right-3.5 p-3.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 shadow-lg">
                    <h3 className="font-serif text-base sm:text-xl font-bold text-white">
                      {store.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-brass-300 font-medium mt-0.5">
                      {store.tagline}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-brass-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-[#1A1A1A]">{store.address}</p>
                        <p className="text-xs text-[#6B635B] mt-0.5">Landmark: {store.landmark}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-brass-700 shrink-0" />
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-[#1A1A1A]">Showroom Hours</p>
                        <p className="text-xs text-[#6B635B] mt-0.5">{store.hours}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E8E1D5] space-y-1.5">
                      <p className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]">
                        Showroom Highlights:
                      </p>
                      <ul className="space-y-1">
                        {specialtiesList.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-[#5A524A]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-brass-600 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E8E1D5] flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1A1A1A] flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-brass-700" />
                      {store.phone || '+91 98765 43210'}
                    </span>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${store.mapQuery || 'Golghar+Gorakhpur'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F5F2EB] hover:bg-[#EAE4D7] text-[#1A1A1A] border border-[#DDD5C7] flex items-center gap-1.5 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-brass-700" />
                      <span>Google Maps</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
