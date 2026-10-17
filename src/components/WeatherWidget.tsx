"use client";

import { useEffect, useState } from "react";
import type { Destination } from "@/lib/types";

const weatherIcon: Record<number, string> = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  80: "🌧️",
  95: "⛈️",
};

interface WeatherData {
  temperature_2m: number;
  weather_code: number;
  wind_speed_10m: number;
}

export default function WeatherWidget({ destination }: { destination: Destination }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setWeather(null);
    fetch(`/api/weather?lat=${destination.lat}&lng=${destination.lng}`)
      .then((res) => res.json())
      .then((data) => setWeather("temperature_2m" in data ? data : null))
      .finally(() => setLoading(false));
  }, [destination.lat, destination.lng]);

  if (loading) {
    return <p className="text-xs text-black/40">Loading weather…</p>;
  }
  if (!weather) {
    return <p className="text-xs text-black/40">Weather unavailable right now.</p>;
  }

  return (
    <div className="flex items-center gap-2 rounded-xl bg-ocean-mid/10 px-3 py-2 text-sm">
      <span className="text-lg">{weatherIcon[weather.weather_code] ?? "🌊"}</span>
      <span className="font-medium">{Math.round(weather.temperature_2m)}°C</span>
      <span className="text-black/50">now in {destination.name} · wind {Math.round(weather.wind_speed_10m)} km/h</span>
    </div>
  );
}
