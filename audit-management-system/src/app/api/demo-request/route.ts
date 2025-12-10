import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { error, data } = await supabase.functions.invoke(
      "send-demo-request",
      { body }
    );

    if (error) {
      console.error("Failed to send demo request", error);
      return NextResponse.json(
        { error: error.message ?? "Failed to send demo request" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to submit demo request";
    console.error("POST /api/demo-request error", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
