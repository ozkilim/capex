"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard";
import { useAuth } from "@/lib/auth";

const cliCommands: [string, string][] = [
  ["/capex-status", "Check authentication status"],
  ["/capex-login", "Log in to your CAPEX account"],
  ["/capex-logout", "Clear credentials"],
  ["/capex-recall", "Recall saved context and preferences"],
  ["/plugin disable capex@capex-marketplace", "Temporarily disable the plugin"],
  ["/plugin enable capex@capex-marketplace", "Re-enable the plugin"],
  ["claude plugin marketplace remove capex-marketplace", "Remove the plugin from marketplace"],
  ["/plugin uninstall capex@capex-marketplace", "Uninstall the local plugin"],
  ["/reload-plugins", "Reload plugins to get latest updates"],
  ["claude --agent capex:code", "Launch Claude Code with CAPEX agent explicitly"],
  ["/capex-settings", "Configure CAPEX plugin settings"],
  ["/capex-savings", "Show estimated savings report (roundtrips, time, tokens, cost)"],
  ["/capex-benchmark", "Run a side-by-side cost comparison of CAPEX vs vanilla Claude Code on your repo"],
  ["/capex-update", "Update the CAPEX plugin to the latest version"],
  ["claude plugin marketplace update capex-marketplace", "Manually update the CAPEX marketplace"],
  ["npx @capex/install", "Install or reinstall the CAPEX plugin"],
  ["claude plugin update capex@capex-marketplace", "Force-upgrade the CAPEX plugin to the latest version"],
  ["/plugin marketplace add UseCapex/capex-plugin", "Add the CAPEX marketplace (run inside a Claude Code session)"],
  ["/plugin install capex@capex-marketplace", "Install the CAPEX plugin (run inside a Claude Code session)"],
  ["/capex", "Show all available CAPEX commands"],
  ["capex status", "Check authentication status from your terminal"],
  ["capex login", "Log in to your CAPEX account from your terminal"],
  ["capex logout", "Clear credentials from your terminal"],
  ["capex conductor", "Print the CAPEX executable path for Conductor"],
  ["capex benchmark", "Run a side-by-side cost comparison (terminal CLI)"],
];

const AUTH_TOKEN =
  "eyJyZWZyZXNoVG9rZW4iOiI1dmtqbHQ2Y3BtemciLCJvcmdhbm6IjoiY2FwZXgtcGVyc29uYWwiLCJpYXQiOjE3MTYwMDAwMDB9";

function Copyable({
  text,
  children,
  className = "",
}: {
  text: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className={className}
    >
      {copied ? "Copied" : children}
    </button>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`card p-6 ${className}`}>{children}</div>;
}

function SectionTitle({
  eyebrow,
  title,
  desc,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mb-4">
      {eyebrow && (
        <div className="text-xs font-semibold uppercase tracking-widest text-accent">
          {eyebrow}
        </div>
      )}
      <h2 className="mt-1 text-lg font-semibold">{title}</h2>
      {desc && <p className="mt-1 text-sm text-muted">{desc}</p>}
    </div>
  );
}

export default function DashboardHome() {
  const { user } = useAuth();
  const [onLeaderboard, setOnLeaderboard] = useState(false);
  const referral = "CAPEX-T2DFQ7";
  const masked = useMemo(
    () => AUTH_TOKEN.slice(0, 44) + "…",
    []
  );

  return (
    <>
      <PageHeader title="Overview" />
      <div className="mx-auto max-w-5xl space-y-8 p-8">
        {/* Plan / usage */}
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-muted">
                Free Plan · Individual
              </div>
              <div className="mt-2 font-mono text-4xl font-bold">$0.00</div>
              <div className="text-sm text-muted">saved this month with CAPEX</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-lg font-semibold">
                $100.00 of $100.00 left
              </div>
              <div className="text-xs text-muted">usage resets Jun 1, 2026</div>
              <button className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-600">
                Upgrade to unlimited
              </button>
            </div>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full w-full bg-accent/40" />
          </div>
          <p className="mt-4 text-sm text-muted">
            No CAPEX sessions yet. Once you start using the CLI, your savings
            will appear here.
          </p>
        </Card>

        {/* Dashboard link */}
        <Card className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Dashboard</h2>
            <p className="text-sm text-muted">Charts, trends &amp; full usage history</p>
          </div>
          <Link
            href="/dashboard/usage"
            className="rounded-lg border border-border px-4 py-2 text-sm transition hover:bg-surface-2"
          >
            Open
          </Link>
        </Card>

        {/* Quick Setup */}
        <Card>
          <SectionTitle
            title="Quick Setup"
            desc="One command to get CAPEX running in your environment."
          />
          <div className="text-xs font-semibold uppercase tracking-widest text-muted">
            Install the CAPEX plugin
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-2 px-4 py-3">
            <code className="font-mono text-sm text-accent">
              <span className="text-muted">$ </span>npx @capex/install
            </code>
            <Copyable
              text="npx @capex/install"
              className="shrink-0 rounded-md border border-border px-2.5 py-1 text-xs text-muted transition hover:bg-surface hover:text-white"
            >
              Copy
            </Copyable>
          </div>
          <a href="#" className="mt-3 inline-block text-sm text-accent hover:underline">
            Full setup instructions (restart, auth, editors) →
          </a>
        </Card>

        {/* CLI Reference */}
        <Card>
          <SectionTitle eyebrow="Reference" title="CLI Reference" />
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Command</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cliCommands.map(([cmd, desc]) => (
                  <tr key={cmd} className="hover:bg-surface-2/50">
                    <td className="px-4 py-2.5 align-top">
                      <code className="font-mono text-accent">{cmd}</code>
                    </td>
                    <td className="px-4 py-2.5 align-top text-muted">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Auth token */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <SectionTitle title="Your Auth Token" />
            <span className="rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
              Active
            </span>
          </div>
          <p className="text-sm text-muted">
            Keep this token secure. Do not share it. Granted by{" "}
            <span className="text-white">Personal</span>.
          </p>
          <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-2 px-4 py-3">
            <code className="truncate font-mono text-sm text-muted">{masked}</code>
            <Copyable
              text={AUTH_TOKEN}
              className="shrink-0 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white transition hover:bg-accent-600"
            >
              Copy Token
            </Copyable>
          </div>
        </Card>

        {/* Benchmark */}
        <Card>
          <SectionTitle
            eyebrow="Prove it"
            title="Benchmark Your Savings"
          />
          <ol className="space-y-4">
            <BenchStep n={1} title="Open a clean git repo">
              The benchmark resets between runs. Commit your work first.
            </BenchStep>
            <BenchStep n={2} title="Run the benchmark">
              <code className="font-mono text-accent">/capex-benchmark</code>
              <span className="block text-muted">
                Pick 2–10 real tasks: features, refactors, bug fixes.
              </span>
            </BenchStep>
            <BenchStep n={3} title="See your savings">
              Cost, tokens, turns, and time, per task and aggregate.
            </BenchStep>
          </ol>
        </Card>

        {/* Leaderboard */}
        <Card>
          <SectionTitle title="Public leaderboard" />
          <p className="text-sm text-muted">
            Show me on the public CAPEX leaderboard. Only your name (and org
            name, for team plans) is published — never your code or session
            content.
          </p>
          <label className="mt-4 flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={onLeaderboard}
              onChange={(e) => setOnLeaderboard(e.target.checked)}
              className="h-4 w-4 accent-[var(--color-accent)]"
            />
            <span className="text-sm">Include me on the leaderboard</span>
          </label>
          <p className="mt-3 text-xs text-muted">
            Currently shown as: {user?.name ?? "Oz S."} — change it on the
            profile page.
          </p>
        </Card>

        {/* Refer a friend */}
        <Card>
          <SectionTitle
            title="Refer a Friend"
            desc="Share your code. They get 20% off, you get $20 credit."
          />
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-2 px-4 py-3">
            <code className="font-mono text-lg font-semibold text-accent">
              {referral}
            </code>
            <Copyable
              text={referral}
              className="shrink-0 rounded-md border border-border px-3 py-1.5 text-xs text-muted transition hover:bg-surface hover:text-white"
            >
              Copy Code
            </Copyable>
          </div>
          <div className="mt-4 space-y-3">
            <input
              placeholder="friend@email.com, another@email.com"
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent"
            />
            <input
              placeholder="Add a personal note (optional)"
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent"
            />
            <button className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition hover:bg-accent-600">
              Send Invites
            </button>
          </div>
          <p className="mt-4 text-sm text-muted">
            Need help? Reach us at{" "}
            <a href="mailto:support@usecapex.com" className="text-accent hover:underline">
              support@usecapex.com
            </a>
          </p>
        </Card>
      </div>
    </>
  );
}

function BenchStep({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent/15 font-mono text-sm text-accent">
        {n}
      </div>
      <div className="text-sm">
        <div className="font-medium">{title}</div>
        <div className="mt-0.5 text-muted">{children}</div>
      </div>
    </li>
  );
}
