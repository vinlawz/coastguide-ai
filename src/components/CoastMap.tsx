"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Destination } from "@/lib/types";

// Simple colored circle markers avoid leaflet's default-icon asset path issues under bundlers.
const categoryColor: Record<string, string> = {
  Beaches: "#ffd166",
  "Marine & Wildlife": "#06d6a0",
  "Culture & Heritage": "#ef476f",
  "Adventure & Water Sports": "#118ab2",
  "Eco & Nature": "#073b4c",
};

function markerIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:16px;height:16px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function FlyToSelected({ selected }: { selected: Destination | null }) {
  const map = useMap();
  if (selected) {
    map.flyTo([selected.lat, selected.lng], 11, { duration: 0.6 });
  }
  return null;
}

export default function CoastMap({
  items,
  selected,
  onSelect,
}: {
  items: Destination[];
  selected: Destination | null;
  onSelect: (d: Destination) => void;
}) {
  return (
    <MapContainer center={[-3.8, 39.8]} zoom={8} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {items.map((d) => (
        <Marker
          key={d.id}
          position={[d.lat, d.lng]}
          icon={markerIcon(categoryColor[d.category] ?? "#118ab2")}
          eventHandlers={{ click: () => onSelect(d) }}
        >
          <Popup>
            <strong>{d.name}</strong>
            <br />
            {d.category}
          </Popup>
        </Marker>
      ))}
      <FlyToSelected selected={selected} />
    </MapContainer>
  );
}
