const API_ROOT = import.meta.env.VITE_API_ROOT || 'http://localhost:5000';
export const API_BASE = import.meta.env.VITE_API_BASE_URL || `${API_ROOT}/api`;

/**
 * Resolves full URL for images stored locally on backend
 * e.g. "/uploads/watch-123.jpg" -> "http://localhost:5000/uploads/watch-123.jpg"
 */
export const getFullImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/images/watches/default-watch.webp';
  }
  let pathStr = String(imagePath).trim();

  // If local or relative path with .jpg / .jpeg / .png, switch to .webp
  if (pathStr.endsWith('.jpg') || pathStr.endsWith('.jpeg') || pathStr.endsWith('.png')) {
    pathStr = pathStr.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }

  if (pathStr.startsWith('http://') || pathStr.startsWith('https://') || pathStr.startsWith('data:')) {
    // If Unsplash, ensure WebP output
    if (pathStr.includes('images.unsplash.com') && !pathStr.includes('fm=webp')) {
      const sep = pathStr.includes('?') ? '&' : '?';
      return `${pathStr}${sep}fm=webp`;
    }
    return pathStr;
  }
  if (pathStr.startsWith('/images/')) {
    return pathStr;
  }
  const cleanPath = pathStr.startsWith('/') ? pathStr : `/${pathStr}`;
  return `${API_ROOT}${cleanPath}`;
};

/**
 * Fetch dynamic site settings (theme, titles, announcement, phone)
 */
export const fetchSettings = async () => {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('Using default settings fallback:', err.message);
    return {
      theme: 'obsidian-gold',
      heroTitle: 'Timeless Elegance & Haute Horlogerie',
      heroSubtitle: 'Gorakhpur’s premier authorized specialists in imported luxury timepieces. Visit our boutique showrooms at Baldev Plaza & JalKal Building, Golghar.',
      announcementText: 'Complimentary watch inspection & battery health checks available this week at both Golghar showrooms.',
      contactPhone: '+91 98765 43210',
    };
  }
};

/**
 * Fetch watch inventory from backend
 */
export const fetchWatches = async () => {
  try {
    const res = await fetch(`${API_BASE}/watches`);
    if (!res.ok) throw new Error('Failed to fetch watches');
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn('Backend unavailable, using curated showcase catalog:', err.message);
    return [];
  }
};

/**
 * Update dynamic site settings via PUT /api/settings
 */
export const updateSettings = async (settingsData) => {
  try {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settingsData),
    });
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.warn('Backend updateSettings failed, using LocalStorage persistence:', err.message);
    return null;
  }
};

/**
 * Upload image file to POST /api/upload
 */
export const uploadImageFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Image upload failed:', err.message);
    throw err;
  }
};

/**
 * Retrieve saved customer profile from localStorage (Name, Phone, Email)
 */
export const getStoredCustomerProfile = () => {
  try {
    const raw = localStorage.getItem('rpa_customer_profile');
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
};

/**
 * Persist customer profile to localStorage
 */
export const saveCustomerProfile = (profile) => {
  try {
    if (profile && typeof profile === 'object') {
      const existing = getStoredCustomerProfile() || {};
      const updated = { ...existing, ...profile };
      localStorage.setItem('rpa_customer_profile', JSON.stringify(updated));
    }
  } catch {}
};

/**
 * Helper to build prefilled WhatsApp inquiry link in a natural, polite paragraph format
 * including the customer's Name, Phone Number, and Email ID.
 */
export const getWhatsAppLink = (
  phone,
  watchOrMessage,
  storeName = 'Golghar showrooms',
  userDetails = null
) => {
  // Sanitize phone number (remove spaces, +, -, etc. then ensure country code)
  let cleanPhone = String(phone || '919876543210').replace(/[^0-9]/g, '');
  if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
    cleanPhone = `91${cleanPhone}`;
  }

  const profile = userDetails || getStoredCustomerProfile() || {};
  const customerName = profile.name?.trim() || '[Your Name]';
  const customerPhone = profile.phone?.trim() || '[Your Phone Number]';
  const customerEmail = profile.email?.trim() || '[Your Email ID]';

  const contactString = `You can reach me at ${customerPhone} or ${customerEmail}.`;

  let message = '';
  if (typeof watchOrMessage === 'string' && watchOrMessage.trim() !== '') {
    message = watchOrMessage;
  } else if (watchOrMessage && typeof watchOrMessage === 'object') {
    const watchTitle = `${watchOrMessage.brand ? watchOrMessage.brand + ' ' : ''}${watchOrMessage.name || ''}`.trim();
    message = `Hello Ram Prasad Agencies,

My name is ${customerName}. I am interested in inquiring about the "${watchTitle}" at your ${storeName}.

You can reach me at ${customerPhone} or ${customerEmail}. Looking forward to your guidance on pricing and private viewing. Thank you!`;
  } else {
    message = `Hello Ram Prasad Agencies,

My name is ${customerName}. I would like to inquire about your luxury & heritage watch collections and schedule a private showroom consultation in Golghar.

You can reach me at ${customerPhone} or ${customerEmail}. Looking forward to your guidance. Thank you!`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

/**
 * Submit customer lead to POST /api/leads with resilient LocalStorage fallback
 */
export const submitLead = async (leadData) => {
  const timestamp = new Date().toISOString();
  const localLead = {
    _id: `local-lead-${Date.now()}`,
    ...leadData,
    status: 'New',
    createdAt: timestamp,
  };

  try {
    const res = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });

    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
    throw new Error(`Server returned ${res.status}`);
  } catch (err) {
    console.warn('Backend /api/leads fallback triggered:', err.message);
    try {
      const existing = JSON.parse(localStorage.getItem('rpa_customer_leads') || '[]');
      const updated = [localLead, ...existing];
      localStorage.setItem('rpa_customer_leads', JSON.stringify(updated));
    } catch {
      // ignore
    }
    return localLead;
  }
};

