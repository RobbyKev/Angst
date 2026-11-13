// Gekapselte Speicher-Schicht.
// Phase 1: localStorage. Die Schnittstelle ist bewusst asynchron (Promises),
// damit sie in Phase 5 durch Firestore ersetzt werden kann, ohne die Module zu ändern.
//
// Sammlungen (Listen von Dokumenten mit id): z. B. 'schrittPool', 'tagesschritte', 'akut', 'mutbuch'
// Einzeldokumente: z. B. 'einstellungen'

const PREFIX = 'durch:';
const listeners = new Set();

function lese(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function schreibe(key, wert) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(wert));
  } catch (e) {
    throw new Error('Speichern nicht möglich (Speicher voll oder blockiert).');
  }
}

function neueId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function melde(name) {
  listeners.forEach((fn) => {
    try { fn(name); } catch { /* ignorieren */ }
  });
}

export const Store = {
  async list(sammlung) {
    return lese(sammlung, []);
  },

  async get(sammlung, id) {
    return lese(sammlung, []).find((d) => d.id === id) || null;
  },

  async add(sammlung, daten) {
    const doc = { id: neueId(), ...daten };
    const alle = lese(sammlung, []);
    alle.push(doc);
    schreibe(sammlung, alle);
    melde(sammlung);
    return doc;
  },

  async update(sammlung, id, aenderung) {
    const alle = lese(sammlung, []);
    const i = alle.findIndex((d) => d.id === id);
    if (i === -1) return null;
    alle[i] = { ...alle[i], ...aenderung, id };
    schreibe(sammlung, alle);
    melde(sammlung);
    return alle[i];
  },

  async remove(sammlung, id) {
    const alle = lese(sammlung, []);
    const rest = alle.filter((d) => d.id !== id);
    schreibe(sammlung, rest);
    melde(sammlung);
  },

  async removeWhere(sammlung, pruefe) {
    const alle = lese(sammlung, []);
    schreibe(sammlung, alle.filter((d) => !pruefe(d)));
    melde(sammlung);
  },

  async getDoc(name, standard = {}) {
    return { ...standard, ...lese('doc:' + name, {}) };
  },

  async setDoc(name, aenderung) {
    const neu = { ...lese('doc:' + name, {}), ...aenderung };
    schreibe('doc:' + name, neu);
    melde('doc:' + name);
    return neu;
  },

  onChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
