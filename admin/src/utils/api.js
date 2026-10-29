const API_ROOT = import.meta.env.VITE_API_ROOT || 'http://localhost:5000';
export const API_BASE = import.meta.env.VITE_API_BASE_URL || `${API_ROOT}/api`;

/**
 * Resolves full URL for images stored locally on backend
 * e.g. "/uploads/watch-123.jpg" -> "http://localhost:5000/uploads/watch-123.jpg"
 */
export const getFullImageUrl = (imagePath) => {
  if (!imagePath) return '/images/watches/default-watch.webp';
  let pathStr = String(imagePath).trim();

  // If local or relative path with .jpg / .jpeg / .png, switch to .webp
  if (pathStr.endsWith('.jpg') || pathStr.endsWith('.jpeg') || pathStr.endsWith('.png')) {
    pathStr = pathStr.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }

  if (pathStr.startsWith('http://') || pathStr.startsWith('https://') || pathStr.startsWith('data:')) {
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
 * Upload single image file to POST /api/upload
 */
export const uploadImageFile = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Image upload failed');
  }

  return data; // { success: true, imageUrl: "/uploads/..." }
};

/**
 * Fetch all watches from GET /api/watches
 */
export const getWatches = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.category && filters.category !== 'ALL') params.append('category', filters.category);
  if (filters.inStock !== undefined && filters.inStock !== 'ALL') params.append('inStock', filters.inStock);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_BASE}/watches${queryString}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch watches');
  }

  return data.data || [];
};

/**
 * Add a new watch via POST /api/watches
 */
export const createWatch = async (watchData) => {
  const res = await fetch(`${API_BASE}/watches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(watchData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to create watch');
  }

  return data.data;
};

/**
 * Delete a watch via DELETE /api/watches/:id
 */
export const deleteWatch = async (id) => {
  const res = await fetch(`${API_BASE}/watches/${id}`, {
    method: 'DELETE',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete watch');
  }

  return data;
};

/**
 * Fetch site settings via GET /api/settings
 */
export const getSettings = async () => {
  const res = await fetch(`${API_BASE}/settings`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch settings');
  }

  return data.data;
};

/**
 * Update site settings via PUT /api/settings
 */
export const updateSettings = async (settingsData) => {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settingsData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update settings');
  }

  return data.data;
};

/**
 * Reset site settings to factory defaults via POST /api/settings/reset
 */
export const resetSettings = async () => {
  const res = await fetch(`${API_BASE}/settings/reset`, {
    method: 'POST',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to reset settings');
  }

  return data.data;
};

/**
 * Update existing watch via PUT /api/watches/:id
 */
export const updateWatch = async (id, watchData) => {
  const res = await fetch(`${API_BASE}/watches/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(watchData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update watch');
  }

  return data.data;
};

/**
 * Health check helper
 */
export const checkHealth = async () => {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    return data.database === 'Connected';
  } catch {
    return false;
  }
};

/**
 * Fetch all customer leads from GET /api/leads with resilient local fallback
 */
export const getLeads = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
  if (filters.search) params.append('search', filters.search);

  const queryString = params.toString() ? `?${params.toString()}` : '';

  try {
    const res = await fetch(`${API_BASE}/leads${queryString}`);
    if (res.ok) {
      const data = await res.json();
      const backendLeads = data.data || [];
      // Also merge any local leads stored in browser
      const localLeads = JSON.parse(localStorage.getItem('rpa_customer_leads') || '[]');
      const nonDuplicateLocals = localLeads.filter(
        (ll) => !backendLeads.some((bl) => bl._id === ll._id || (bl.phone === ll.phone && Math.abs(new Date(bl.createdAt) - new Date(ll.createdAt)) < 60000))
      );
      return [...nonDuplicateLocals, ...backendLeads];
    }
  } catch (err) {
    console.warn('Backend /api/leads offline, returning local leads store:', err.message);
  }

  // Local fallback
  try {
    let local = JSON.parse(localStorage.getItem('rpa_customer_leads') || '[]');
    if (local.length === 0) {
      local = [
        {
          _id: 'lead-sample-1',
          name: 'Vikramaditya Rathore',
          phone: '9839012345',
          email: 'vikram.rathore@gmail.com',
          storeLocation: 'Baldev Plaza, Golghar',
          inquiryType: 'Buy / Inquire Specific Watch',
          message: 'Inquiring whether the Titan Edge Ceramic Ultra-Slim 40mm or HMT Kohinoor 17-Jewel is available for private inspection this weekend.',
          status: 'New',
          adminNotes: 'Customer requested viewing at Baldev Plaza showroom on Saturday morning.',
          source: 'Storefront Inquiry Form',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
      ];
      localStorage.setItem('rpa_customer_leads', JSON.stringify(local));
    }
    if (filters.status && filters.status !== 'ALL') {
      local = local.filter((l) => l.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      local = local.filter(
        (l) =>
          l.name?.toLowerCase().includes(q) ||
          l.phone?.toLowerCase().includes(q) ||
          l.message?.toLowerCase().includes(q) ||
          l.storeLocation?.toLowerCase().includes(q)
      );
    }
    return local;
  } catch {
    return [];
  }
};

/**
 * Update lead status or admin notes via PUT /api/leads/:id
 */
export const updateLead = async (id, updateData) => {
  try {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {
    console.warn('Updating lead locally:', err.message);
  }

  // Local fallback update
  try {
    const local = JSON.parse(localStorage.getItem('rpa_customer_leads') || '[]');
    const idx = local.findIndex((l) => l._id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...updateData, updatedAt: new Date().toISOString() };
      localStorage.setItem('rpa_customer_leads', JSON.stringify(local));
      return local[idx];
    }
  } catch {
    // ignore
  }
  return null;
};

/**
 * Delete lead via DELETE /api/leads/:id
 */
export const deleteLead = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Deleting lead locally:', err.message);
  }

  // Local fallback delete
  try {
    const local = JSON.parse(localStorage.getItem('rpa_customer_leads') || '[]');
    const filtered = local.filter((l) => l._id !== id);
    localStorage.setItem('rpa_customer_leads', JSON.stringify(filtered));
  } catch {
    // ignore
  }
  return { success: true };
};

