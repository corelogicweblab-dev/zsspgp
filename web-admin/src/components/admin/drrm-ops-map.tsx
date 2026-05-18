"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import type { Incident } from "@/types";
import { INCIDENT_SEVERITIES } from "@/lib/constants";
import {
  getMunicipalityCoords,
  PROVINCE_MAP_CENTER,
  PROVINCE_MAP_ZOOM,
} from "@/lib/zamboanga-sibugay-geo";
import "leaflet/dist/leaflet.css";

const SEVERITY_COLOR: Record<string, string> = {
  low: "#94a3b8",
  medium: "#eab308",
  high: "#f97316",
  critical: "#ef4444",
};

function MapResize() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

interface DrrmOpsMapProps {
  incidents: Incident[];
}

export function DrrmOpsMap({ incidents }: DrrmOpsMapProps) {
  const markers = useMemo(() => {
    return incidents
      .map((inc) => {
        const lat = inc.latitude ?? getMunicipalityCoords(inc.municipality)?.lat;
        const lng = inc.longitude ?? getMunicipalityCoords(inc.municipality)?.lng;
        if (lat == null || lng == null) return null;
        return { inc, lat, lng };
      })
      .filter(Boolean) as { inc: Incident; lat: number; lng: number }[];
  }, [incidents]);

  return (
    <div className="drrm-ops-map relative h-[min(420px,55vh)] w-full overflow-hidden rounded-xl border border-cyan-500/25">
      <MapContainer
        center={[PROVINCE_MAP_CENTER.lat, PROVINCE_MAP_CENTER.lng]}
        zoom={PROVINCE_MAP_ZOOM}
        className="h-full w-full z-0"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapResize />
        {markers.map(({ inc, lat, lng }) => {
          const sev = INCIDENT_SEVERITIES.find((s) => s.value === inc.severity);
          const color = SEVERITY_COLOR[inc.severity] ?? "#38bdf8";
          return (
            <CircleMarker
              key={inc.id}
              center={[lat, lng]}
              radius={inc.severity === "critical" ? 14 : 10}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.75,
                weight: 2,
              }}
            >
              <Popup>
                <div className="min-w-[180px] text-sm">
                  <p className="font-bold text-slate-900">{inc.title}</p>
                  <p className="text-xs text-slate-600">{inc.reference_number}</p>
                  <p className="mt-1 text-xs">
                    {inc.municipality}
                    {inc.barangay ? ` · ${inc.barangay}` : ""}
                  </p>
                  <p className="mt-1 text-xs font-semibold" style={{ color }}>
                    {sev?.label ?? inc.severity} · {inc.status}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      <div className="pointer-events-none absolute bottom-3 left-3 z-[400] rounded-lg border border-cyan-500/30 bg-slate-950/90 px-3 py-2 text-[10px] text-slate-300 backdrop-blur-sm">
        Zamboanga Sibugay · OpenStreetMap · {markers.length} plotted incident(s)
      </div>
    </div>
  );
}
