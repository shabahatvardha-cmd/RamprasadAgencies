import { FALLBACK_WATCHES } from '../frontend/src/data/fallbackWatches.js';

FALLBACK_WATCHES.forEach((w, idx) => {
  if ((w.brand || '').toLowerCase().includes('citizen')) {
    console.log(`Index ${idx}: ID=${w.id || w._id} | Name=${w.name}`);
  }
});

