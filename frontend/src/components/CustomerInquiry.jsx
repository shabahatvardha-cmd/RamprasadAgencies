import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, MessageCircle, Clock, ShieldCheck, Sparkles, Phone, Loader2, Store, AlertCircle, Check } from 'lucide-react';
import { getWhatsAppLink, submitLead } from '../utils/api';
import { useStore, DEFAULT_INQUIRY_FORM_CONFIG } from '../context/StoreContext';

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+1-CA', country: 'Canada', flag: '🇨🇦', display: '+1' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦' },
  { code: '+965', country: 'Kuwait', flag: '🇰🇼' },
  { code: '+977', country: 'Nepal', flag: '🇳🇵' },
  { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
];

export default function CustomerInquiry({ contactPhone, inquiryTitle, inquirySubtitle }) {
  const storeContext = useStore();
  const storeData = storeContext?.storeData || {};

  // Form configuration from Admin Builder
  const formConfig = storeData.inquiryFormConfig || DEFAULT_INQUIRY_FORM_CONFIG;
  const sectionBadge = formConfig.badge || 'Bespoke Concierge';
  const sectionTitle = inquiryTitle || formConfig.title || 'Custom Sourcing & Horology Inquiries';
  const sectionSubtitle =
    inquirySubtitle ||
    formConfig.subtitle ||
    'Seeking a specific imported reference number, limited edition release, or looking to schedule an in-store viewing at Baldev Plaza or JalKal Building? Share your details with our horology team.';
  const submitButtonText = formConfig.submitButtonText || 'Submit Inquiry to Showroom';
  const successMessage =
    formConfig.successMessage ||
    'Your consultation request has been registered with Ram Prasad Agencies concierge. Our showroom specialist will reach out shortly.';

  // Active fields list configured by admin
  const configuredFields = (formConfig.fields && Array.isArray(formConfig.fields) && formConfig.fields.length > 0)
    ? formConfig.fields
    : DEFAULT_INQUIRY_FORM_CONFIG.fields;

  const activeFields = configuredFields.filter((f) => f.enabled !== false);

  // Country code state (defaults to India +91)
  const [countryCode, setCountryCode] = useState('+91');

  // Form values state map (field.id => value)
  const [formAnswers, setFormAnswers] = useState(() => {
    const initial = {};
    activeFields.forEach((field) => {
      if (field.type === 'select' && field.options && field.options.length > 0) {
        initial[field.id] = field.options[0];
      } else {
        initial[field.id] = '';
      }
    });
    return initial;
  });

  // Ensure newly added fields get default values if state hasn't captured them
  useEffect(() => {
    setFormAnswers((prev) => {
      const next = { ...prev };
      activeFields.forEach((field) => {
        if (next[field.id] === undefined) {
          if (field.type === 'select' && field.options && field.options.length > 0) {
            next[field.id] = field.options[0];
          } else {
            next[field.id] = '';
          }
        }
      });
      return next;
    });
  }, [configuredFields]);

  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedLead, setSubmittedLead] = useState(null);

  const handleInputChange = (fieldId, value) => {
    setFormAnswers((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    if (validationError) setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields strictly (especially 10-digit numeric phone)
    for (const field of activeFields) {
      if (field.id === 'phone' || field.type === 'tel') {
        const rawVal = formAnswers[field.id] || '';
        const digits = String(rawVal).replace(/\D/g, '');

        if (field.required && !digits) {
          setValidationError(`Please enter your 10-digit mobile number for "${field.label}".`);
          return;
        }

        if (digits && digits.length !== 10) {
          setValidationError(
            `Mobile / WhatsApp number must be exactly 10 numeric digits. Currently ${digits.length} digits entered.`
          );
          return;
        }
      } else if (field.required) {
        const val = formAnswers[field.id];
        if (!val || (typeof val === 'string' && !val.trim())) {
          setValidationError(`Please fill out the required field: "${field.label}"`);
          return;
        }
      }
    }

    const customerName = (formAnswers.name || 'Valued Customer').trim();
    const phoneDigits = String(formAnswers.phone || '').replace(/\D/g, '');
    const cleanDialCode = countryCode.replace('-CA', '');
    const fullPhoneNumber = phoneDigits ? `${cleanDialCode} ${phoneDigits}` : '';
    const customerEmail = (formAnswers.email || '').trim();
    const storeLocation = formAnswers.storeLocation || 'Baldev Plaza Flagship Showroom, Golghar';
    const inquiryType = formAnswers.inquiryType || 'Buy / Inquire Specific Watch';
    const message = (formAnswers.message || '').trim();

    // Collect custom inputs added by the admin
    const customFieldsAnswers = {};
    activeFields.forEach((field) => {
      if (!field.isSystem) {
        customFieldsAnswers[field.label] = formAnswers[field.id] || '';
      }
    });

    setIsSubmitting(true);
    setValidationError('');

    try {
      const leadPayload = {
        name: customerName,
        phone: fullPhoneNumber,
        email: customerEmail,
        storeLocation: storeLocation,
        inquiryType: inquiryType,
        message: message,
        customFields: customFieldsAnswers,
        source: 'Storefront Inquiry Form',
      };

      const savedLead = await submitLead(leadPayload);
      setSubmittedLead(savedLead);

      // Broadcast new lead in real-time to open Admin Panels
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        try {
          const channel = new BroadcastChannel('fossil_store_realtime_sync');
          channel.postMessage({
            type: 'NEW_LEAD',
            lead: savedLead,
            timestamp: Date.now(),
          });
          channel.close();
        } catch {
          // ignore
        }
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error('Lead submission error:', err);
      // Fallback display if network issue
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compile WhatsApp message string with all answers
  const customerName = formAnswers.name || 'Customer';
  const cleanDialCode = countryCode.replace('-CA', '');
  const phoneDigits = String(formAnswers.phone || '').replace(/\D/g, '');
  const fullPhoneDisplay = phoneDigits ? `${cleanDialCode} ${phoneDigits}` : '';
  const chosenStore = formAnswers.storeLocation || 'Baldev Plaza Flagship Showroom, Golghar';
  const chosenInquiry = formAnswers.inquiryType || 'Luxury Watch Consultation';
  const customerMsg = formAnswers.message || '';

  let customAnswersText = '';
  activeFields.forEach((field) => {
    if (!field.isSystem && formAnswers[field.id]) {
      customAnswersText += `%0A*${encodeURIComponent(field.label)}:* ${encodeURIComponent(formAnswers[field.id])}`;
    }
  });

  const customWhatsAppMessage = `Hello Ram Prasad Agencies,%0A%0A*Showroom Lead Reference:* RPA-${String(submittedLead?._id || Date.now()).slice(-6).toUpperCase()}%0A*Name:* ${encodeURIComponent(customerName)}%0A*Mobile / WhatsApp:* ${encodeURIComponent(fullPhoneDisplay)}%0A*Preferred Showroom:* ${encodeURIComponent(chosenStore)}%0A*Inquiry Nature:* ${encodeURIComponent(chosenInquiry)}${customAnswersText}%0A*Notes:* ${encodeURIComponent(customerMsg || 'General Luxury Timepiece Consultation')}`;

  const cleanPhone = (contactPhone || '9876543210').replace(/[^0-9]/g, '');
  const waDirectUrl = `https://wa.me/91${cleanPhone.slice(-10)}?text=${customWhatsAppMessage}`;

  return (
    <section id="inquiry" className="py-12 sm:py-24 bg-[#F5F2EB] relative overflow-hidden border-t border-[#E8E1D5]">
      <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brass-500/10 border border-brass-500/30 text-brass-800 text-[11px] sm:text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-brass-700" />
              <span>{sectionBadge}</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] leading-tight">
              {sectionTitle}
            </h2>

            <p className="text-xs sm:text-sm text-[#6B635B] leading-relaxed">
              {sectionSubtitle}
            </p>

            <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-[#E8E1D5]">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <Store className="w-4 h-4 sm:w-5 sm:h-5 text-brass-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#1A1A1A]">Dual Flagships in Gorakhpur</h4>
                  <p className="text-[11px] sm:text-xs text-[#6B635B] mt-0.5">
                    Select your preferred showroom destination: Baldev Plaza or JalKal Building, Golghar.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 sm:gap-3">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-brass-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#1A1A1A]">Genuine Brand Sourcing</h4>
                  <p className="text-[11px] sm:text-xs text-[#6B635B] mt-0.5">
                    Authentic imported timepieces backed by official stamped international manufacturer warranty cards.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 sm:gap-3">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-brass-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#1A1A1A]">Rapid Response Concierge</h4>
                  <p className="text-[11px] sm:text-xs text-[#6B635B] mt-0.5">
                    Inquiries are answered within 30 minutes during showroom hours (10:30 AM – 9:00 PM, All 7 Days).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <div className="p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-white border border-[#DDD5C7] shadow-xl relative">
              {isSubmitted ? (
                <div className="text-center py-6 sm:py-8 space-y-5 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-brass-500/10 text-brass-800 border border-brass-600/30">
                      Lead ID: RPA-{String(submittedLead?._id || Date.now()).slice(-6).toUpperCase()}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                      Showroom Consultation Request Registered
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5A524A] max-w-md mx-auto">
                      Thank you, <strong>{customerName}</strong>. {successMessage}
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="max-w-md mx-auto p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E1D5] text-left text-xs space-y-2 font-sans">
                    <div className="flex justify-between text-[#6B635B] border-b border-[#E8E1D5] pb-1.5">
                      <span>Showroom Destination:</span>
                      <strong className="text-[#1A1A1A]">{chosenStore}</strong>
                    </div>

                    <div className="flex justify-between text-[#6B635B] border-b border-[#E8E1D5] pb-1.5">
                      <span>Contact Mobile / WhatsApp:</span>
                      <strong className="text-[#1A1A1A] font-mono">{fullPhoneDisplay}</strong>
                    </div>

                    <div className="flex justify-between text-[#6B635B] border-b border-[#E8E1D5] pb-1.5">
                      <span>Consultation Type:</span>
                      <strong className="text-[#1A1A1A]">{chosenInquiry}</strong>
                    </div>

                    {/* Custom Answers Summary */}
                    {activeFields
                      .filter((f) => !f.isSystem && formAnswers[f.id])
                      .map((f) => (
                        <div key={f.id} className="flex justify-between text-[#6B635B] border-b border-[#E8E1D5] pb-1.5">
                          <span>{f.label}:</span>
                          <strong className="text-[#1A1A1A] text-right">{String(formAnswers[f.id])}</strong>
                        </div>
                      ))}

                    {customerMsg && (
                      <div className="pt-1 text-[11px] text-[#6B635B]">
                        <span className="font-semibold text-[#1A1A1A]">Specific Model / Notes: </span>
                        {customerMsg}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={waDirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider font-bold bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-lg transition-all active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Forward Directly to WhatsApp</span>
                    </a>

                    <a
                      href={`tel:${cleanPhone}`}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-xs font-bold text-[#2C2723] bg-white hover:bg-[#F2ECE1] border border-[#DDD5C7] shadow-sm transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-brass-700" />
                      <span>Call Concierge</span>
                    </a>
                  </div>

                  <div>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setSubmittedLead(null);
                        setFormAnswers(() => {
                          const reset = {};
                          activeFields.forEach((field) => {
                            if (field.type === 'select' && field.options && field.options.length > 0) {
                              reset[field.id] = field.options[0];
                            } else {
                              reset[field.id] = '';
                            }
                          });
                          return reset;
                        });
                      }}
                      className="text-xs text-[#8C847A] hover:text-[#1A1A1A] underline transition-colors"
                    >
                      Submit Another Showroom Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  {validationError && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2.5 animate-fade-in shadow-sm">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
                      <span className="font-medium">{validationError}</span>
                    </div>
                  )}

                  {/* Dynamic Form Field Rendering */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {activeFields.map((field) => {
                      const isFullWidth = field.type === 'textarea';
                      const isPhoneField = field.id === 'phone' || field.type === 'tel';
                      const value = formAnswers[field.id] !== undefined ? formAnswers[field.id] : '';

                      return (
                        <div
                          key={field.id}
                          className={isFullWidth ? 'sm:col-span-2' : ''}
                        >
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#2C2723] mb-2">
                            {field.label} {field.required && <span className="text-amber-700">*</span>}
                          </label>

                          {field.type === 'select' ? (
                            <select
                              value={value}
                              required={Boolean(field.required)}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              className="w-full bg-[#FAF7F2] border border-[#DDD5C7] focus:border-brass-600 focus:bg-white rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none transition-colors cursor-pointer"
                            >
                              {(field.options || []).map((opt, i) => (
                                <option key={i} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : field.type === 'textarea' ? (
                            <textarea
                              rows={3}
                              required={Boolean(field.required)}
                              placeholder={field.placeholder || ''}
                              value={value}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              className="w-full bg-[#FAF7F2] border border-[#DDD5C7] focus:border-brass-600 focus:bg-white rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#9E9589] focus:outline-none transition-colors resize-none leading-relaxed"
                            />
                          ) : isPhoneField ? (
                            /* Enforced 10-Digit Numeric Phone Input with Country Code */
                            <div className="space-y-1">
                              <div className="flex rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] focus-within:border-brass-600 focus-within:bg-white transition-all overflow-hidden shadow-sm">
                                {/* Country Code Dropdown */}
                                <select
                                  value={countryCode}
                                  onChange={(e) => setCountryCode(e.target.value)}
                                  className="bg-[#EFE8DC] hover:bg-[#E8DEC0] text-xs sm:text-sm font-bold text-[#1A1A1A] pl-2.5 pr-2 py-3 border-r border-[#DDD5C7] focus:outline-none cursor-pointer"
                                  title="Select Country Dial Code"
                                >
                                  {COUNTRY_CODES.map((c) => (
                                    <option key={c.code + c.country} value={c.code}>
                                      {c.flag} {c.display || c.code} ({c.country})
                                    </option>
                                  ))}
                                </select>

                                {/* Strict 10-Digit Numeric Input */}
                                <input
                                  type="tel"
                                  inputMode="numeric"
                                  pattern="[0-9]{10}"
                                  maxLength={10}
                                  required={Boolean(field.required)}
                                  placeholder="98765 43210 (10 digits)"
                                  value={value}
                                  onPaste={(e) => {
                                    e.preventDefault();
                                    const pasteData = (e.clipboardData || window.clipboardData).getData('text') || '';
                                    const digits = pasteData.replace(/\D/g, '').slice(0, 10);
                                    handleInputChange(field.id, digits);
                                  }}
                                  onKeyDown={(e) => {
                                    // Allow edit and navigation keys: backspace, delete, tab, arrows
                                    if (
                                      ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key) ||
                                      (e.ctrlKey === true || e.metaKey === true)
                                    ) {
                                      return;
                                    }
                                    // Block any non-digit character
                                    if (!/^[0-9]$/.test(e.key)) {
                                      e.preventDefault();
                                    }
                                  }}
                                  onChange={(e) => {
                                    // Strictly filter to digits only and limit to 10 numbers
                                    const numericOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    handleInputChange(field.id, numericOnly);
                                  }}
                                  className="flex-1 bg-transparent px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#9E9589] font-mono tracking-wider focus:outline-none"
                                />
                              </div>

                              {/* Digit Counter & Validation Feedback */}
                              <div className="flex items-center justify-between text-[11px] text-[#7A7268] px-1 pt-0.5">
                                <span>Numbers only • Exactly 10 digits</span>
                                <span
                                  className={`font-mono font-bold transition-colors ${
                                    value.length === 10
                                      ? 'text-emerald-700 font-extrabold'
                                      : value.length > 0
                                      ? 'text-amber-700'
                                      : 'text-[#8C847A]'
                                  }`}
                                >
                                  {value.length === 10 ? '✓ 10 Digits Complete' : `${value.length}/10 digits`}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <input
                              type={
                                field.type === 'email'
                                  ? 'email'
                                  : field.type === 'number'
                                  ? 'number'
                                  : field.type === 'date'
                                  ? 'date'
                                  : 'text'
                              }
                              required={Boolean(field.required)}
                              placeholder={field.placeholder || ''}
                              value={value}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              className="w-full bg-[#FAF7F2] border border-[#DDD5C7] focus:border-brass-600 focus:bg-white rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#9E9589] focus:outline-none transition-colors"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl text-xs uppercase tracking-widest font-bold bg-gradient-to-r from-brass-600 via-amber-600 to-brass-700 hover:from-brass-500 hover:to-amber-500 text-white shadow-xl shadow-brass-600/20 transition-all active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Registering Lead with Concierge...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{submitButtonText}</span>
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-center text-[#8C847A] mt-2">
                      🔒 Your inquiry is securely delivered to Ram Prasad Agencies showroom desk in Gorakhpur.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
