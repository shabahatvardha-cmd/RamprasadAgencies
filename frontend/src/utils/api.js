const API_ROOT = import.meta.env.VITE_API_ROOT || 'http://localhost:5000';
export const API_BASE = import.meta.env.VITE_API_BASE_URL || `${API_ROOT}/api`;

/**
 * Resolves full URL for images stored locally on backend
 * e.g. "/uploads/watch-123.jpg" -> "http://localhost:5000/uploads/watch-123.jpg"
 */
export const getFullImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1670404160620-a3a86428560e?auto=format&fit=crop&w=800&q=80';
  }
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
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
 * Helper to build prefilled WhatsApp inquiry link
 */
export const getWhatsAppLink = (phone, watch, storeName = 'Golghar showrooms') => {
  // Sanitize phone number (remove spaces, +, -, etc. then ensure country code)
  let cleanPhone = String(phone || '919876543210').replace(/[^0-9]/g, '');
  if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
    cleanPhone = `91${cleanPhone}`;
  }

  const message = watch
    ? `Hello Ram Prasad Agencies, I would like to inquire about the price, availability, and in-store viewing of "${watch.brand} - ${watch.name}" at your ${storeName}. Could you please share the current showroom pricing and acquisition details?`
    : `Hello Ram Prasad Agencies, I would like to inquire about your luxury & heritage timepiece collection and schedule a private consultation at your Golghar showrooms.`;

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

