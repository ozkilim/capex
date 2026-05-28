import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashToken } from "@/lib/tokens";

export const runtime = "nodejs";

function toInt(v: unknown) {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}
function toNum(v: unknown) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

// Ingest cumulative savings from the Claude Code plugin. Authenticated by a
// Bearer personal access token (cpx_sk_...). Body carries absolute lifetime
// totals for one machine; we upsert per (user, machine).
export async function POST(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  const match = auth.match(/^Bearer\s+(.+)$/i);
  if (!match) return NextResponse.json({ error: "missing bearer token" }, { status: 401 });
  const token = match[1].trim();

  const admin = createAdminClient();
  const { data: tok } = await admin
    .from("api_tokens")
    .select("user_id,revoked")
    .eq("token_hash", hashToken(token))
    .maybeSingle();
  if (!tok || tok.revoked) {
    return NextResponse.json({ error: "invalid token" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const machineId = String(body?.machineId ?? "default").slice(0, 128);
  const byTool =
    body?.byTool && typeof body.byTool === "object" ? body.byTool : {};

  const row = {
    user_id: tok.user_id,
    machine_id: machineId,
    machine_label: body?.machineLabel ? String(body.machineLabel).slice(0, 128) : null,
    tokens_saved: toInt(body?.tokensSaved),
    usd_saved: toNum(body?.usdSaved),
    roundtrips_saved: toInt(body?.roundtripsSaved),
    ms_saved: toInt(body?.msSaved),
    tool_calls: toInt(body?.toolCalls),
    by_tool: byTool,
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin
    .from("savings")
    .upsert(row, { onConflict: "user_id,machine_id" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await admin
    .from("api_tokens")
    .update({ last_used_at: new Date().toISOString() })
    .eq("token_hash", hashToken(token));

  return NextResponse.json({ ok: true });
}
