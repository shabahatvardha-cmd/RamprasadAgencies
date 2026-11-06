import React, { useState, useEffect } from 'react';
import { X, MessageCircle, User, ArrowRight, Sparkles } from 'lucide-react';
import { OriginalWhatsAppIcon } from './FloatingWhatsApp';
import { formatWhatsAppMessage } from '../utils/api';

export default function WhatsAppPromptModal({
  isOpen,
  onClose,
  onSubmit,
  onSkip,
  initialMessage = '',
  title = 'Connect on WhatsApp',
  subtitle = 'Enter your name to personalize your inquiry with our boutique team',
}) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const previewMessage = formatWhatsAppMessage(
    initialMessage || 'Hello Ram Prasad Agencies, I would like to inquire about your collections.',
    name.trim() || '[Your Name]'
  );

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSubmit(name.trim());
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      onSubmit('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#FAF7F2] border border-[#DDD5C7] shadow-2xl flex flex-col text-[#1A1A1A] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 bg-[#F4EDE2] border-b border-[#E3DACB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-md shadow-[#25D366]/20">
              <OriginalWhatsAppIcon className="w-5 h-5 shrink-0" size={20} />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#1A1A1A] leading-tight">
                {title}
              </h3>
              <p className="text-[11px] text-[#7A7167]">
                Ram Prasad Agencies — Direct Concierge
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#DDD5C7] text-[#5A524A] hover:text-[#1A1A1A] hover:bg-[#FAF7F2] flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 sm:space-y-5">
          <div>
            <p className="text-xs text-[#5A524A] leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider font-bold text-[#6A6158]">
              Your Name / Business Name:
            </label>
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vikram Sharma or Sharma Watch Co."
                className="w-full py-3 pl-10 pr-4 rounded-xl bg-white border border-[#DDD5C7] text-sm text-[#1A1A1A] placeholder:text-[#9A9187] focus:outline-none focus:border-brass-600 focus:ring-1 focus:ring-brass-600 shadow-xs"
              />
              <User className="w-4 h-4 text-brass-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[10px] text-[#8A8177]">
              The website will remember your name for future inquiries.
            </p>
          </div>

          {/* Live WhatsApp Message Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] uppercase tracking-wider font-bold text-[#7A7167] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brass-700" />
                Live Message Preview in WhatsApp:
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#EFEAE1]/70 border border-[#DDD5C7] text-[11.5px] text-[#3A332C] leading-relaxed italic relative">
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider bg-white/90 text-brass-800 border border-brass-600/20">
                Pre-filled
              </div>
              <p className="pr-14 whitespace-pre-wrap">{previewMessage}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs sm:text-sm uppercase tracking-wider font-bold bg-[#25D366] hover:bg-[#20ba59] text-white shadow-lg shadow-[#25D366]/25 transition-all active:scale-98 cursor-pointer"
            >
              <span>Continue to WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleSkip}
              className="w-full py-2 text-center text-[11px] text-[#7A7167] hover:text-[#1A1A1A] underline underline-offset-2 transition-colors cursor-pointer"
            >
              Skip and continue without name
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

