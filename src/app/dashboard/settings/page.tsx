"use client";

import { PageHeader } from "@/components/dashboard";
import { useAuth } from "@/lib/auth";

export default function SettingsPage() {
  const { user } = useAuth();
  return (
    <>
      <PageHeader title="Settings" />
      <div className="max-w-2xl space-y-6 p-8">
        <div className="card p-6">
          <h2 className="font-semibold">Profile</h2>
          <div className="mt-4 space-y-4">
            <Field label="Name" value={user?.name ?? ""} />
            <Field label="Email" value={user?.email ?? ""} />
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-semibold">Preferences</h2>
          <label className="mt-4 flex items-center justify-between text-sm">
            <span>Email me weekly savings reports</span>
            <input type="checkbox" defaultChecked className="accent-[var(--color-accent)]" />
          </label>
          <label className="mt-3 flex items-center justify-between text-sm">
            <span>Show attribution in commits</span>
            <input type="checkbox" className="accent-[var(--color-accent)]" />
          </label>
        </div>
      </div>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-xs text-muted">{label}</label>
      <input
        defaultValue={value}
        className="mt-1 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
      />
    </div>
  );
}
