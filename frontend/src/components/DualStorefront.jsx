import React from 'react';
import { MapPin, Clock, Phone, Navigation, Sparkles, CheckCircle2, MessageCircle } from 'lucide-react';
import { getWhatsAppLink, getFullImageUrl } from '../utils/api';

const STORES = [
  {
    id: 'store-1',
    name: 'Baldev Plaza Flagship Showroom',
    tagline: 'Swiss Horology & Automatic Heritage',
    address: 'Baldev Plaza, Main Market, Golghar, Gorakhpur, UP - 273001',
    landmark: 'Opposite Town Hall / Heart of Golghar Commercial Hub',
    hours: '10:30 AM – 9:00 PM (Monday to Sunday)',
    specialties: [
      'Official Swiss collections (Tissot, Rado, Victorinox)',
      'Japanese Automatics & Presage timepieces (Seiko, Citizen)',
      'Luxury presentation boxes & collector timepieces',
      'Watch battery, bracelet adjustment & precision servicing',
    ],
    mapQuery: 'Baldev+Plaza+Golghar+Gorakhpur',
    phone: '+91 98765 43210',
    image: '/images/showrooms/baldev-plaza.webp',
  },
  {
    id: 'store-2',
    name: 'JalKal Building Boutique',
    tagline: 'Contemporary & Everyday Luxury Timepieces',
    address: 'Shop No. 1, JalKal Building, Golghar, Gorakhpur, UP - 273001',
    landmark: 'Near JalKal Compound, Main Golghar Market',
    hours: '10:30 AM – 9:00 PM (Monday to Sunday)',
    specialties: [
      'Casual Luxury & Chronographs (Fossil, Casio Edifice)',
      'Designer & lifestyle collections (Tommy Hilfiger, Armani)',
      'Genuine leather straps, steel bracelets & horology accessories',
      'Instant watch battery replacement & ultrasonic cleaning',
    ],
    mapQuery: 'JalKal+Building+Golghar+Gorakhpur',
    phone: '+91 98765 43210',
    image: '/images/showrooms/jalkal-building.webp',
  },
];

export default function DualStorefront({ contactPhone, showrooms }) {
  const storeList = (showrooms && Array.isArray(showrooms) && showrooms.length > 0)
    ? showrooms
    : STORES;

  return (
    <section id="showrooms" className="py-12 sm:py-24 bg-[#FAF7F2] border-t border-[#E8E1D5] relative overflow-hidden">
      <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 space-y-6 sm:space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
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

        {/* Dual Stores Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {storeList.map((store, index) => {
            const phone = contactPhone || store.phone;
            const waLink = getWhatsAppLink(phone, null, store.name);
            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${store.mapQuery || store.name}`;
            const storeImg = getFullImageUrl(store.image);

            return (
              <div
                key={store.id || index}
                className="rounded-2xl sm:rounded-3xl bg-white border border-[#E5DFD5] hover:border-brass-500/60 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-md hover:shadow-xl group"
              >
                {/* Store Visual & Badge */}
                <div className="relative h-48 sm:h-56 overflow-hidden bg-[#FAF7F2]">
                  <img
                    src={storeImg}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent"></div>

                  <div className="absolute top-3.5 sm:top-4 left-3.5 sm:left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-white/95 text-brass-800 border border-brass-600/30 shadow-sm backdrop-blur-md">
                      Store #{index + 1} • {index === 0 ? 'Baldev Plaza' : 'JalKal Building'}
                    </span>
                  </div>

                  <div className="absolute bottom-3 sm:bottom-3.5 left-3 sm:left-3.5 right-3 sm:right-3.5 p-3 sm:p-3.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 shadow-lg">
                    <h3 className="font-serif text-base sm:text-xl font-bold text-white drop-shadow-sm">
                      {store.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-brass-300 font-medium mt-0.5">
                      {store.tagline}
                    </p>
                  </div>
                </div>

                {/* Store Details Body */}
                <div className="p-4 sm:p-8 space-y-5 sm:space-y-6 flex-1 flex flex-col justify-between bg-white">
                  <div className="space-y-3 sm:space-y-4">
                    {/* Address & Landmark */}
                    <div className="flex items-start gap-2.5 sm:gap-3">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-brass-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-[#1A1A1A]">{store.address}</p>
                        <p className="text-[11px] sm:text-xs text-[#6B635B] mt-0.5">
                          Landmark: {store.landmark}
                        </p>
                      </div>
                    </div>

                    {/* Hours */}
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-brass-700 shrink-0" />
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-[#1A1A1A]">Showroom Hours</p>
                        <p className="text-[11px] sm:text-xs text-[#6B635B] mt-0.5">{store.hours}</p>
                      </div>
                    </div>

                    {/* Specialties List */}
                    <div className="pt-2 border-t border-[#E8E1D5] space-y-1.5 sm:space-y-2">
                      <p className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]">
                        Showroom Highlights:
                      </p>
                      <ul className="space-y-1 sm:space-y-1.5">
                        {(Array.isArray(store.specialties)
                          ? store.specialties
                          : typeof store.specialties === 'string' && store.specialties.trim().length > 0
                          ? store.specialties.split('\n').filter(Boolean)
                          : [
                              'Official Swiss collections (Tissot, Rado, Victorinox)',
                              'Japanese Automatics & Presage timepieces (Seiko, Citizen)',
                              'Luxury presentation boxes & collector timepieces',
                              'Watch battery, bracelet adjustment & precision servicing',
                            ]
                        ).map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-[11px] sm:text-xs text-[#4A433D]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-brass-700 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 sm:pt-4 border-t border-[#E8E1D5] flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3">
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#1A1A1A] border border-[#DDD5C7] hover:border-brass-600 transition-colors shadow-sm"
                    >
                      <Navigation className="w-3.5 h-3.5 text-brass-700" />
                      <span>Get Directions</span>
                    </a>

                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Store</span>
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
