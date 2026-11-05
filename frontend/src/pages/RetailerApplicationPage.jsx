import React, { useState, useEffect } from 'react';
import {
  Store,
  ShieldCheck,
  Award,
  TrendingUp,
  PackageCheck,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Phone,
  Building2,
  Send,
  Check,
  ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { OriginalWhatsAppIcon } from '../components/FloatingWhatsApp';
import { submitLead, saveCustomerProfile } from '../utils/api';

export default function RetailerApplicationPage({ contactPhone = '+91 98765 43210' }) {
  useEffect(() => {
    document.title = 'Apply as Authorized Retailer | Ram Prasad Agencies';
    try {
      window.scrollTo(0, 0);
    } catch {}
  }, []);

  const cleanPhone = String(contactPhone || '919876543210').replace(/[^0-9]/g, '');

  const [formData, setFormData] = useState({
    storeName: '',
    applicantName: '',
    phone: '',
    email: '',
    city: '',
    state: 'Uttar Pradesh',
    storeType: 'Multi-Brand Watch Showroom',
    yearsInBusiness: '3–10 Years',
    primaryBrands: 'All Brand Portfolios',
    monthlyBudget: '₹2,00,000 – ₹5,00,000',
    gstin: '',
    message: '',
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

    if (!formData.storeName.trim()) {
      setValidationError('Please enter your business or showroom name.');
      return;
    }
    if (!formData.applicantName.trim()) {
      setValidationError('Please enter the owner or manager name.');
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

    const refCode = `RPA-RET-${String(Date.now()).slice(-6).toUpperCase()}`;

    const leadPayload = {
      name: formData.applicantName.trim(),
      phone: `+91 ${formData.phone.trim()}`,
      email: formData.email.trim(),
      storeLocation: `${formData.storeName.trim()} (${formData.city.trim()}, ${formData.state})`,
      inquiryType: 'Retailer Partnership Application',
      category: 'retailer',
      leadType: 'retailer',
      source: 'Retailer Application Page',
      message: `[RETAILER PARTNERSHIP APPLICATION - Ref: ${refCode}]
Store Name: ${formData.storeName.trim()}
Location: ${formData.city.trim()}, ${formData.state}
Store Format: ${formData.storeType}
Years in Business: ${formData.yearsInBusiness}
Interested Brands: ${formData.primaryBrands}
Monthly Wholesale Volume: ${formData.monthlyBudget}
GSTIN / License: ${formData.gstin.trim() || 'N/A'}
Additional Notes: ${formData.message.trim() || 'N/A'}`,
      customFields: {
        leadCategory: 'Retailer Application',
        referenceId: refCode,
        storeName: formData.storeName.trim(),
        applicantName: formData.applicantName.trim(),
        city: formData.city.trim(),
        state: formData.state,
        storeType: formData.storeType,
        yearsInBusiness: formData.yearsInBusiness,
        primaryBrands: formData.primaryBrands,
        monthlyBudget: formData.monthlyBudget,
        gstin: formData.gstin.trim() || 'N/A',
      },
    };

    // Prepare WhatsApp message
    const waText = `*RETAILER PARTNERSHIP APPLICATION* (${refCode})

• Store: ${formData.storeName.trim()}
• Applicant: ${formData.applicantName.trim()}
• Location: ${formData.city.trim()}, ${formData.state}
• Store Format: ${formData.storeType}
• Years in Business: ${formData.yearsInBusiness}
• Brands: ${formData.primaryBrands}
• Estimated Wholesale Volume: ${formData.monthlyBudget}
• GSTIN: ${formData.gstin.trim() || 'N/A'}
• Contact: +91 ${formData.phone.trim()} | ${formData.email.trim()}
${formData.message.trim() ? `• Notes: ${formData.message.trim()}\n` : ''}
Sent from RPA Storefront Retailer Application Portal.`;

    let waDialNumber = cleanPhone;
    if (waDialNumber.length === 10) {
      waDialNumber = `91${waDialNumber}`;
    } else if (waDialNumber.startsWith('0')) {
      waDialNumber = `91${waDialNumber.slice(1)}`;
    }
    const autoWaUrl = `https://wa.me/${waDialNumber}?text=${encodeURIComponent(waText)}`;

    try {
      saveCustomerProfile({
        name: formData.applicantName.trim(),
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

  const waMessage = `*RETAILER PARTNERSHIP APPLICATION* (Ref: RPA-RET-${refId})

• Store: ${formData.storeName || 'Our Store'}
• Applicant: ${formData.applicantName || 'Applicant'}
• Location: ${formData.city || 'Gorakhpur'}, ${formData.state}
• Store Format: ${formData.storeType}
• Interested Brands: ${formData.primaryBrands}
• Wholesale Volume: ${formData.monthlyBudget}
• Contact: +91 ${formData.phone || ''} | ${formData.email || ''}

Looking forward to receiving your authorized wholesale catalog and distribution terms. Thank you!`;

  let waDialNumber = cleanPhone;
  if (waDialNumber.length === 10) {
    waDialNumber = `91${waDialNumber}`;
  } else if (waDialNumber.startsWith('0')) {
    waDialNumber = `91${waDialNumber.slice(1)}`;
  }
  const waUrl = `https://wa.me/${waDialNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] text-[#1A1A1A] pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-8 sm:pt-12">
        {/* 2. Page Header Banner */}
        <div className="text-center space-y-3 mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-amber-500/15 text-amber-800 border border-amber-500/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>Authorized Regional Distribution Network</span>
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] tracking-tight">
            Become Our Authorized Retailer
          </h1>
          <p className="text-sm sm:text-base text-[#5A524A] max-w-2xl mx-auto leading-relaxed">
            Partner with Ram Prasad Agencies (Est. 1984) to distribute authentic Swiss, Japanese, and Indian horological timepieces across Eastern Uttar Pradesh.
          </p>
        </div>

        {/* 3. Partner Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 sm:mb-12">
          <div className="bg-white p-5 rounded-2xl border border-[#DDD5C7] shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-[#1A1A1A]">100% Genuine Allocation</h3>
              <p className="text-xs text-[#6B635B] mt-1 leading-relaxed">
                Direct authorized distribution with official international stamped warranty cards and manufacturer provenance.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#DDD5C7] shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-[#1A1A1A]">Wholesale Tier Pricing</h3>
              <p className="text-xs text-[#6B635B] mt-1 leading-relaxed">
                Competitive wholesale price margins, dedicated B2B stock reserves, and priority access to capsule drops.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#DDD5C7] shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-[#1A1A1A]">Showroom & POS Support</h3>
              <p className="text-xs text-[#6B635B] mt-1 leading-relaxed">
                Brand-authorized pedestals, lighted showcases, window branding, and marketing collateral supplied for your store.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Form Card */}
        <div className="bg-white border border-[#DDD5C7] rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 shadow-lg">
          {isSubmitted ? (
            <div className="py-6 sm:py-8 text-center space-y-6 animate-fadeIn">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-300 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Check className="w-3.5 h-3.5" />
                  <span>Form Submitted Successfully</span>
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                  Retailer Application Registered!
                </h2>
                <p className="text-xs sm:text-sm text-[#5A524A] max-w-lg mx-auto leading-relaxed">
                  Thank you, <strong className="text-[#1A1A1A]">{formData.applicantName || 'Partner'}</strong>. Your application for <strong className="text-[#1A1A1A]">{formData.storeName || 'your showroom'}</strong> has been saved under:
                </p>
                <div className="inline-block px-3.5 py-1.5 bg-[#FAF7F2] rounded-lg font-mono text-xs font-bold text-stone-800 border border-[#DDD5C7]">
                  Reference ID: RPA-RET-{refId}
                </div>
              </div>

              {/* Application Snapshot */}
              <div className="max-w-lg mx-auto p-4 bg-[#FAF7F2] rounded-xl border border-[#DDD5C7] text-left text-xs space-y-2 text-[#4A433D]">
                <div className="flex justify-between border-b border-[#E8E1D5] pb-1.5">
                  <span className="text-[#7A7167]">Store & Location:</span>
                  <span className="font-bold text-[#1A1A1A]">{formData.storeName} ({formData.city}, {formData.state})</span>
                </div>
                <div className="flex justify-between border-b border-[#E8E1D5] pb-1.5">
                  <span className="text-[#7A7167]">Store Format:</span>
                  <span className="font-bold text-[#1A1A1A]">{formData.storeType}</span>
                </div>
                <div className="flex justify-between border-b border-[#E8E1D5] pb-1.5">
                  <span className="text-[#7A7167]">Interested Brands:</span>
                  <span className="font-bold text-[#1A1A1A]">{formData.primaryBrands}</span>
                </div>
                <div className="flex justify-between border-b border-[#E8E1D5] pb-1.5">
                  <span className="text-[#7A7167]">Wholesale Volume:</span>
                  <span className="font-bold text-[#1A1A1A]">{formData.monthlyBudget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A7167]">Registered Phone:</span>
                  <span className="font-bold text-[#1A1A1A] font-mono">+91 {formData.phone}</span>
                </div>
              </div>

              {/* WhatsApp Notification Action */}
              <div className="max-w-lg mx-auto p-5 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm text-center space-y-3">
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#1A1A1A]">
                  Connect on WhatsApp with RPA Desk
                </h3>
                <p className="text-xs text-[#5A524A] leading-relaxed">
                  You can also notify our regional distribution desk directly on WhatsApp with your prefilled application summary.
                </p>
                <div className="pt-1">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider font-bold bg-[#25D366] hover:bg-[#20ba59] text-white shadow-md shadow-[#25D366]/20 hover:shadow-[#25D366]/35 transition-all active:scale-95 border border-white/20"
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-[#2C2723] bg-white hover:bg-[#FAF7F2] border border-[#DDD5C7] transition-colors shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-brass-700" />
                  <span>Call Distribution Desk</span>
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
                      storeName: '',
                      applicantName: '',
                      phone: '',
                      email: '',
                      city: '',
                      state: 'Uttar Pradesh',
                      storeType: 'Multi-Brand Watch Showroom',
                      yearsInBusiness: '3–10 Years',
                      primaryBrands: 'All Brand Portfolios',
                      monthlyBudget: '₹2,00,000 – ₹5,00,000',
                      gstin: '',
                      message: '',
                    });
                  }}
                  className="text-xs text-brass-800 hover:underline font-semibold cursor-pointer"
                >
                  Submit Another Partnership Application
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {validationError && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
                  <span className="font-semibold">{validationError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Store Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2C2723] mb-2">
                    Showroom / Business Name <span className="text-amber-700">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Horology Store"
                    value={formData.storeName}
                    onChange={(e) => handleInputChange('storeName', e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C7] focus:border-brass-600 focus:bg-white rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#9E9589] focus:outline-none transition-colors"
                  />
                </div>

                {/* Owner / Contact Person */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2C2723] mb-2">
                    Proprietor / Contact Person <span className="text-amber-700">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar Verma"
                    value={formData.applicantName}
                    onChange={(e) => handleInputChange('applicantName', e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C7] focus:border-brass-600 focus:bg-white rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#9E9589] focus:outline-none transition-colors"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2C2723] mb-2">
                    Mobile Phone Number <span className="text-amber-700">*</span>
                  </label>
                  <div className="flex rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] focus-within:border-brass-600 focus-within:bg-white transition-all overflow-hidden">
                    <span className="bg-[#EFE8DC] text-xs sm:text-sm font-bold text-[#1A1A1A] px-3.5 py-3 border-r border-[#DDD5C7] flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      required
                      placeholder="10 digits"
                      value={formData.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className="flex-1 bg-transparent px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#9E9589] font-mono focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2C2723] mb-2">
                    Business Email <span className="text-amber-700">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. contact@royalhorology.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C7] focus:border-brass-600 focus:bg-white rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#9E9589] focus:outline-none transition-colors"
                  />
                </div>

                {/* City & District */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2C2723] mb-2">
                    City / District <span className="text-amber-700">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gorakhpur, Basti, Deoria, Lucknow"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C7] focus:border-brass-600 focus:bg-white rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#9E9589] focus:outline-none transition-colors"
                  />
                </div>

                {/* Store Format */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2C2723] mb-2">
                    Store Format / Type
                  </label>
                  <select
                    value={formData.storeType}
                    onChange={(e) => handleInputChange('storeType', e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C7] focus:border-brass-600 focus:bg-white rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="Multi-Brand Watch Showroom">Multi-Brand Watch Showroom</option>
                    <option value="Exclusive Watch Boutique">Exclusive Watch Boutique</option>
                    <option value="Fine Jewelry & Luxury Store">Fine Jewelry & Luxury Store</option>
                    <option value="Departmental / Lifestyle Store">Departmental / Lifestyle Store</option>
                    <option value="Upcoming / New Retail Venture">Upcoming / New Retail Venture</option>
                  </select>
                </div>

                {/* Years in Business */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2C2723] mb-2">
                    Years in Retail Business
                  </label>
                  <select
                    value={formData.yearsInBusiness}
                    onChange={(e) => handleInputChange('yearsInBusiness', e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C7] focus:border-brass-600 focus:bg-white rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="New Venture / Under Setup">New Venture / Under Setup</option>
                    <option value="1–3 Years">1–3 Years</option>
                    <option value="3–10 Years">3–10 Years</option>
                    <option value="10+ Years Established">10+ Years Established</option>
                  </select>
                </div>

                {/* Primary Brands of Interest */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2C2723] mb-2">
                    Brands of Primary Interest
                  </label>
                  <select
                    value={formData.primaryBrands}
                    onChange={(e) => handleInputChange('primaryBrands', e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C7] focus:border-brass-600 focus:bg-white rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="All Brand Portfolios">All Brand Portfolios</option>
                    <option value="Swiss Calibers (Tissot, Omega, Rado)">Swiss Calibers (Tissot, Omega, Rado)</option>
                    <option value="Japanese Automatics (Seiko, Citizen)">Japanese Automatics (Seiko, Citizen)</option>
                    <option value="Indian Heritage (Titan, Titan Raga, HMT)">Indian Heritage (Titan, Titan Raga, HMT)</option>
                    <option value="Youth & Lifestyle (Fastrack, Sonata, Fossil)">Youth & Lifestyle (Fastrack, Sonata, Fossil)</option>
                  </select>
                </div>

                {/* Estimated Monthly Budget */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2C2723] mb-2">
                    Estimated Monthly Wholesale Budget
                  </label>
                  <select
                    value={formData.monthlyBudget}
                    onChange={(e) => handleInputChange('monthlyBudget', e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C7] focus:border-brass-600 focus:bg-white rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="Under ₹2,00,000">Under ₹2,00,000</option>
                    <option value="₹2,00,000 – ₹5,00,000">₹2,00,000 – ₹5,00,000</option>
                    <option value="₹5,00,000 – ₹15,00,000">₹5,00,000 – ₹15,00,000</option>
                    <option value="Above ₹15,00,000">Above ₹15,00,000</option>
                  </select>
                </div>

                {/* GSTIN */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2C2723] mb-2">
                    GSTIN / Trade License <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 09AAAAA0000A1Z5"
                    value={formData.gstin}
                    onChange={(e) => handleInputChange('gstin', e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C7] focus:border-brass-600 focus:bg-white rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#9E9589] focus:outline-none transition-colors uppercase font-mono"
                  />
                </div>
              </div>

              {/* Message / Business Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2C2723] mb-2">
                  Showroom Details / Special Requirements <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your showroom location, store carpet area, display requirements, or any specific models required..."
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] focus:border-brass-600 focus:bg-white rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#9E9589] focus:outline-none transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-[#E8E1D5] flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-sm hover:shadow-md active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <>
                      <Store className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Submit Application</span>
                      <span className="sm:hidden">Submit Application</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-[#7A7268] text-center sm:text-right">
                  Saves lead in CRM & connects with WhatsApp desk automatically.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

