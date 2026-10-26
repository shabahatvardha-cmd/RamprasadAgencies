import React from 'react';
import { X, Sparkles } from 'lucide-react';
import HeroSlidesEditor from '../HeroSlidesEditor';
import FlashSaleEditor from '../FlashSaleEditor';
import LifestyleEditor from '../LifestyleEditor';
import ShowroomsEditor from '../ShowroomsEditor';
import BrandingEditor from '../BrandingEditor';
import AppearanceEditor from '../AppearanceEditor';
import InquiryFormEditor from '../InquiryFormEditor';

export default function ActiveEditorModal({
  activeModal,
  onClose,
  storeData,
  onSaveSection,
  showToast,
  isSaving,
}) {
  if (!activeModal) return null;

  const getModalTitle = () => {
    switch (activeModal) {
      case 'hero':
        return 'Hero Showcase & Slides Editor';
      case 'flashSale':
        return 'Flash Sale & Promotion Ribbon Editor';
      case 'categories':
      case 'lifestyle':
      case 'editorial':
        return '4 Horology Pillars & Craftsmanship Showcase Editor';
      case 'showrooms':
        return 'Boutique Showrooms Editor';
      case 'branding':
      case 'announcements':
      case 'brands':
        return 'Footer VIP Circle, Helpline & Branding Editor';
      case 'inquiry':
      case 'inquiryForm':
        return 'Showroom Consultation & Inquiry Form Builder';
      case 'appearance':
        return 'Appearance, Colors & Typography Studio';
      default:
        return 'Section Editor';
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#FAF7F2] rounded-3xl border border-[#DDD5C7] shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E8E1D5] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brass-600"></span>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-brass-800 font-bold block">
                Visual Website Editor
              </span>
              <h2 className="font-serif text-lg font-bold text-[#1A1A1A]">
                {getModalTitle()}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#DDD5C7] flex items-center justify-center text-[#5A524A] hover:text-[#1A1A1A] hover:bg-[#F0EBE1] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeModal === 'hero' && (
            <HeroSlidesEditor
              heroData={storeData.hero}
              onSaveHero={(hero) => onSaveSection({ hero }, 'Hero Showcase')}
              showToast={showToast}
              isSaving={isSaving}
            />
          )}

          {activeModal === 'flashSale' && (
            <FlashSaleEditor
              flashSaleData={storeData.flashSale}
              onSaveFlashSale={(flashSalePayload) => {
                const unwrapped = flashSalePayload?.flashSale || flashSalePayload;
                onSaveSection({ flashSale: unwrapped }, 'Flash Sale');
              }}
              showToast={showToast}
              isSaving={isSaving}
            />
          )}

          {(activeModal === 'categories' || activeModal === 'lifestyle' || activeModal === 'editorial') && (
            <LifestyleEditor
              storeData={storeData}
              onSaveLifestyle={(lifestyleData) => onSaveSection(lifestyleData, 'Lifestyle & Story')}
              showToast={showToast}
              isSaving={isSaving}
            />
          )}

          {activeModal === 'showrooms' && (
            <ShowroomsEditor
              showroomsData={storeData.showrooms}
              onSaveShowrooms={(showrooms) => onSaveSection({ showrooms }, 'Boutique Showrooms')}
              showToast={showToast}
              isSaving={isSaving}
            />
          )}

          {(activeModal === 'branding' || activeModal === 'announcements' || activeModal === 'brands') && (
            <BrandingEditor
              storeData={storeData}
              onSaveBranding={(brandingData) => onSaveSection(brandingData, 'Branding & Maisons')}
              showToast={showToast}
              isSaving={isSaving}
            />
          )}

          {(activeModal === 'inquiry' || activeModal === 'inquiryForm') && (
            <InquiryFormEditor
              storeData={storeData}
              onSaveInquiryForm={(inquiryData) => onSaveSection(inquiryData, 'Consultation Form')}
              showToast={showToast}
              isSaving={isSaving}
            />
          )}

          {activeModal === 'appearance' && (
            <AppearanceEditor
              appearanceData={storeData.appearance}
              onSaveAppearance={(appearance) => onSaveSection({ appearance }, 'Styling & Appearance')}
              showToast={showToast}
              isSaving={isSaving}
            />
          )}
        </div>
      </div>
    </div>
  );
}
