# CoastGuide AI

Built for **OceanHack 2026** (Pre-Pwani Innovation Week Hackathon) — Coastal Travel & Tourism track.

Reimagines the coastal visitor experience for the Kenyan coast: explore real beaches, marine parks,
heritage sites and eco spots on an interactive map, then get an AI-generated day-by-day itinerary
tailored to your interests, budget, pace and travel group — each stop paired with a sustainability tip.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

AI features work out of the box in **offline/rule-based mode**. To enable AI-generated itineraries and
chat answers, copy `.env.example` to `.env.local` and set `AI_API_KEY` (any OpenAI-compatible provider,
e.g. [Groq](https://console.groq.com/keys) free tier).

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Leaflet + OpenStreetMap for the map (no API key needed)
- Open-Meteo for weather (no API key needed)
- Any OpenAI-compatible chat completions API for the AI assistant/itinerary planner, with a built-in
  rule-based fallback so the demo never breaks without a key
