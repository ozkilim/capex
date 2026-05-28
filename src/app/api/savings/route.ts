import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Row = {
  tokens_saved: number;
  usd_saved: number;
  roundtrips_saved: number;
  ms_saved: number;
  tool_calls: number;
  by_tool: Record<string, number> | null;
  updated_at: string;
};

// Returns the signed-in user's savings, summed across all their machines.
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("savings")
    .select("tokens_saved,usd_saved,roundtrips_saved,ms_saved,tool_calls,by_tool,updated_at")
    .eq("user_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = (data ?? []) as Row[];
  const byTool: Record<string, number> = {};
  let lastSync: string | null = null;
  const totals = rows.reduce(
    (acc, r) => {
      acc.tokensSaved += Number(r.tokens_saved) || 0;
      acc.usdSaved += Number(r.usd_saved) || 0;
      acc.roundtripsSaved += Number(r.roundtrips_saved) || 0;
      acc.msSaved += Number(r.ms_saved) || 0;
      acc.toolCalls += Number(r.tool_calls) || 0;
      for (const [k, v] of Object.entries(r.by_tool ?? {})) {
        byTool[k] = (byTool[k] ?? 0) + (Number(v) || 0);
      }
      if (!lastSync || r.updated_at > lastSync) lastSync = r.updated_at;
      return acc;
    },
    { tokensSaved: 0, usdSaved: 0, roundtripsSaved: 0, msSaved: 0, toolCalls: 0 }
  );

  return NextResponse.json({ ...totals, byTool, machines: rows.length, lastSync });
}
