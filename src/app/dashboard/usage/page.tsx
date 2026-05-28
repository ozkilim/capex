"use client";

import { PageHeader, StatCard, MiniChart } from "@/components/dashboard";

export default function UsagePage() {
  return (
    <>
      <PageHeader title="Usage" />
      <div className="space-y-6 p-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Sessions" value="312" delta="8%" />
          <StatCard label="Commands run" value="6,940" delta="11%" />
          <StatCard label="Avg / session" value="22" />
        </div>
        <div className="card p-6">
          <h2 className="font-semibold">Commands over time</h2>
          <div className="mt-6">
            <MiniChart />
          </div>
        </div>
      </div>
    </>
  );
}
