import { NextResponse } from "next/server";

// Temporary: lists available Groq models for this API key. Remove after use.
export async function GET() {
  const key = process.env.AI_API_KEY;
  if (!key) return NextResponse.json({ error: "no key" }, { status: 500 });
  const res = await fetch("https://api.groq.com/openai/v1/models", {
    headers: { Authorization: `Bearer ${key}` },
  });
  const data = await res.json();
  return NextResponse.json(data);
}
