/**
 * Central Project Configuration for Client Website Preview & Booking Popup
 * 
 * Configured international WhatsApp contact: 919670111167
 * (10-digit number 9670111167 with India country calling code 91, digits-only).
 */

export const PREVIEW_CONFIG = {
  projectName: 'Ram Prasad Agencies',
  defaultWhatsAppNumber: '919670111167',

  /**
   * Retrieves the authoritative digits-only international WhatsApp contact number.
   * Checks VITE_CLIENT_PREVIEW_WHATSAPP first, falling back to 919670111167.
   */
  getWhatsAppNumber: () => {
    const raw = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_CLIENT_PREVIEW_WHATSAPP)
      ? import.meta.env.VITE_CLIENT_PREVIEW_WHATSAPP
      : '919670111167';
    return String(raw).replace(/[^0-9]/g, '');
  },

  /**
   * Primary Action: Discuss proceeding with 50% kickoff payment
   */
  getProceedingMessage: (projectName = 'Ram Prasad Agencies') => {
    return `Hi, I’ve reviewed the ${projectName} website preview and would like to discuss proceeding with the project. Please share the next steps for the 50% kickoff payment based on our agreed project fee and the remaining development work. Thank you.`;
  },

  /**
   * Secondary Action: Request changes before proceeding
   */
  getChangesMessage: (projectName = 'Ram Prasad Agencies') => {
    return `Hi, I’ve reviewed the ${projectName} website preview. I’d like to request a few changes before proceeding. The changes I’d like are:\n`;
  },

  /**
   * Generates a valid https://wa.me link with URL-encoded message
   */
  getWhatsAppUrl: (messageText) => {
    const number = PREVIEW_CONFIG.getWhatsAppNumber();
    return `https://wa.me/${number}?text=${encodeURIComponent(messageText)}`;
  },
};
