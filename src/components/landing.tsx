"use client";

import { useMemo, useState } from "react";

/* ---------------------------------------------------------------- *
 * Pricing / ROI calculator
 * Per-seat rate adjusts automatically based on seat count.
 * Fee = seats * perSeat + 10% of measured savings.
 * ---------------------------------------------------------------- */

function perSeatRate(seats: number): number {
  if (seats >= 250) return 25;
  if (seats >= 100) return 30;
  if (seats >= 50) return 38;
  if (seats >= 25) return 45;
  return 50;
}

function fmtUSD(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function fmtCompact(n: number): string {
  if (Math.abs(n) >= 1000)
    return "$" + (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "K";
  return "$" + Math.round(n).toLocaleString("en-US");
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  display: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm text-muted">{label}</span>
        <span className="font-mono text-lg font-semibold">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--color-accent)]"
      />
    </div>
  );
}

export function PricingCalculator() {
  const [engineers, setEngineers] = useState(100);
  const [spend, setSpend] = useState(100_000);
  const [savingsPct, setSavingsPct] = useState(40);

  const calc = useMemo(() => {
    const perSeat = perSeatRate(engineers);
    const savings = spend * (savingsPct / 100);
    const seatFee = engineers * perSeat;
    const successFee = savings * 0.1;
    const fee = seatFee + successFee;
    const net = savings - fee;
    const roi = fee > 0 ? net / fee : 0;
    return {
      perSeat,
      savings,
      fee,
      net,
      roi,
      totalMonthlyCost: spend - savings + fee,
    };
  }, [engineers, spend, savingsPct]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* 01 Inputs */}
      <div className="card p-6">
        <div className="mb-5 text-xs font-semibold uppercase tracking-widest text-accent">
          01 — Inputs
        </div>
        <div className="space-y-6">
          <Slider
            label="Engineers"
            value={engineers}
            min={5}
            max={1000}
            step={5}
            onChange={setEngineers}
            display={engineers.toLocaleString()}
          />
          <Slider
            label="Monthly Anthropic spend"
            value={spend}
            min={5_000}
            max={1_000_000}
            step={5_000}
            onChange={setSpend}
            display={fmtCompact(spend)}
          />
          <Slider
            label="Observed savings"
            value={savingsPct}
            min={10}
            max={55}
            step={1}
            onChange={setSavingsPct}
            display={savingsPct + "%"}
          />
        </div>
        <p className="mt-6 text-xs text-muted">
          Per-seat rate: {fmtUSD(calc.perSeat)}/mo at {engineers} seats.
        </p>
      </div>

      {/* 02 Savings */}
      <div className="card p-6">
        <div className="mb-5 text-xs font-semibold uppercase tracking-widest text-accent">
          02 — Savings
        </div>
        <div className="space-y-6">
          <div>
            <div className="text-sm text-muted">Net / month</div>
            <div className="mt-1 font-mono text-4xl font-bold text-emerald-400">
              {fmtCompact(calc.net)}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted">Net / year</div>
            <div className="mt-1 font-mono text-4xl font-bold text-emerald-400">
              {fmtCompact(calc.net * 12)}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted">ROI</div>
            <div className="mt-1 font-mono text-4xl font-bold">
              {calc.roi.toFixed(1)}×
            </div>
          </div>
        </div>
      </div>

      {/* 03 Breakdown */}
      <div className="card p-6">
        <div className="mb-5 text-xs font-semibold uppercase tracking-widest text-accent">
          03 — Breakdown
        </div>
        <dl className="space-y-3 text-sm">
          <Row label="Monthly Anthropic spend" value={fmtUSD(spend)} />
          <Row
            label={`− CAPEX savings (${savingsPct}%)`}
            value={"−" + fmtUSD(calc.savings)}
            tone="down"
          />
          <Row
            label="+ CAPEX fee"
            value={"+" + fmtUSD(calc.fee)}
            tone="up"
          />
          <div className="my-2 h-px bg-border" />
          <Row
            label="Total monthly cost"
            value={fmtUSD(calc.totalMonthlyCost)}
            strong
          />
          <Row
            label="Total monthly savings"
            value={fmtUSD(calc.net)}
            strong
            tone="down"
          />
        </dl>
        <p className="mt-5 text-xs text-muted">
          Numbers are estimates. Per-seat rate adjusts automatically based on
          seat count.
        </p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  tone,
  strong,
}: {
  label: string;
  value: string;
  tone?: "up" | "down";
  strong?: boolean;
}) {
  const color =
    tone === "down"
      ? "text-emerald-400"
      : tone === "up"
        ? "text-amber-400"
        : "";
  return (
    <div className="flex items-center justify-between">
      <dt className={strong ? "font-medium" : "text-muted"}>{label}</dt>
      <dd className={`font-mono ${strong ? "font-semibold" : ""} ${color}`}>
        {value}
      </dd>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * Contact form (mock submit)
 * ---------------------------------------------------------------- */

export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="card grid place-items-center p-10 text-center">
        <div className="text-2xl">✓</div>
        <h3 className="mt-3 text-lg font-semibold">Thanks — we&apos;ll be in touch.</h3>
        <p className="mt-1 text-sm text-muted">
          We reply within one business day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="card space-y-4 p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Your name" name="name" required />
        <Input label="Work email" name="email" type="email" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Company" name="company" required />
        <Input label="Engineering team size" name="size" type="number" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm text-muted">
          Anything we should know? (optional)
        </label>
        <textarea
          name="notes"
          rows={4}
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent"
        />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-accent px-6 py-2.5 font-medium text-white transition hover:bg-accent-600"
      >
        Send
      </button>
      <p className="text-xs text-muted">
        Prefer email?{" "}
        <a className="text-accent hover:underline" href="mailto:sales@usecapex.com">
          sales@usecapex.com
        </a>
      </p>
    </form>
  );
}

function Input({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-muted">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent"
      />
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * FAQ accordion
 * ---------------------------------------------------------------- */

export function Faq({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="bg-surface">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-medium">{it.q}</span>
              <span className="text-accent">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
              <p className="px-6 pb-5 text-sm leading-relaxed text-muted">
                {it.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
