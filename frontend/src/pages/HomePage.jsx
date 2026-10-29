import React from 'react';
import HeroBanner from '../components/HeroBanner';
import BrandMarquee from '../components/BrandMarquee';
import DualStorefront from '../components/DualStorefront';
import AboutSection from '../components/AboutSection';
import CustomerInquiry from '../components/CustomerInquiry';

export default function HomePage({
  storeData,
  contactPhone = '+91 98765 43210',
  onSelectBrand,
}) {
  return (
    <main className="w-full">
      {/* 1. Home - Hero Photography Showcase Banner */}
      <div id="home">
        <HeroBanner />
      </div>

      {/* 2. About - Heritage & About Us Section */}
      <AboutSection
        contactPhone={contactPhone}
        aboutText={storeData?.aboutText}
        certificateImage={storeData?.certificateImage}
        showrooms={storeData?.showrooms}
      />

      {/* 3. Brand - Brand Portfolio Grid (Clicking navigates to /brand/:slug) */}
      <div id="brand">
        <BrandMarquee
          brands={storeData?.brands}
          onSelectBrand={onSelectBrand}
        />
      </div>

      {/* 4. Store Locator - Dual Showrooms (Baldev Plaza & JalKal Building, Golghar) */}
      <div id="store-locator">
        <DualStorefront
          contactPhone={contactPhone}
          showrooms={storeData?.showrooms}
        />
      </div>

      {/* 5. Contact Us - Showroom Consultation & Contact Form */}
      <div id="contact">
        <div id="contact-us">
          <CustomerInquiry
            contactPhone={contactPhone}
            inquiryTitle={storeData?.inquiryTitle}
            inquirySubtitle={storeData?.inquirySubtitle}
          />
        </div>
      </div>
    </main>
  );
}
