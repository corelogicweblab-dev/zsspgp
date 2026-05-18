/** Approximate municipality centers — Zamboanga Sibugay Province (for DRRM ops map). */
export const PROVINCE_MAP_CENTER = { lat: 7.75, lng: 122.65 } as const;
export const PROVINCE_MAP_ZOOM = 9;

export const MUNICIPALITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  Alicia: { lat: 7.783, lng: 122.883 },
  Buug: { lat: 7.73, lng: 122.8 },
  Diplahan: { lat: 7.814, lng: 122.967 },
  Imelda: { lat: 7.65, lng: 122.95 },
  Ipil: { lat: 7.784, lng: 122.584 },
  Kabasalan: { lat: 7.117, lng: 122.817 },
  Mabuhay: { lat: 7.417, lng: 122.833 },
  Malangas: { lat: 7.627, lng: 123.117 },
  Naga: { lat: 7.787, lng: 122.667 },
  Olutanga: { lat: 7.317, lng: 122.45 },
  Payao: { lat: 7.617, lng: 122.517 },
  "Roseller Lim": { lat: 7.7, lng: 122.467 },
  Siay: { lat: 7.707, lng: 122.173 },
  Talusan: { lat: 7.483, lng: 122.883 },
  Titay: { lat: 7.8, lng: 122.55 },
  Tungawan: { lat: 7.5, lng: 122.367 },
};

export function getMunicipalityCoords(name: string) {
  return MUNICIPALITY_COORDINATES[name] ?? null;
}
