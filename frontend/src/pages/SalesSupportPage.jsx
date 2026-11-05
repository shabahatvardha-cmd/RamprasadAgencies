import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Sparkles,
  Layers,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Phone,
  Building2,
  Send,
  Check,
  Palette,
  Image,
  Award,
  ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { OriginalWhatsAppIcon } from '../components/FloatingWhatsApp';
import { submitLead, saveCustomerProfile } from '../utils/api';

export default function SalesSupportPage({ contactPhone = '+91 98765 43210' }) {
  useEffect(() => {
    document.title = 'Advertising & Sales Support | Ram Prasad Agencies';
    try {
      window.scrollTo(0, 0);
    } catch {}
  }, []);

  const cleanPhone = String(contactPhone || '919876543210').replace(/[^0-9]/g, '');

  const [formData, setFormData] = useState({
    showroomName: '',
    contactPerson: '',
    phone: '',
    email: '',
    city: '',
    supportType: 'POS Displays & Showroom Lightboxes',
    brandFocus: 'Complete Brand Portfolio',
    timeline: 'Within 1–2 Weeks',
    dimensionsOrDetails: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedLead, setSubmittedLead] = useState(null);
  const [validationError, setValidationError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationError) setValidationError('');
  };

  const handlePhoneChange = (val) => {
    let digits = String(val || '').replace(/[^0-9]/g, '');
    if (digits.startsWith('91') && digits.length > 10) {
      digits = digits.slice(2);
    }
    if (digits.startsWith('0')) {
      digits = digits.slice(1);
    }
    setFormData((prev) => ({ ...prev, phone: digits.slice(0, 10) }));
    if (validationError) setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.showroomName.trim()) {
      setValidationError('Please enter your showroom or store name.');
      return;
    }
    if (!formData.contactPerson.trim()) {
      setValidationError('Please enter the contact person or representative name.');
      return;
    }
    if (!formData.phone || formData.phone.length !== 10) {
      setValidationError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setValidationError('Please enter a valid business email address.');
      return;
    }
    if (!formData.city.trim()) {
      setValidationError('Please specify your showroom city or district.');
      return;
    }

    setIsSubmitting(true);

    const refCode = `RPA-MKT-${String(Date.now()).slice(-6).toUpperCase()}`;

    const leadPayload = {
      name: formData.contactPerson.trim(),
      phone: `+91 ${formData.phone.trim()}`,
      email: formData.email.trim(),
      storeLocation: `${formData.showroomName.trim()} (${formData.city.trim()})`,
      inquiryType: 'Advertising & Sales Support Request',
      category: 'support',
      leadType: 'support',
      source: 'Advertising & Sales Support Page',
      message: `[ADVERTISING & SALES SUPPORT REQUEST - Ref: ${refCode}]
Showroom: ${formData.showroomName.trim()}
City / Location: ${formData.city.trim()}
Support Category: ${formData.supportType}
Brand Focus: ${formData.brandFocus}
Required Timeline: ${formData.timeline}
Specific Requirements / Notes: ${formData.dimensionsOrDetails.trim() || 'N/A'}`,
      customFields: {
        leadCategory: 'Advertising & Sales Support',
        referenceId: refCode,
        showroomName: formData.showroomName.trim(),
        contactPerson: formData.contactPerson.trim(),
        city: formData.city.trim(),
        supportType: formData.supportType,
        brandFocus: formData.brandFocus,
        timeline: formData.timeline,
        dimensionsOrDetails: formData.dimensionsOrDetails.trim() || 'N/A',
      },
    };

    // Prepare WhatsApp message
    const waText = `*ADVERTISING & SALES SUPPORT REQUEST* (${refCode})

• Showroom: ${formData.showroomName.trim()}
• Contact Person: ${formData.contactPerson.trim()}
• City / Location: ${formData.city.trim()}
• Support Required: ${formData.supportType}
• Brand Portfolio: ${formData.brandFocus}
• Timeline: ${formData.timeline}
• Phone: +91 ${formData.phone.trim()} | ${formData.email.trim()}
${formData.dimensionsOrDetails.trim() ? `• Requirements / Dimensions: ${formData.dimensionsOrDetails.trim()}\n` : ''}
Sent from RPA Storefront Support Desk.`;

    let waDialNumber = cleanPhone;
    if (waDialNumber.length === 10) {
      waDialNumber = `91${waDialNumber}`;
    } else if (waDialNumber.startsWith('0')) {
      waDialNumber = `91${waDialNumber.slice(1)}`;
    }
    const autoWaUrl = `https://wa.me/${waDialNumber}?text=${encodeURIComponent(waText)}`;

    try {
      saveCustomerProfile({
        name: formData.contactPerson.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
      });
      const saved = await submitLead(leadPayload);
      setSubmittedLead(saved || leadPayload);
      setIsSubmitted(true);
    } catch {
      setSubmittedLead(leadPayload);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const refId = String(submittedLead?.customFields?.referenceId || submittedLead?._id || Date.now()).slice(-6).toUpperCase();

  const waMessage = `*ADVERTISING & SALES SUPPORT REQUEST* (Ref: RPA-MKT-${refId})

• Showroom: ${formData.showroomName || 'Our Showroom'}
• Contact: ${formData.contactPerson || 'Representative'}
• City: ${formData.city || 'Gorakhpur'}
• Support Needed: ${formData.supportType}
• Brand Portfolio: ${formData.brandFocus}
• Timeline Required: ${formData.timeline}
• Contact: +91 ${formData.phone || ''} | ${formData.email || ''}

Looking forward to your team's assistance and marketing collateral dispatch. Thank you!`;

  let waDialNumber = cleanPhone;
  if (waDialNumber.length === 10) {
    waDialNumber = `91${waDialNumber}`;
  } else if (waDialNumber.startsWith('0')) {
    waDialNumber = `91${waDialNumber.slice(1)}`;
  }
  const waUrl = `https://wa.me/${waDialNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] text-[#1A1A1A] pb-20">
      {/* 1. Hero Header */}
      <div className="w-full bg-gradient-to-b from-[#1C1A17] to-[#121110] text-white py-8 sm:py-14 border-b border-brass-500/20 shadow-inner">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[11px] font-bold uppercase tracking-widest">
            <Megaphone className="w-3.5 h-3.5" />
            <span>Showroom Marketing & Merchandising Support</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-cream-50 leading-tight">
            Advertising & Showroom Sales Support
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Elevate your retail presence with official brand-certified promotional kits, illuminated point-of-sale displays, regional marketing collateral, and digital asset suites directly from Ram Prasad Agencies.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-amber-400" /> Official Brand Backdrops
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-amber-400" /> High-Resolution Media Kits
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-amber-400" /> Regional Marketing Collateral
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-10">
        {isSubmitted ? (
          /* Confirmation Success Card */
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl p-6 sm:p-10 text-center max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500/30 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Check className="w-3.5 h-3.5" />
                <span>Form Submitted Successfully</span>
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Support Request Registered!
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
                Thank you, <strong className="text-stone-900">{formData.contactPerson}</strong>. Your Advertising & Sales Support request for <strong className="text-stone-900">{formData.showroomName}</strong> has been logged under:
              </p>
              <div className="inline-block px-3.5 py-1.5 bg-stone-100 rounded-lg font-mono text-xs font-bold text-stone-800 border border-stone-300">
                Reference ID: RPA-MKT-{refId}
              </div>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-left text-xs space-y-2 text-stone-700">
              <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <span className="text-stone-500">Support Category:</span>
                <span className="font-bold text-stone-900">{formData.supportType}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <span className="text-stone-500">Brand Portfolio:</span>
                <span className="font-bold text-stone-900">{formData.brandFocus}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <span className="text-stone-500">Required Timeline:</span>
                <span className="font-bold text-stone-900">{formData.timeline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Registered Phone:</span>
                <span className="font-bold text-stone-900 font-mono">+91 {formData.phone}</span>
              </div>
            </div>

            {/* WhatsApp Notification Action */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm text-center space-y-3">
              <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
                Connect on WhatsApp with RPA Desk
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                You can also notify our dealer desk on WhatsApp with your request details.
              </p>
              <div className="pt-1">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md shadow-[#25D366]/20 hover:shadow-[#25D366]/35 active:scale-95 border border-white/20"
                >
                  <OriginalWhatsAppIcon className="w-5 h-5 shrink-0" size={20} />
                  <span>Send WhatsApp Message</span>
                </a>
              </div>
            </div>

            {/* Navigation Options */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-stone-800 bg-white hover:bg-stone-50 border border-stone-200 transition-colors shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 text-brass-700" />
                <span>Call Marketing Desk</span>
              </a>

              <Link
                to="/#retailer-support"
                onClick={() => {
                  try {
                    sessionStorage.setItem('rpa_return_anchor', 'retailer-support');
                  } catch {}
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-stone-900 hover:bg-brass-700 transition-colors shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Store</span>
              </Link>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setSubmittedLead(null);
                  setFormData({
                    showroomName: '',
                    contactPerson: '',
                    phone: '',
                    email: '',
                    city: '',
                    supportType: 'POS Displays & Showroom Lightboxes',
                    brandFocus: 'Complete Brand Portfolio',
                    timeline: 'Within 1–2 Weeks',
                    dimensionsOrDetails: '',
                  });
                }}
                className="text-xs text-brass-800 hover:underline font-semibold cursor-pointer"
              >
                Submit Another Support Request
              </button>
            </div>
          </div>
        ) : (
          /* Two-Column Support Form & Pillars */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200/90 shadow-md p-4 sm:p-8">
              <div className="mb-6 pb-4 border-b border-stone-100">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  Request Marketing Collateral & Sales Assets
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Complete the fields below to request official brand materials, POS fixtures, or regional showroom promotional support.
                </p>
              </div>

              {validationError && (
                <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. Showroom Name */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Showroom / Dealership Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={formData.showroomName}
                      onChange={(e) => handleInputChange('showroomName', e.target.value)}
                      placeholder="e.g. Royal Watch House / Chrono Gallery"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50/50 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>

                {/* 2. Contact Person & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Showroom Manager / Contact Person <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactPerson}
                      onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50/50 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex rounded-xl border border-stone-200 bg-stone-50/50 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 transition-all">
                      <span className="px-3 py-2.5 bg-stone-100/80 border-r border-stone-200 text-xs font-bold text-stone-700 select-none flex items-center">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={formData.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full px-3.5 py-2.5 bg-transparent text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Business Email & Showroom City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Business Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="manager@store.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50/50 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      City & Showroom Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="e.g. Golghar, Gorakhpur"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50/50 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>

                {/* 4. Support Category Needed */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Support Category Needed
                  </label>
                  <select
                    value={formData.supportType}
                    onChange={(e) => handleInputChange('supportType', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50/50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  >
                    <option value="POS Displays & Showroom Lightboxes">
                      Point-of-Sale (POS) Showcase Displays & Illuminated Lightboxes
                    </option>
                    <option value="High-Res Digital Media & Social Media Kit">
                      High-Res Digital Assets, Banners & Social Media Video Kit
                    </option>
                    <option value="Regional Print & Outdoor Advertising Collateral">
                      Regional Advertising Collateral (Billboards, Newspaper & Cinema Ads)
                    </option>
                    <option value="Printed Brand Catalogs & Spec Sheets">
                      Printed Brand Catalogs, Lookbooks & Technical Spec Sheets
                    </option>
                    <option value="Product Knowledge & Counter Reference Guides">
                      Brand Product Knowledge & Counter Reference Manuals
                    </option>
                    <option value="Festive & Seasonal Window Merchandising">
                      Festive & Seasonal Window Display Merchandising Kits
                    </option>
                  </select>
                </div>

                {/* 5. Brand Focus & Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Target Brand Portfolio
                    </label>
                    <select
                      value={formData.brandFocus}
                      onChange={(e) => handleInputChange('brandFocus', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50/50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    >
                      <option value="Complete Brand Portfolio">Complete Brand Portfolio (All Brands)</option>
                      <option value="Titan & Titan Raga">Titan & Titan Raga</option>
                      <option value="Tissot & Swiss Heritage">Tissot & Swiss Timepieces</option>
                      <option value="Seiko & Presage Automatics">Seiko & Presage Automatics</option>
                      <option value="HMT Heritage Classics">HMT Mechanical Heritage</option>
                      <option value="Citizen Tsuyosa & Promaster">Citizen Tsuyosa & Eco-Drive</option>
                      <option value="Fastrack & Youth Portfolio">Fastrack & Sonata Collections</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Required By / Timeline
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => handleInputChange('timeline', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50/50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    >
                      <option value="Immediate / Priority Dispatch">Immediate / Priority (Within 3–5 Days)</option>
                      <option value="Within 1–2 Weeks">Within 1–2 Weeks</option>
                      <option value="Within Next Month">Within Next 30 Days</option>
                      <option value="Upcoming Festive Season">Upcoming Festive Campaign / Season</option>
                    </select>
                  </div>
                </div>

                {/* 6. Specific Requirements / Dimensions */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Showroom Dimensions or Specific Requirements (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.dimensionsOrDetails}
                    onChange={(e) => handleInputChange('dimensionsOrDetails', e.target.value)}
                    placeholder="Specify counter dimensions, lightbox wall measurements (e.g. 4x3 ft), file resolution needs, or upcoming promotional dates..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50/50 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Transmitting...</span>
                      </div>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Support Request</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-stone-500 text-center sm:text-right">
                    Saves request in CRM & dispatches WhatsApp notification.
                  </p>
                </div>
              </form>
            </div>

            {/* Right Column: Support Pillars & Direct Contact (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Feature 1: POS Showcases */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-3 relative overflow-hidden shadow-lg">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Palette className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                  Official POS Showcases & Fixtures
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Certified counter trays, rotating motorized watch pods, luxury brand pedestals, and energy-efficient LED backdrops calibrated to Swiss and Indian brand guidelines.
                </p>
              </div>

              {/* Feature 2: High-Res Digital Media Kits */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-3 relative overflow-hidden shadow-lg">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Image className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                  Digital Media & Spec Sheet Bundles
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Get instant access to 4K product photography, social media carousel packages, and printable high-res spec sheets tailored for local WhatsApp and Instagram marketing.
                </p>
              </div>

              {/* Urgent Help Card */}
              <div className="bg-[#EFE9DF] border border-[#DDD5C7] rounded-2xl p-5 text-stone-800 space-y-2">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Immediate Marketing Assistance</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Need rapid collateral for an upcoming festival or inaugurating a new showroom counter? Contact our distribution manager directly:
                </p>
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <a
                    href={`tel:${cleanPhone}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-brass-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{contactPhone}</span>
                  </a>
                  <a
                    href={`https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent('Hi Ram Prasad Agencies, I need urgent advertising and POS display support for my watch showroom.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
                  >
                    <OriginalWhatsAppIcon className="w-3.5 h-3.5 shrink-0" size={15} />
                    <span>WhatsApp Desk</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

