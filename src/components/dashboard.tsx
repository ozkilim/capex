"use client";

import { useState } from "react";

export function PageHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex h-16 items-center justify-between border-b border-border px-8">
      <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      <div className="flex items-center gap-3">{action}</div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta?: string;
}) {
  return (
    <div className="card p-5">
      <div className="text-sm text-muted">{label}</div>
      <div className="mt-2 font-mono text-3xl font-semibold">{value}</div>
      {delta && (
        <div className="mt-1 text-xs text-emerald-400">▲ {delta}</div>
      )}
    </div>
  );
}

export function CopyBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-2 px-4 py-3">
      <code className="truncate font-mono text-sm text-accent">{code}</code>
      <button
        onClick={copy}
        className="shrink-0 rounded-md border border-border px-2.5 py-1 text-xs text-muted transition hover:bg-surface hover:text-white"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

const bars = [40, 55, 48, 70, 62, 85, 78, 92, 88, 110, 96, 120];

export function MiniChart() {
  const max = Math.max(...bars);
  return (
    <div className="flex h-48 items-end gap-2">
      {bars.map((b, i) => (
        <div
          key={i}
          className="flex-1 rounded-t bg-gradient-to-t from-accent/40 to-accent"
          style={{ height: `${(b / max) * 100}%` }}
        />
      ))}
    </div>
  );
}
