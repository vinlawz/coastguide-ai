import { NextRequest, NextResponse } from "next/server";

// Open-Meteo is free and requires no API key — good fit for a hackathon demo.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "lat and lng are required" }, { status: 400 });
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`;

  try {
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) throw new Error("upstream error");
    const data = await res.json();
    return NextResponse.json(data.current ?? {});
  } catch {
    return NextResponse.json({ error: "weather unavailable" }, { status: 502 });
  }
}
