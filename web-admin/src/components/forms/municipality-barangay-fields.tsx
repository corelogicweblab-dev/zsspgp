"use client";

import { MUNICIPALITIES } from "@/lib/constants";
import { getBarangaysForMunicipality } from "@/lib/barangays";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface MunicipalityBarangayFieldsProps {
  municipality: string;
  barangay: string;
  purokOrStreet: string;
  onMunicipalityChange: (value: string) => void;
  onBarangayChange: (value: string) => void;
  onPurokOrStreetChange: (value: string) => void;
  municipalityId?: string;
  barangayId?: string;
  purokId?: string;
}

export function MunicipalityBarangayFields({
  municipality,
  barangay,
  purokOrStreet,
  onMunicipalityChange,
  onBarangayChange,
  onPurokOrStreetChange,
  municipalityId = "municipality",
  barangayId = "barangay",
  purokId = "purok_or_street",
}: MunicipalityBarangayFieldsProps) {
  const barangays = municipality ? getBarangaysForMunicipality(municipality) : [];

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={municipalityId}>Municipality</Label>
        <Select
          id={municipalityId}
          value={municipality}
          required
          onChange={(e) => {
            onMunicipalityChange(e.target.value);
            onBarangayChange("");
          }}
        >
          <option value="">Select municipality</option>
          {MUNICIPALITIES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor={barangayId}>Barangay</Label>
        <Select
          id={barangayId}
          value={barangay}
          required
          disabled={!municipality}
          onChange={(e) => onBarangayChange(e.target.value)}
        >
          <option value="">
            {municipality ? "Select barangay" : "Select municipality first"}
          </option>
          {barangays.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor={purokId}>Purok / street / house / landmark</Label>
        <Input
          id={purokId}
          value={purokOrStreet}
          required
          placeholder="e.g. Purok 4, Rizal St., or nearest landmark"
          onChange={(e) => onPurokOrStreetChange(e.target.value)}
        />
      </div>
    </>
  );
}
