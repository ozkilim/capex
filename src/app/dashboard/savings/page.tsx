"use client";

import { PageHeader, StatCard, MiniChart } from "@/components/dashboard";

export default function SavingsPage() {
  return (
    <>
      <PageHeader title="Savings" />
      <div className="space-y-6 p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Calls Saved" value="18,402" delta="12%" />
          <StatCard label="Tokens Saved" value="54.7M" delta="15%" />
          <StatCard label="Time Saved" value="612h" delta="9%" />
          <StatCard label="Est. Cost Saved" value="$4,128" delta="14%" />
        </div>
        <div className="card p-6">
          <h2 className="font-semibold">Savings over time</h2>
          <div className="mt-6">
            <MiniChart />
          </div>
        </div>
      </div>
    </>
  );
}
