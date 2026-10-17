"use client";

import { useEffect, useState } from "react";
import { categories, getDestinationById } from "@/data/destinations";
import { PLAN_WITH_CATEGORY_EVENT } from "@/lib/events";
import type {
  ChatMessage,
  DestinationCategory,
  ItineraryResponse,
  TravelerType,
} from "@/lib/types";

const travelerTypes: TravelerType[] = ["Solo", "Couple", "Family", "Friends/Group"];
const budgets = ["Budget", "Mid-range", "Premium"] as const;
const paces = ["Relaxed", "Balanced", "Packed"] as const;

export default function Assistant() {
  const [tab, setTab] = useState<"plan" | "ask">("plan");

  useEffect(() => {
    const onPlanRequest = () => setTab("plan");
    window.addEventListener(PLAN_WITH_CATEGORY_EVENT, onPlanRequest);
    return () => window.removeEventListener(PLAN_WITH_CATEGORY_EVENT, onPlanRequest);
  }, []);

  return (
    <div className="rounded-2xl border border-black/10 bg-white/60 p-4">
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setTab("plan")}
          className={`rounded-full px-4 py-1.5 text-sm ${tab === "plan" ? "bg-ocean-mid text-white" : "text-ocean-mid"}`}
        >
          Plan a trip
        </button>
        <button
          onClick={() => setTab("ask")}
          className={`rounded-full px-4 py-1.5 text-sm ${tab === "ask" ? "bg-ocean-mid text-white" : "text-ocean-mid"}`}
        >
          Ask CoastGuide
        </button>
      </div>
      {tab === "plan" ? <TripPlanner /> : <AskCoastGuide />}
    </div>
  );
}

function TripPlanner() {
  const [days, setDays] = useState(3);
  const [interests, setInterests] = useState<DestinationCategory[]>([]);
  const [travelerType, setTravelerType] = useState<TravelerType>("Couple");
  const [budget, setBudget] = useState<(typeof budgets)[number]>("Mid-range");
  const [pace, setPace] = useState<(typeof paces)[number]>("Balanced");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ItineraryResponse | null>(null);

  useEffect(() => {
    const onPlanRequest = (e: Event) => {
      const category = (e as CustomEvent<DestinationCategory>).detail;
      setInterests((prev) => (prev.includes(category) ? prev : [...prev, category]));
    };
    window.addEventListener(PLAN_WITH_CATEGORY_EVENT, onPlanRequest);
    return () => window.removeEventListener(PLAN_WITH_CATEGORY_EVENT, onPlanRequest);
  }, []);

  function toggleInterest(c: DestinationCategory) {
    setInterests((prev) => (prev.includes(c) ? prev.filter((i) => i !== c) : [...prev, c]));
  }

  async function plan() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days, interests, travelerType, budget, pace }),
      });
      setResult(await res.json());
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          Days
          <input
            type="number"
            min={1}
            max={14}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-black/15 p-2"
          />
        </label>
        <label className="text-sm">
          Traveler type
          <select
            value={travelerType}
            onChange={(e) => setTravelerType(e.target.value as TravelerType)}
            className="mt-1 w-full rounded-lg border border-black/15 p-2"
          >
            {travelerTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Budget
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value as (typeof budgets)[number])}
            className="mt-1 w-full rounded-lg border border-black/15 p-2"
          >
            {budgets.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Pace
          <select
            value={pace}
            onChange={(e) => setPace(e.target.value as (typeof paces)[number])}
            className="mt-1 w-full rounded-lg border border-black/15 p-2"
          >
            {paces.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <p className="mb-1 text-sm">Interests</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => toggleInterest(c)}
              className={`rounded-full border px-3 py-1 text-xs ${
                interests.includes(c) ? "border-ocean-mid bg-ocean-mid text-white" : "border-ocean-mid/30 text-ocean-mid"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={plan}
        disabled={loading}
        className="rounded-xl bg-coral px-4 py-2 font-medium text-white disabled:opacity-60"
      >
        {loading ? "Planning…" : "Generate itinerary"}
      </button>

      {result && (
        <div className="mt-2 flex flex-col gap-3">
          <p className="text-sm text-black/70">
            {result.overview}{" "}
            {result.source === "fallback" && (
              <span className="text-xs text-black/40">(offline planner — set AI_API_KEY for AI-generated plans)</span>
            )}
          </p>
          {result.days.map((d) => (
            <div key={d.day} className="rounded-xl border border-black/10 p-3">
              <p className="font-semibold">
                Day {d.day}: {d.title}
              </p>
              <p className="mt-1 text-sm text-black/70">{d.summary}</p>
              <p className="mt-1 text-xs text-black/50">
                {d.destinationIds.map((id) => getDestinationById(id)?.name).filter(Boolean).join(" · ")}
              </p>
              <p className="mt-2 text-xs italic text-ocean-mid">Tip: {d.tip}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AskCoastGuide() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Ask me anything about the Kenyan coast — beaches, safety, culture, or costs." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "Is it safe to swim in Diani in October?",
    "Where should a culture lover go first?",
    "How do I keep this trip sustainable?",
  ];

  async function send(question?: string) {
    const text = question ?? input;
    if (!text.trim()) return;
    const next = [...messages, { role: "user", content: text } as ChatMessage];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.content }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex max-h-80 flex-col gap-2 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-xl p-2 text-sm ${
              m.role === "user" ? "self-end bg-ocean-mid text-white" : "self-start bg-black/5"
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>
      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-ocean-mid/30 px-3 py-1 text-xs text-ocean-mid hover:bg-ocean-mid/10"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="e.g. Is Diani safe for swimming in July?"
          className="flex-1 rounded-lg border border-black/15 p-2 text-sm"
        />
        <button onClick={() => send()} disabled={loading} className="rounded-lg bg-ocean-mid px-4 text-sm text-white disabled:opacity-60">
          {loading ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
}
