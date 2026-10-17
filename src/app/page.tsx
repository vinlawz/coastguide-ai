import Explorer from "@/components/Explorer";
import Assistant from "@/components/Assistant";
import { destinations, categories } from "@/data/destinations";

const steps = [
  {
    title: "1. Explore the real coast",
    body: "Browse a live map of verified beaches, marine parks, heritage sites and eco spots — filter by what excites you.",
  },
  {
    title: "2. Get a built-for-you plan",
    body: "Tell the AI your days, budget and travel style. It builds a day-by-day itinerary from real places, not guesses.",
  },
  {
    title: "3. Travel the coast forward",
    body: "Every stop comes with a sustainability tip, so your trip supports the reefs, forests and communities you visit.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-14 px-4 py-10">
      <header className="flex flex-col gap-5 rounded-3xl bg-gradient-to-br from-ocean-mid/10 via-transparent to-coral/10 p-6 sm:p-10">
        <span className="text-sm font-medium text-coral">OceanHack 2026 · Coastal Travel &amp; Tourism</span>
        <h1 className="text-3xl font-bold text-ocean-mid sm:text-5xl">CoastGuide AI</h1>
        <p className="max-w-2xl text-black/70">
          Coastal tourism in Kenya is huge but fragmented — travelers piece together outdated blogs and
          word-of-mouth, with no way to plan a trip that actually protects the reefs, forests and
          communities they visit. CoastGuide AI turns that into one map, one AI planner, and real
          sustainability guidance at every stop.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="#explore"
            className="rounded-xl bg-ocean-mid px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ocean-mid/90"
          >
            Explore the map
          </a>
          <a
            href="#plan"
            className="rounded-xl border border-ocean-mid px-5 py-2.5 text-sm font-medium text-ocean-mid transition hover:bg-ocean-mid/10"
          >
            Plan my trip
          </a>
        </div>
        <div className="flex flex-wrap gap-6 pt-2 text-sm">
          <div>
            <span className="text-2xl font-bold text-ocean-mid">{destinations.length}</span>
            <span className="ml-2 text-black/60">curated destinations</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-ocean-mid">{categories.length}</span>
            <span className="ml-2 text-black/60">experience categories</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-ocean-mid">100%</span>
            <span className="ml-2 text-black/60">paired with sustainability tips</span>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {steps.map((step) => (
          <div key={step.title} className="rounded-2xl border border-black/10 bg-white/60 p-5">
            <h3 className="font-semibold text-ocean-mid">{step.title}</h3>
            <p className="mt-2 text-sm text-black/70">{step.body}</p>
          </div>
        ))}
      </section>

      <section id="explore">
        <h2 className="mb-3 text-xl font-semibold">Explore destinations</h2>
        <Explorer />
      </section>

      <section id="plan">
        <h2 className="mb-3 text-xl font-semibold">Plan your trip</h2>
        <Assistant />
      </section>

      <footer className="pb-6 text-xs text-black/40">
        Built for OceanHack 2026 — Pre-Pwani Innovation Week Hackathon, Swahilipot Hub Foundation.
      </footer>
    </main>
  );
}
