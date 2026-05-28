"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader, CopyBlock } from "@/components/dashboard";
import { useAuth } from "@/lib/auth";

type TokenMeta = {
  id: string;
  name: string;
  created_at: string;
  last_used_at: string | null;
  revoked: boolean;
};

export default function TokenPage() {
  const { user, loading: authLoading } = useAuth();
  const [freshToken, setFreshToken] = useState<string | null>(null);
  const [tokens, setTokens] = useState<TokenMeta[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/tokens");
    if (!res.ok) return;
    const json = await res.json();
    setTokens(json.tokens ?? []);
  }, []);

  useEffect(() => {
    if (user) refresh();
  }, [user, refresh]);

  const generate = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/tokens", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to create token");
      setFreshToken(json.token);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create token");
    } finally {
      setBusy(false);
    }
  }, [refresh]);

  const hasToken = tokens.length > 0;

  if (!authLoading && !user) {
    return (
      <>
        <PageHeader title="Token / Connect" />
        <div className="p-8 text-sm text-muted">
          Please sign in to generate a CAPEX token.
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Token / Connect" />

      <div className="grid gap-6 p-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Connect Claude Code to CAPEX
            </h2>
            <p className="mt-1 text-sm text-muted">
              Link your machine so your local savings show up here in your
              dashboard.
            </p>
          </div>

          <Step n={1} title="Install the plugin">
            <CopyBlock code="/plugin marketplace add ozkilim/capex-plugin" />
            <div className="mt-2" />
            <CopyBlock code="/plugin install capex@capex-marketplace" />
            <p className="mt-2 text-xs text-muted">
              Run these inside Claude Code, then restart it.
            </p>
          </Step>

          <Step n={2} title="Generate your token">
            {freshToken ? (
              <>
                <CopyBlock code={freshToken} />
                <p className="mt-2 text-xs text-amber-400">
                  Copy it now — for security it won&apos;t be shown again. Lost
                  it? Just generate a new one.
                </p>
              </>
            ) : (
              <p className="text-sm text-muted">
                {hasToken
                  ? "You already have a token. Generate a new one if you've lost it (the old one keeps working until you revoke it)."
                  : "Generate a personal access token to link Claude Code."}
              </p>
            )}
            <div className="mt-3 flex gap-2">
              <button
                onClick={generate}
                disabled={busy}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-600 disabled:opacity-50"
              >
                {busy ? "Generating…" : hasToken ? "Generate new token" : "Generate token"}
              </button>
            </div>
            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
          </Step>

          <Step n={3} title="Authenticate">
            <CopyBlock
              code={`/capex-login --token ${freshToken ?? "<your-token>"}`}
            />
            <p className="mt-2 text-xs text-muted">
              Run this inside Claude Code with the token from step 2.
            </p>
          </Step>

          <Step n={4} title="Verify connection">
            <CopyBlock code="/capex-savings" />
            <p className="mt-2 text-xs text-muted">
              Your savings sync here automatically after each session.
            </p>
          </Step>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold">Connection status</h3>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  hasToken ? "bg-emerald-400" : "bg-gray-500"
                }`}
              />
              {hasToken ? "Linked" : "Not linked"}
            </div>
            <div className="mt-3 text-xs text-muted">
              {tokens[0]?.last_used_at
                ? `Last sync: ${new Date(tokens[0].last_used_at).toLocaleString()}`
                : "No sync yet"}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold">Your tokens</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {tokens.length === 0 && (
                <li className="text-muted">No tokens yet.</li>
              )}
              {tokens.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-2">
                  <span className="truncate">
                    {t.name}
                    <span className="ml-2 text-xs text-muted">
                      {new Date(t.created_at).toLocaleDateString()}
                    </span>
                  </span>
                  <button
                    onClick={async () => {
                      await fetch(`/api/tokens/${t.id}`, { method: "DELETE" });
                      refresh();
                    }}
                    className="shrink-0 rounded-md border border-border px-2 py-1 text-xs text-muted transition hover:bg-surface-2 hover:text-white"
                  >
                    Revoke
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-accent/15 text-sm font-semibold text-accent">
          {n}
        </span>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
