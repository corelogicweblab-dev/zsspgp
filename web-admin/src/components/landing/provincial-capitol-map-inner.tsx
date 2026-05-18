"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { PROVINCIAL_CAPITOL } from "@/lib/constants";
import "leaflet/dist/leaflet.css";

const capitolPosition: [number, number] = [PROVINCIAL_CAPITOL.lat, PROVINCIAL_CAPITOL.lng];

const capitolIcon = L.divIcon({
  className: "capitol-map-pin",
  html: `<span class="capitol-map-pin-dot" aria-hidden="true"></span>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

function MapResize() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    map.setView(capitolPosition, 17, { animate: false });
  }, [map]);
  return null;
}

export function ProvincialCapitolMapInner() {
  return (
    <MapContainer
      center={capitolPosition}
      zoom={17}
      scrollWheelZoom={false}
      className="capitol-map-container h-[min(320px,55vh)] w-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapResize />
      <Marker position={capitolPosition} icon={capitolIcon}>
        <Popup>
          <strong>Provincial Capitol</strong>
          <br />
          {PROVINCIAL_CAPITOL.label}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
