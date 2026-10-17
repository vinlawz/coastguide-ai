import Explorer from "@/components/Explorer";
import Assistant from "@/components/Assistant";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10">
      <header className="flex flex-col gap-2">
        <span className="text-sm font-medium text-coral">OceanHack 2026 · Coastal Travel &amp; Tourism</span>
        <h1 className="text-3xl font-bold text-ocean-mid sm:text-4xl">CoastGuide AI</h1>
        <p className="max-w-2xl text-black/70">
          Discover the Kenyan coast and get an AI-built itinerary in seconds — real beaches, marine
          parks, heritage sites and eco spots, each with sustainability tips for responsible travel.
        </p>
      </header>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Explore destinations</h2>
        <Explorer />
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Plan your trip</h2>
        <Assistant />
      </section>

      <footer className="pb-6 text-xs text-black/40">
        Built for OceanHack 2026 — Pre-Pwani Innovation Week Hackathon, Swahilipot Hub Foundation.
      </footer>
    </main>
  );
}
