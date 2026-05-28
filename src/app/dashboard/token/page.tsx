"use client";

import { useMemo, useState } from "react";
import { PageHeader, CopyBlock } from "@/components/dashboard";

function generateToken() {
  const rand = Array.from({ length: 32 }, () =>
    "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]
  ).join("");
  return `cpx_sk_${rand}`;
}

export default function TokenPage() {
  const [token] = useState(generateToken);
  const [revealed, setRevealed] = useState(false);
  const [connected, setConnected] = useState(false);

  const masked = useMemo(
    () => `cpx_sk_${"•".repeat(32)}`,
    []
  );

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
              Use your CAPEX token to route Claude Code through our system for
              smart search, batch edits, and savings.
            </p>
          </div>

          <Step n={1} title="Install the plugin">
            <CopyBlock code="claude plugin install capex" />
          </Step>

          <Step n={2} title="Get your token">
            <CopyBlock code={revealed ? token : masked} />
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setRevealed((r) => !r)}
                className="rounded-md border border-border px-3 py-1.5 text-xs text-muted transition hover:bg-surface-2 hover:text-white"
              >
                {revealed ? "Hide" : "Reveal"}
              </button>
              <button className="rounded-md border border-border px-3 py-1.5 text-xs text-muted transition hover:bg-surface-2 hover:text-white">
                Regenerate
              </button>
            </div>
            <p className="mt-2 text-xs text-muted">
              Keep this secret. Treat it like a password.
            </p>
          </Step>

          <Step n={3} title="Authenticate">
            <CopyBlock code={`claude config set capex.token ${revealed ? token : "<your-token>"}`} />
            <p className="mt-2 text-xs text-muted">
              Paste your token when prompted, or run the command above.
            </p>
          </Step>

          <Step n={4} title="Verify connection">
            <CopyBlock code="claude capex status" />
            <button
              onClick={() => setConnected(true)}
              className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-600"
            >
              Test connection
            </button>
          </Step>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold">Connection status</h3>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  connected ? "bg-emerald-400" : "bg-gray-500"
                }`}
              />
              {connected ? "Connected" : "Not connected"}
            </div>
            <div className="mt-3 text-xs text-muted">
              {connected ? "Last sync: just now" : "No sync yet"}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold">Quick stats</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Calls routed</dt>
                <dd className="font-mono">{connected ? "1,284" : "0"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Tokens saved</dt>
                <dd className="font-mono text-accent">
                  {connected ? "3.2M" : "0"}
                </dd>
              </div>
            </dl>
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
