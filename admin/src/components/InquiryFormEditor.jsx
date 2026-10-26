import React, { useState } from 'react';
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Eye,
  Sliders,
  Type,
  ListFilter,
  CheckCircle2,
  Calendar,
  Hash,
  MessageSquare,
  FileText,
  AlertCircle,
  MoveUp,
  MoveDown,
  Sparkles,
  ShieldCheck,
  Clock,
  Phone,
  Send,
  Loader2,
} from 'lucide-react';
import { DEFAULT_INQUIRY_FORM_CONFIG } from '../utils/defaults';
import ConfirmationModal from './ConfirmationModal';

export default function InquiryFormEditor({
  storeData = {},
  onSaveInquiryForm,
  showToast,
  isSaving,
}) {
  const currentConfig = storeData.inquiryFormConfig || DEFAULT_INQUIRY_FORM_CONFIG;

  // General Form Section Copy State
  const [badge, setBadge] = useState(currentConfig.badge || DEFAULT_INQUIRY_FORM_CONFIG.badge);
  const [title, setTitle] = useState(
    storeData.inquiryTitle || currentConfig.title || DEFAULT_INQUIRY_FORM_CONFIG.title
  );
  const [subtitle, setSubtitle] = useState(
    storeData.inquirySubtitle || currentConfig.subtitle || DEFAULT_INQUIRY_FORM_CONFIG.subtitle
  );
  const [submitButtonText, setSubmitButtonText] = useState(
    currentConfig.submitButtonText || DEFAULT_INQUIRY_FORM_CONFIG.submitButtonText
  );
  const [successMessage, setSuccessMessage] = useState(
    currentConfig.successMessage || DEFAULT_INQUIRY_FORM_CONFIG.successMessage
  );

  // Form Fields Array State
  const [fields, setFields] = useState(
    currentConfig.fields && Array.isArray(currentConfig.fields) && currentConfig.fields.length > 0
      ? currentConfig.fields
      : DEFAULT_INQUIRY_FORM_CONFIG.fields
  );

  // New Field Form State
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState('text'); // 'text' | 'number' | 'select' | 'date' | 'textarea' | 'tel'
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldOptionsRaw, setNewFieldOptionsRaw] = useState('');

  // Editing existing field modal / state
  const [editingFieldId, setEditingFieldId] = useState(null);

  // Reset confirmation modal state
  const [showResetModal, setShowResetModal] = useState(false);

  // Handle Field Property Updates
  const handleUpdateField = (fieldId, key, value) => {
    setFields((prev) =>
      prev.map((f) => {
        if (f.id === fieldId) {
          return { ...f, [key]: value };
        }
        return f;
      })
    );
  };

  // Reorder fields
  const handleMoveField = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;

    setFields((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  // Add New Custom Input
  const handleAddNewField = (e) => {
    e?.preventDefault();
    if (!newFieldLabel.trim()) {
      showToast && showToast({ type: 'error', title: 'Missing Label', message: 'Field label is required.' });
      return;
    }

    const slug = 'custom_' + newFieldLabel.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 20) + '_' + Date.now().toString().slice(-4);

    let parsedOptions = [];
    if (newFieldType === 'select') {
      parsedOptions = newFieldOptionsRaw
        .split('\n')
        .map((opt) => opt.trim())
        .filter(Boolean);

      if (parsedOptions.length === 0) {
        parsedOptions = newFieldOptionsRaw
          .split(',')
          .map((opt) => opt.trim())
          .filter(Boolean);
      }

      if (parsedOptions.length === 0) {
        parsedOptions = ['Option 1', 'Option 2'];
      }
    }

    const newFieldObj = {
      id: slug,
      label: newFieldLabel.trim(),
      type: newFieldType,
      placeholder: newFieldPlaceholder.trim() || `Enter ${newFieldLabel.trim()}`,
      required: Boolean(newFieldRequired),
      enabled: true,
      isSystem: false,
      ...(newFieldType === 'select' ? { options: parsedOptions } : {}),
    };

    setFields((prev) => [...prev, newFieldObj]);
    setShowAddFieldModal(false);

    // Reset inputs
    setNewFieldLabel('');
    setNewFieldType('text');
    setNewFieldPlaceholder('');
    setNewFieldRequired(false);
    setNewFieldOptionsRaw('');

    showToast &&
      showToast({
        type: 'success',
        title: 'New Field Added',
        message: `Field "${newFieldObj.label}" added to the consultation form.`,
      });
  };

  // Delete Custom Field
  const handleDeleteField = (fieldId, label) => {
    setFields((prev) => prev.filter((f) => f.id !== fieldId));
    showToast &&
      showToast({
        type: 'info',
        title: 'Field Removed',
        message: `Removed "${label}" from form.`,
      });
  };

  // Save All Changes
  const handleSave = () => {
    const payload = {
      inquiryTitle: title.trim(),
      inquirySubtitle: subtitle.trim(),
      inquiryFormConfig: {
        badge: badge.trim(),
        title: title.trim(),
        subtitle: subtitle.trim(),
        submitButtonText: submitButtonText.trim(),
        successMessage: successMessage.trim(),
        fields: fields,
      },
    };

    onSaveInquiryForm && onSaveInquiryForm(payload);
  };

  // Reset to Defaults
  const handleConfirmReset = () => {
    setBadge(DEFAULT_INQUIRY_FORM_CONFIG.badge);
    setTitle(DEFAULT_INQUIRY_FORM_CONFIG.title);
    setSubtitle(DEFAULT_INQUIRY_FORM_CONFIG.subtitle);
    setSubmitButtonText(DEFAULT_INQUIRY_FORM_CONFIG.submitButtonText);
    setSuccessMessage(DEFAULT_INQUIRY_FORM_CONFIG.successMessage);
    setFields(DEFAULT_INQUIRY_FORM_CONFIG.fields);
    setShowResetModal(false);

    showToast &&
      showToast({
        type: 'info',
        title: 'Reset Completed',
        message: 'Form fields restored to default configuration. Click Save to persist.',
      });
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brass-500/10 via-amber-500/10 to-transparent border border-brass-500/30 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-brass-700 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-serif text-sm sm:text-base font-bold text-[#1A1A1A]">
            Customer Inquiries & Showroom Consultation Form Builder
          </h3>
          <p className="text-xs text-[#5A524A] mt-0.5 leading-relaxed">
            Customize the storefront consultation form. Submissions automatically route as showroom leads to your Leads Desk in real-time. You can modify copy, toggle inputs, add custom questions, or rearrange order.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Configuration Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Header & Copy Customization */}
          <div className="p-5 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm space-y-4">
            <h4 className="font-serif text-sm font-bold text-[#1A1A1A] flex items-center gap-2 border-b border-[#E8E1D5] pb-2.5">
              <Type className="w-4 h-4 text-brass-700" />
              <span>Section Copy & Messaging</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                  Section Pill Badge
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. Bespoke Concierge"
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] focus:border-brass-600 rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                  Submit Button Label
                </label>
                <input
                  type="text"
                  value={submitButtonText}
                  onChange={(e) => setSubmitButtonText(e.target.value)}
                  placeholder="e.g. Submit Consultation Request"
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] focus:border-brass-600 rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                Main Headline
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Custom Sourcing & Horology Inquiries"
                className="w-full bg-[#FAF7F2] border border-[#DDD5C7] focus:border-brass-600 rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                Description / Subtitle
              </label>
              <textarea
                rows={2}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Brief intro explaining how customers can book private viewings or request specific models..."
                className="w-full bg-[#FAF7F2] border border-[#DDD5C7] focus:border-brass-600 rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                Post-Submission Success Note
              </label>
              <input
                type="text"
                value={successMessage}
                onChange={(e) => setSuccessMessage(e.target.value)}
                placeholder="e.g. Your consultation request has been registered..."
                className="w-full bg-[#FAF7F2] border border-[#DDD5C7] focus:border-brass-600 rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none"
              />
            </div>
          </div>

          {/* 2. Form Fields Manager */}
          <div className="p-5 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-2.5">
              <div className="flex items-center gap-2">
                <ListFilter className="w-4 h-4 text-brass-700" />
                <h4 className="font-serif text-sm font-bold text-[#1A1A1A]">
                  Form Inputs ({fields.length} Fields)
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setShowAddFieldModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-brass-600 hover:bg-brass-500 text-white shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Input</span>
              </button>
            </div>

            <p className="text-xs text-[#6B635B]">
              Configure fields shown to customers. You can change labels, mark fields required, or hide unused ones.
            </p>

            {/* Field Cards List */}
            <div className="space-y-3">
              {fields.map((field, index) => {
                const isEditing = editingFieldId === field.id;

                return (
                  <div
                    key={field.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      field.enabled !== false
                        ? 'bg-[#FAF7F2] border-[#DDD5C7]'
                        : 'bg-[#F2ECE1]/50 border-dashed border-[#DDD5C7] opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2.5">
                        {/* Type Icon */}
                        <div className="w-7 h-7 rounded-lg bg-white border border-[#DDD5C7] flex items-center justify-center text-brass-700 font-mono text-[10px] font-bold">
                          {field.type === 'select' ? '▼' : field.type === 'textarea' ? '¶' : field.type === 'tel' ? '☎' : field.type === 'number' ? '#' : 'Aa'}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#1A1A1A]">
                              {field.label}
                            </span>
                            {field.required && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-amber-500/10 text-amber-800 border border-amber-600/30">
                                Required
                              </span>
                            )}
                            {field.isSystem ? (
                              <span className="text-[10px] font-mono text-[#8C847A]">
                                [Default]
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-800 border border-emerald-600/30">
                                Custom
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#7A7268] block">
                            Type: <span className="font-mono">{field.type}</span> • Placeholder: "{field.placeholder || 'None'}"
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5">
                        {/* Enabled Toggle */}
                        <button
                          type="button"
                          onClick={() => handleUpdateField(field.id, 'enabled', field.enabled === false ? true : false)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            field.enabled !== false
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-300 text-stone-700'
                          }`}
                          title="Toggle field visibility on website form"
                        >
                          {field.enabled !== false ? 'Active' : 'Hidden'}
                        </button>

                        {/* Edit Toggle */}
                        <button
                          type="button"
                          onClick={() => setEditingFieldId(isEditing ? null : field.id)}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white hover:bg-stone-100 text-[#2C2723] border border-[#DDD5C7]"
                        >
                          {isEditing ? 'Done' : 'Edit'}
                        </button>

                        {/* Move Up/Down */}
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveField(index, 'up')}
                          className="p-1 rounded bg-white hover:bg-stone-100 text-[#5A524A] disabled:opacity-30 border border-[#DDD5C7]"
                          title="Move up"
                        >
                          <MoveUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={index === fields.length - 1}
                          onClick={() => handleMoveField(index, 'down')}
                          className="p-1 rounded bg-white hover:bg-stone-100 text-[#5A524A] disabled:opacity-30 border border-[#DDD5C7]"
                          title="Move down"
                        >
                          <MoveDown className="w-3 h-3" />
                        </button>

                        {/* Delete (custom only) */}
                        {!field.isSystem && (
                          <button
                            type="button"
                            onClick={() => handleDeleteField(field.id, field.label)}
                            className="p-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
                            title="Delete custom field"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Inline Editor Drawer */}
                    {isEditing && (
                      <div className="mt-3 pt-3 border-t border-[#DDD5C7] space-y-3 bg-white p-3 rounded-lg animate-fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#5A524A] mb-1">
                              Field Display Label
                            </label>
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => handleUpdateField(field.id, 'label', e.target.value)}
                              className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-lg px-2.5 py-1.5 text-xs text-[#1A1A1A] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#5A524A] mb-1">
                              Placeholder Text
                            </label>
                            <input
                              type="text"
                              value={field.placeholder || ''}
                              onChange={(e) => handleUpdateField(field.id, 'placeholder', e.target.value)}
                              className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-lg px-2.5 py-1.5 text-xs text-[#1A1A1A] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-[#1A1A1A]">
                            <input
                              type="checkbox"
                              checked={Boolean(field.required)}
                              onChange={(e) => handleUpdateField(field.id, 'required', e.target.checked)}
                              className="rounded border-[#DDD5C7] text-brass-600 focus:ring-0"
                            />
                            <span>Customer Must Fill This Field (Required)</span>
                          </label>
                        </div>

                        {/* Options editor for dropdowns */}
                        {field.type === 'select' && (
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#5A524A] mb-1">
                              Dropdown Choices (One per line)
                            </label>
                            <textarea
                              rows={4}
                              value={(field.options || []).join('\n')}
                              onChange={(e) => {
                                const newOpts = e.target.value
                                  .split('\n')
                                  .map((o) => o.trim())
                                  .filter(Boolean);
                                handleUpdateField(field.id, 'options', newOpts);
                              }}
                              placeholder="Choice 1&#10;Choice 2&#10;Choice 3"
                              className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-lg p-2 text-xs text-[#1A1A1A] focus:outline-none font-mono"
                            />
                            <p className="text-[10px] text-[#8C847A] mt-1">
                              Customers can select from these options in the dropdown.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Storefront Form Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-6">
            <div className="p-4 bg-white border border-[#DDD5C7] rounded-2xl shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-2">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-brass-700" />
                  <span className="font-serif text-sm font-bold text-[#1A1A1A]">
                    Live Storefront Preview
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-800 border border-emerald-600/30">
                  Instant Feedback
                </span>
              </div>

              {/* Form Mockup Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#DDD5C7] space-y-4 text-left">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brass-500/10 border border-brass-500/30 text-brass-800 text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-brass-700" />
                    <span>{badge || 'Bespoke Concierge'}</span>
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#1A1A1A] leading-snug">
                    {title || 'Custom Sourcing & Horology Inquiries'}
                  </h3>
                  <p className="text-[11px] text-[#6B635B] leading-relaxed">
                    {subtitle || 'Consultation request details...'}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {fields
                    .filter((f) => f.enabled !== false)
                    .map((field) => (
                      <div key={field.id} className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#2C2723]">
                          {field.label} {field.required && <span className="text-amber-700">*</span>}
                        </label>

                        {field.type === 'select' ? (
                          <select
                            disabled
                            className="w-full bg-white border border-[#DDD5C7] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] cursor-not-allowed opacity-90"
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
                            className="w-full bg-white border border-[#DDD5C7] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] cursor-not-allowed opacity-90 resize-none"
                          />
                        ) : (field.id === 'phone' || field.type === 'tel') ? (
                          <div className="space-y-1">
                            <div className="flex rounded-xl bg-white border border-[#DDD5C7] overflow-hidden opacity-90">
                              <div className="bg-[#EFE8DC] text-[11px] font-bold text-[#1A1A1A] px-2.5 py-2 border-r border-[#DDD5C7] flex items-center gap-1">
                                <span>🇮🇳</span>
                                <span>+91</span>
                              </div>
                              <input
                                type="text"
                                disabled
                                placeholder="98765 43210 (10 digits only)"
                                className="flex-1 bg-transparent px-3 py-2 text-xs font-mono text-[#1A1A1A] cursor-not-allowed"
                              />
                            </div>
                            <div className="flex justify-between text-[9px] text-[#7A7268] px-0.5">
                              <span>Numbers only</span>
                              <span className="font-mono text-emerald-700 font-bold">✓ 10 digits</span>
                            </div>
                          </div>
                        ) : (
                          <input
                            type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                            disabled
                            placeholder={field.placeholder || ''}
                            className="w-full bg-white border border-[#DDD5C7] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] cursor-not-allowed opacity-90"
                          />
                        )}
                      </div>
                    ))}

                  <div className="pt-2">
                    <div className="w-full py-3 rounded-xl text-xs uppercase tracking-widest font-bold bg-gradient-to-r from-brass-600 via-amber-600 to-brass-700 text-white text-center shadow-md flex items-center justify-center gap-2">
                      <Send className="w-3.5 h-3.5" />
                      <span>{submitButtonText || 'Submit Inquiry to Showroom'}</span>
                    </div>
                    <p className="text-[9px] text-center text-[#8C847A] mt-1.5">
                      🔒 Leads are dispatched instantly to Baldev Plaza & JalKal Building concierge desks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions Bar */}
      <div className="sticky bottom-0 z-20 -mx-6 -mb-6 p-4 bg-white/95 backdrop-blur-md border-t border-[#E8E1D5] flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#6B635B] hover:text-[#1A1A1A] hover:bg-[#FAF7F2] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Default Layout</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-brass-600 hover:bg-brass-500 text-white shadow-xl shadow-brass-600/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving to Storefront...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Consultation Form</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal: Add New Custom Input Field */}
      {showAddFieldModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-[#DDD5C7] shadow-2xl p-6 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brass-500/10 text-brass-800 flex items-center justify-center font-bold text-sm">
                  +
                </div>
                <h3 className="font-serif text-base font-bold text-[#1A1A1A]">
                  Add New Input Field For Customers
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddFieldModal(false)}
                className="w-7 h-7 rounded-full bg-[#FAF7F2] text-[#6B635B] hover:text-[#1A1A1A] flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddNewField} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#2C2723] mb-1">
                  Field Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Estimated Budget, Wrist Size (Inches), Occasion, Preferred Appointment Date"
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] focus:border-brass-600 rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#2C2723] mb-1">
                    Input Type *
                  </label>
                  <select
                    value={newFieldType}
                    onChange={(e) => setNewFieldType(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C7] focus:border-brass-600 rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none"
                  >
                    <option value="text">Single-line Text (text)</option>
                    <option value="number">Numeric (number)</option>
                    <option value="select">Dropdown Menu (select)</option>
                    <option value="date">Date Picker (date)</option>
                    <option value="textarea">Paragraph / Multi-line (textarea)</option>
                    <option value="tel">Mobile / WhatsApp Number (10 digits & Country Code)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#2C2723] mb-1">
                    Placeholder Hint
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹25,000 to ₹1,00,000"
                    value={newFieldPlaceholder}
                    onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C7] focus:border-brass-600 rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none"
                  />
                </div>
              </div>

              {/* If Select: show options input */}
              {newFieldType === 'select' && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase text-[#2C2723]">
                    Dropdown Options (Enter one choice per line) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Under ₹25,000&#10;₹25,000 - ₹50,000&#10;₹50,000 - ₹1,50,000&#10;Above ₹1,50,000"
                    value={newFieldOptionsRaw}
                    onChange={(e) => setNewFieldOptionsRaw(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C7] focus:border-brass-600 rounded-xl p-3 text-xs text-[#1A1A1A] focus:outline-none font-mono"
                  />
                </div>
              )}

              <div className="pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1A1A1A]">
                  <input
                    type="checkbox"
                    checked={newFieldRequired}
                    onChange={(e) => setNewFieldRequired(e.target.checked)}
                    className="rounded border-[#DDD5C7] text-brass-600 focus:ring-0"
                  />
                  <span>Make this field Mandatory for customers</span>
                </label>
              </div>

              <div className="pt-3 border-t border-[#E8E1D5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddFieldModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5A524A] hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brass-600 hover:bg-brass-500 text-white shadow-md"
                >
                  Add Field to Form
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleConfirmReset}
        title="Reset Consultation Form to Defaults?"
        message="This will reset all field labels, placeholders, and remove any custom added fields back to the curated showroom layout."
        confirmText="Reset to Defaults"
      />
    </div>
  );
}
