"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import type { Incident } from "@/types";
import { INCIDENT_SEVERITIES } from "@/lib/constants";
import {
  getMunicipalityCoords,
  PROVINCE_MAP_CENTER,
  PROVINCE_MAP_ZOOM,
} from "@/lib/zamboanga-sibugay-geo";
import { formatDateTime } from "@/lib/utils";
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

function MapFitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length === 0) {
      map.setView([PROVINCE_MAP_CENTER.lat, PROVINCE_MAP_CENTER.lng], PROVINCE_MAP_ZOOM);
      return;
    }
    if (positions.length === 1) {
      map.setView(positions[0], 11);
      return;
    }
    const bounds = L.latLngBounds(positions);
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 12 });
  }, [map, positions]);
  return null;
}

interface DrrmOpsMapProps {
  incidents: Incident[];
  lastUpdated?: Date | null;
  live?: boolean;
}

export function DrrmOpsMap({ incidents, lastUpdated, live = false }: DrrmOpsMapProps) {
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

  const positions = useMemo(
    () => markers.map((m) => [m.lat, m.lng] as [number, number]),
    [markers]
  );

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
        <MapFitBounds positions={positions} />
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
      <div className="pointer-events-none absolute left-3 top-3 z-[400] flex flex-col gap-1">
        {live && (
          <span className="live-map-badge inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-slate-950/90 px-2.5 py-1 text-[10px] font-semibold text-emerald-300 backdrop-blur-sm">
            <span className="live-map-dot h-2 w-2 rounded-full bg-emerald-400" />
            LIVE
          </span>
        )}
      </div>
      <div className="pointer-events-none absolute bottom-3 left-3 z-[400] rounded-lg border border-cyan-500/30 bg-slate-950/90 px-3 py-2 text-[10px] text-slate-300 backdrop-blur-sm">
        Zamboanga Sibugay · {markers.length} incident(s) on map
        {lastUpdated ? ` · Updated ${formatDateTime(lastUpdated)}` : ""}
      </div>
    </div>
  );
}
