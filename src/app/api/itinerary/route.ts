import { NextRequest, NextResponse } from "next/server";
import { generateItinerary } from "@/lib/ai";
import type { ItineraryRequest } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<ItineraryRequest>;

  const days = Math.min(Math.max(Number(body.days) || 3, 1), 14);
  const request: ItineraryRequest = {
    days,
    interests: Array.isArray(body.interests) ? body.interests : [],
    travelerType: body.travelerType ?? "Couple",
    budget: body.budget ?? "Mid-range",
    pace: body.pace ?? "Balanced",
  };

  const result = await generateItinerary(request);
  return NextResponse.json(result);
}
