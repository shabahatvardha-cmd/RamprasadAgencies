import React, { createContext, useContext, useState, useCallback } from 'react';
import WhatsAppPromptModal from '../components/WhatsAppPromptModal';
import { getStoredCustomerProfile, saveCustomerProfile, formatWhatsAppMessage, getWhatsAppLink } from '../utils/api';

const WhatsAppContext = createContext(null);

export function WhatsAppProvider({ children }) {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    phone: '',
    rawMessage: '',
    purpose: '',
    title: 'Connect on WhatsApp',
    subtitle: 'Enter your name to personalize your inquiry with our boutique team',
  });

  const launchWhatsApp = useCallback((phone, messageText) => {
    let cleanPhone = String(phone || '919876543210').replace(/[^0-9]/g, '');
    if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`;
    }
    const finalUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  }, []);

  const openWhatsApp = useCallback(({
    phone,
    message = '',
    watch = null,
    storeName = 'Golghar showrooms',
    purpose = 'general',
    title = 'Connect on WhatsApp',
    subtitle = 'Enter your name to personalize your inquiry with our boutique team',
  }) => {
    const profile = getStoredCustomerProfile();
    const storedName = profile?.name?.trim();

    // Prepare message if an object was passed
    let baseMessage = message;
    if (!baseMessage && watch && typeof watch === 'object') {
      const watchTitle = `${watch.brand ? watch.brand + ' ' : ''}${watch.name || ''}`.trim();
      baseMessage = `Hello Ram Prasad Agencies, I am interested in inquiring about the "${watchTitle}" at your ${storeName}. Looking forward to pricing and private viewing guidance.`;
    } else if (!baseMessage) {
      baseMessage = `Hello Ram Prasad Agencies, I would like to inquire about your luxury & heritage watch collections in Gorakhpur.`;
    }

    // If customer name is already saved, format message and open immediately without modal
    if (storedName && storedName !== '[Your Name]') {
      const formatted = formatWhatsAppMessage(baseMessage, storedName);
      launchWhatsApp(phone, formatted);
      return;
    }

    // If first-time customer without saved name, open prompt modal
    setModalConfig({
      isOpen: true,
      phone,
      rawMessage: baseMessage,
      purpose,
      title,
      subtitle,
    });
  }, [launchWhatsApp]);

  const handleModalSubmit = useCallback((enteredName) => {
    const cleanName = enteredName?.trim() || '';
    if (cleanName) {
      saveCustomerProfile({ name: cleanName });
    }

    const formatted = formatWhatsAppMessage(modalConfig.rawMessage, cleanName);
    launchWhatsApp(modalConfig.phone, formatted);

    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  }, [modalConfig, launchWhatsApp]);

  const handleModalSkip = useCallback(() => {
    launchWhatsApp(modalConfig.phone, modalConfig.rawMessage);
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  }, [modalConfig, launchWhatsApp]);

  const handleModalClose = useCallback(() => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <WhatsAppContext.Provider value={{ openWhatsApp }}>
      {children}
      <WhatsAppPromptModal
        isOpen={modalConfig.isOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        onSkip={handleModalSkip}
        initialMessage={modalConfig.rawMessage}
        title={modalConfig.title}
        subtitle={modalConfig.subtitle}
      />
    </WhatsAppContext.Provider>
  );
}

export function useWhatsApp() {
  const context = useContext(WhatsAppContext);
  if (!context) {
    // Graceful fallback if used outside provider
    return {
      openWhatsApp: ({ phone, message }) => {
        const link = getWhatsAppLink(phone, message);
        window.open(link, '_blank', 'noopener,noreferrer');
      },
    };
  }
  return context;
}

