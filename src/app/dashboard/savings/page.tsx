"use client";

import { useEffect, useState } from "react";
import { PageHeader, StatCard, MiniChart } from "@/components/dashboard";
import { useAuth } from "@/lib/auth";

type Savings = {
  tokensSaved: number;
  usdSaved: number;
  roundtripsSaved: number;
  msSaved: number;
  toolCalls: number;
  byTool: Record<string, number>;
  machines: number;
  lastSync: string | null;
};

function fmtTokens(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(Math.round(n));
}

export default function SavingsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Savings | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch("/api/savings")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setData(j))
      .finally(() => setLoaded(true));
  }, [user]);

  const usd = data ? `$${data.usdSaved.toFixed(2)}` : "$0.00";
  const tokens = data ? fmtTokens(data.tokensSaved) : "0";
  const secs = data ? (data.msSaved / 1000).toFixed(0) + "s" : "0s";
  const rt = data ? String(data.roundtripsSaved) : "0";

  return (
    <>
      <PageHeader title="Savings" />
      <div className="p-8">
        {loaded && data && data.toolCalls === 0 && (
          <p className="mb-6 text-sm text-muted">
            No savings synced yet. Link Claude Code on the Token page, then run a
            session.
          </p>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Estimated $ saved" value={usd} />
          <StatCard label="Tokens saved (est.)" value={tokens} />
          <StatCard label="Time saved (est.)" value={secs} />
          <StatCard label="Roundtrips collapsed" value={rt} />
        </div>

        <div className="card mt-8 p-6">
          <h3 className="font-semibold">Tool usage</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            {(["Search", "Edit", "Read", "Write"] as const).map((t) => (
              <div key={t} className="flex justify-between">
                <span className="text-muted">{t}</span>
                <span className="font-mono">{data?.byTool?.[t] ?? 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card mt-8 p-6">
          <h3 className="font-semibold">Trend</h3>
          <p className="mb-4 mt-1 text-xs text-muted">
            Figures are heuristic estimates. {data ? `${data.machines} machine(s) linked.` : ""}
          </p>
          <MiniChart />
        </div>
      </div>
    </>
  );
}
