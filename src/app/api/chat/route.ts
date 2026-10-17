import { NextRequest, NextResponse } from "next/server";
import { answerQuestion } from "@/lib/ai";
import type { ChatMessage } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { messages?: ChatMessage[] };
  const messages = Array.isArray(body.messages) ? body.messages.slice(-10) : [];

  if (messages.length === 0) {
    return NextResponse.json({ error: "messages is required" }, { status: 400 });
  }

  const reply = await answerQuestion(messages);
  return NextResponse.json({ role: "assistant", content: reply });
}
