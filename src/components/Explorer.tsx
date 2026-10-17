"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { destinations, categories } from "@/data/destinations";
import type { Destination, DestinationCategory } from "@/lib/types";
import WeatherWidget from "@/components/WeatherWidget";

const CoastMap = dynamic(() => import("@/components/CoastMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-ocean-mid">
      Loading map…
    </div>
  ),
});

export default function Explorer() {
  const [activeCategory, setActiveCategory] = useState<DestinationCategory | "All">("All");
  const [selected, setSelected] = useState<Destination | null>(null);

  const items = useMemo(
    () => (activeCategory === "All" ? destinations : destinations.filter((d) => d.category === activeCategory)),
    [activeCategory]
  );

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="lg:col-span-2 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {(["All", ...categories] as const).map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`rounded-full border px-3 py-1 text-sm transition ${
                activeCategory === c
                  ? "border-ocean-mid bg-ocean-mid text-white"
                  : "border-ocean-mid/30 text-ocean-mid hover:bg-ocean-mid/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex max-h-[520px] flex-col gap-2 overflow-y-auto pr-1">
          {items.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelected(d)}
              className={`rounded-xl border p-3 text-left transition ${
                selected?.id === d.id ? "border-ocean-mid bg-ocean-mid/5" : "border-black/10 hover:border-ocean-mid/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{d.name}</span>
                <span className="text-xs text-ocean-mid">{d.category}</span>
              </div>
              <p className="mt-1 text-sm text-black/70">{d.description}</p>
              <p className="mt-1 text-xs text-black/50">{d.region} · ~{d.idealHours}h visit</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:col-span-3">
        {selected && (
          <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{selected.name}</h3>
              <span className="text-xs text-black/50">{selected.region}</span>
            </div>
            <WeatherWidget destination={selected} />
            <p className="mt-2 text-xs italic text-ocean-mid">{selected.sustainabilityNote}</p>
          </div>
        )}
        <div className="h-[560px] overflow-hidden rounded-2xl border border-black/10">
          <CoastMap items={items} selected={selected} onSelect={setSelected} />
        </div>
      </div>
    </div>
  );
}
