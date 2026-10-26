import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Clock,
  MessageCircle,
  Edit2,
  Phone,
  MessageSquare,
  Sliders,
  Send,
  PlusCircle,
} from 'lucide-react';
import { DEFAULT_INQUIRY_FORM_CONFIG } from '../../utils/defaults';

export default function VisualInquiry({ storeData = {}, isEditMode, onOpenEdit, onOpenLeads }) {
  const formConfig = storeData.inquiryFormConfig || DEFAULT_INQUIRY_FORM_CONFIG;
  const inquiryTitle = storeData.inquiryTitle || formConfig.title || 'Custom Sourcing & Showroom Consultation';
  const inquirySubtitle =
    storeData.inquirySubtitle ||
    formConfig.subtitle ||
    'Looking for a specific vintage reference, limited edition release, or looking to schedule a private fitting at Baldev Plaza or JalKal Building? Connect with our horology team.';
  const contactPhone = storeData.contactPhone || '+91 98765 43210';
  const fields = formConfig.fields || DEFAULT_INQUIRY_FORM_CONFIG.fields;

  return (
    <section id="inquiry" className="relative py-12 sm:py-20 bg-[#F5F2EB] border-t border-[#E8E1D5] overflow-hidden">
      {/* Visual Admin Edit Trigger Badge */}
      {isEditMode && (
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          <button
            onClick={() => onOpenLeads && onOpenLeads()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-2xl hover:scale-105 transition-all border border-white/30 backdrop-blur-md"
            title="Open customer inquiries and leads desk"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Showroom Leads Desk</span>
          </button>

          <button
            onClick={() => onOpenEdit('inquiry')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-brass-600 hover:bg-brass-500 text-white shadow-2xl hover:scale-105 transition-all border border-white/30 backdrop-blur-md"
            title="Customize consultation form, labels, and add new input fields"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Edit Form & Add Inputs</span>
          </button>
        </div>
      )}

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="max-w-5xl mx-auto rounded-3xl bg-white border border-[#DDD5C7] p-6 sm:p-10 shadow-sm space-y-8">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brass-500/10 border border-brass-500/30 text-brass-800 text-[11px] sm:text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-brass-700" />
              <span>{formConfig.badge || 'Bespoke Horology Concierge'}</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A]">
              {inquiryTitle}
            </h2>

            <p className="text-xs sm:text-sm text-[#6B635B] leading-relaxed">
              {inquirySubtitle}
            </p>
          </div>

          {/* Form Visual Preview with Admin Quick Edit Overlay */}
          <div className="relative rounded-2xl bg-[#FAF7F2] border border-[#DDD5C7] p-5 sm:p-8 space-y-4">
            {isEditMode && (
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD5C7]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1A1A1A]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Storefront Form Fields ({fields.filter((f) => f.enabled !== false).length} Active)</span>
                </div>

                <button
                  onClick={() => onOpenEdit('inquiry')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-brass-600 hover:bg-brass-500 text-white shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Customize / Add New Input</span>
                </button>
              </div>
            )}

            {/* Simulated Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields
                .filter((f) => f.enabled !== false)
                .map((field) => (
                  <div
                    key={field.id}
                    className={`space-y-1 ${
                      field.type === 'textarea' ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2C2723]">
                      {field.label} {field.required && <span className="text-amber-700">*</span>}
                    </label>

                    {field.type === 'select' ? (
                      <select
                        disabled
                        className="w-full bg-white border border-[#DDD5C7] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] cursor-not-allowed opacity-90"
                      >
                        {(field.options || []).map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        disabled
                        rows={2}
                        placeholder={field.placeholder || ''}
                        className="w-full bg-white border border-[#DDD5C7] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] cursor-not-allowed opacity-90 resize-none"
                      />
                    ) : (field.id === 'phone' || field.type === 'tel') ? (
                      <div className="space-y-1">
                        <div className="flex rounded-xl bg-white border border-[#DDD5C7] overflow-hidden opacity-90">
                          <div className="bg-[#EFE8DC] text-xs font-bold text-[#1A1A1A] px-3 py-2.5 border-r border-[#DDD5C7] flex items-center gap-1.5">
                            <span>🇮🇳</span>
                            <span>+91</span>
                          </div>
                          <input
                            type="text"
                            disabled
                            placeholder="98765 43210 (10 digits only)"
                            className="flex-1 bg-transparent px-3.5 py-2.5 text-xs font-mono text-[#1A1A1A] cursor-not-allowed"
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-[#7A7268] px-1">
                          <span>Numbers only • Exactly 10 digits</span>
                          <span className="font-mono text-emerald-700 font-bold">✓ 10 Digits</span>
                        </div>
                      </div>
                    ) : (
                      <input
                        type="text"
                        disabled
                        placeholder={field.placeholder || ''}
                        className="w-full bg-white border border-[#DDD5C7] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] cursor-not-allowed opacity-90"
                      />
                    )}
                  </div>
                ))}
            </div>

            <div className="pt-2">
              <div className="w-full py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold bg-gradient-to-r from-brass-600 via-amber-600 to-brass-700 text-white text-center shadow-md flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                <span>{formConfig.submitButtonText || 'Submit Inquiry to Showroom'}</span>
              </div>
            </div>
          </div>

          {/* Bottom Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] text-xs font-semibold text-[#1A1A1A]">
              <ShieldCheck className="w-4 h-4 text-brass-700" />
              <span>Official Warranty Cards</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] text-xs font-semibold text-[#1A1A1A]">
              <Clock className="w-4 h-4 text-brass-700" />
              <span>Immediate In-Store Sizing</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brass-600 text-white text-xs font-bold shadow-md">
              <Phone className="w-4 h-4" />
              <span>Direct Concierge: {contactPhone}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
