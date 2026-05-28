import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateToken } from "@/lib/tokens";

export const runtime = "nodejs";

// List the signed-in user's tokens (metadata only — never the secret).
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("api_tokens")
    .select("id,name,created_at,last_used_at,revoked")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tokens: data ?? [] });
}

// Mint a new token. Returns the plaintext exactly once.
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const name =
    typeof body?.name === "string" && body.name.trim()
      ? body.name.trim().slice(0, 80)
      : "CLI token";

  const { token, hash } = generateToken();
  const admin = createAdminClient();
  const { error } = await admin
    .from("api_tokens")
    .insert({ user_id: user.id, token_hash: hash, name });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ token, name });
}
