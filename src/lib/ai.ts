import { destinations } from "@/data/destinations";
import type { ItineraryRequest, ItineraryResponse, ItineraryDay, ChatMessage } from "@/lib/types";

const AI_BASE_URL = process.env.AI_BASE_URL || "https://api.groq.com/openai/v1";
const AI_MODEL = process.env.AI_MODEL || "llama-3.3-70b-versatile";
const AI_API_KEY = process.env.AI_API_KEY;

function destinationsContext(): string {
  return destinations
    .map(
      (d) =>
        `- ${d.name} (${d.id}) [${d.category}, ${d.region}]: ${d.description} Activities: ${d.activities.join(", ")}. Ideal visit: ~${d.idealHours}h.`
    )
    .join("\n");
}

async function callChatModel(messages: { role: string; content: string }[]): Promise<string | null> {
  if (!AI_API_KEY) return null;
  try {
    const res = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages,
        temperature: 0.6,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

// Rule-based planner used whenever no AI key is configured or the AI call fails,
// so the demo always works offline.
function fallbackItinerary(req: ItineraryRequest): ItineraryResponse {
  const pool = destinations.filter(
    (d) => req.interests.length === 0 || req.interests.includes(d.category)
  );
  const ranked = (pool.length ? pool : destinations).sort(
    (a, b) => b.bestFor.length - a.bestFor.length
  );

  const perDay = req.pace === "Packed" ? 3 : req.pace === "Relaxed" ? 1 : 2;
  const days: ItineraryDay[] = [];
  let cursor = 0;
  for (let day = 1; day <= req.days; day++) {
    const picks = [];
    for (let i = 0; i < perDay && cursor < ranked.length; i++, cursor++) {
      picks.push(ranked[cursor]);
    }
    if (picks.length === 0) {
      cursor = 0;
      picks.push(ranked[cursor]);
      cursor++;
    }
    days.push({
      day,
      title: picks.map((p) => p.name).join(" + "),
      destinationIds: picks.map((p) => p.id),
      summary: picks
        .map((p) => `${p.name}: ${p.activities.slice(0, 2).join(" and ")}.`)
        .join(" "),
      tip: picks[0]?.sustainabilityNote ?? "Support local guides and operators wherever you go.",
    });
  }

  return {
    overview: `A ${req.days}-day ${req.pace.toLowerCase()}-paced ${req.budget.toLowerCase()} trip for a ${req.travelerType.toLowerCase()} traveler, focused on ${
      req.interests.length ? req.interests.join(", ") : "the coast's highlights"
    }.`,
    days,
    source: "fallback",
  };
}

export async function generateItinerary(req: ItineraryRequest): Promise<ItineraryResponse> {
  const systemPrompt = `You are CoastGuide AI, a travel planner for the Kenyan coast (Mombasa, Diani, Watamu, Malindi, Kilifi, Lamu, Shimoni/Wasini). Only recommend destinations from this list:\n${destinationsContext()}\n\nRespond ONLY with strict JSON matching this TypeScript type, no markdown, no prose outside the JSON:\n{ "overview": string, "days": { "day": number, "title": string, "destinationIds": string[], "summary": string, "tip": string }[] }\ndestinationIds must use the ids in parentheses above.`;

  const userPrompt = `Plan a ${req.days}-day trip for a ${req.travelerType} traveler with a ${req.budget} budget and a ${req.pace} pace. Interests: ${
    req.interests.join(", ") || "open to anything"
  }.`;

  const raw = await callChatModel([
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]);

  if (!raw) return fallbackItinerary(req);

  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    if (!parsed.days || !Array.isArray(parsed.days)) throw new Error("bad shape");
    return { ...parsed, source: "ai" } as ItineraryResponse;
  } catch {
    return fallbackItinerary(req);
  }
}

export async function answerQuestion(history: ChatMessage[]): Promise<string> {
  const systemPrompt = `You are CoastGuide AI, a friendly, knowledgeable assistant for coastal travel and tourism in Kenya. Use this curated destination list as your source of truth when relevant:\n${destinationsContext()}\n\nAlso advise on practical safety (tides, currents, sun, reef conservation, respectful dress in Muslim communities like Lamu) when asked. Keep answers concise (under 120 words) and friendly.`;

  const reply = await callChatModel([
    { role: "system", content: systemPrompt },
    ...history.map((m) => ({ role: m.role, content: m.content })),
  ]);

  if (reply) return reply;

  const lastUser = history[history.length - 1]?.content?.toLowerCase() ?? "";
  if (lastUser.includes("safe") || lastUser.includes("safety")) {
    return "Swim only at lifeguarded beaches when possible, mind strong rip currents at low tide, wear reef shoes near coral, and use reef-safe sunscreen. In Lamu and other Muslim communities, dress modestly away from the beach.";
  }
  return "I'm running in offline mode right now (no AI key configured), but I can still help — try asking about a specific destination like Diani, Watamu, or Lamu, or use the trip planner above for a ready-made itinerary.";
}
