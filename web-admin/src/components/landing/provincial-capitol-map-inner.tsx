"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { PROVINCIAL_CAPITOL } from "@/lib/constants";
import "leaflet/dist/leaflet.css";

const capitolIcon = L.divIcon({
  className: "",
  html: `<span style="display:flex;width:36px;height:36px;align-items:center;justify-content:center;border-radius:50%;background:linear-gradient(135deg,#38bdf8,#fbbf24);box-shadow:0 0 20px rgba(56,189,248,0.6);border:2px solid #fff;font-size:18px">📍</span>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

function MapResize() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

export function ProvincialCapitolMapInner() {
  const center: [number, number] = [PROVINCIAL_CAPITOL.lat, PROVINCIAL_CAPITOL.lng];

  return (
    <MapContainer
      center={center}
      zoom={15}
      scrollWheelZoom={false}
      className="h-[min(280px,50vh)] w-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapResize />
      <Marker position={center} icon={capitolIcon}>
        <Popup>
          <strong>Provincial Capitol</strong>
          <br />
          {PROVINCIAL_CAPITOL.label}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
