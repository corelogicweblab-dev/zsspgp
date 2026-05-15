import barangayData from "./barangays.json";

/** Official barangay names by municipality (Zamboanga Sibugay, PhilAtlas / PSA 2020). */
export const BARANGAYS_BY_MUNICIPALITY = barangayData as Record<string, string[]>;

export function getBarangaysForMunicipality(municipality: string): string[] {
  const list = BARANGAYS_BY_MUNICIPALITY[municipality];
  if (!list) return [];
  return [...list].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
}
