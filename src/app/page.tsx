import Link from "next/link";
import { Logo } from "@/components/Logo";
import { PricingCalculator, ContactForm, Faq } from "@/components/landing";

const outcomes = [
  {
    tag: "Cost",
    value: "55%",
    title: "Less spent per token",
    body: "CAPEX trims wasted agent loops and redundant calls so every engineer squeezes far more shipped code out of the same Claude plan. The bigger your fleet, the bigger the line-item you claw back.",
  },
  {
    tag: "Velocity",
    value: "40%",
    title: "Quicker to a merged PR",
    body: "Tasks finish 30–40% sooner across the board. Multiply that by hundreds of developers and you recover thousands of engineering hours every quarter — without hiring.",
  },
  {
    tag: "Control",
    value: "100%",
    title: "Stays on the laptop",
    body: "CAPEX executes on each developer’s machine against your own Anthropic environment. Source, prompts, and keys never leave the boundaries your security team already governs.",
  },
];

const enterprise = [
  {
    title: "SSO & SAML",
    body: "Plug into Okta, Azure AD, or Google Workspace. SCIM keeps the roster in sync, so when someone leaves the directory they lose CAPEX access the same day.",
  },
  {
    title: "Granular roles",
    body: "Separate admin, billing, and member permissions. Decide exactly what each team and each developer can see inside the admin console.",
  },
  {
    title: "Exportable audit trail",
    body: "Every seat change and admin action is logged and available for export whenever compliance asks. Kept for the full term of your contract.",
  },
  {
    title: "One invoice",
    body: "Consolidated billing with NET-30 or annual prepay. Purchase orders and your procurement workflow are fully supported.",
  },
  {
    title: "Fleet-wide analytics",
    body: "A single dashboard showing token savings, seat utilization, and adoption broken down by team — the view a VP of Engineering actually wants.",
  },
  {
    title: "Use your own key",
    body: "Run CAPEX on top of your existing Anthropic enterprise agreement. Your Anthropic billing relationship stays exactly where it is.",
  },
  {
    title: "Named success contact",
    body: "A dedicated CSM, quarterly business reviews, and a shared Slack channel staffed by the engineers who build CAPEX.",
  },
  {
    title: "Priority support SLA",
    body: "One-business-hour response on P1 issues, with a direct escalation path into our engineering team.",
  },
  {
    title: "Roll out in one command",
    body: "Ship CAPEX through the tooling your developers already have — Homebrew, Brewfile, Nix, devcontainers, or MDM. There’s no new infrastructure to operate.",
  },
];

const security = [
  {
    title: "Your code never ships to us",
    body: "CAPEX runs in-process inside Claude Code on the developer’s machine. We sit outside the request path between your team and Anthropic — the code stays on the laptop.",
  },
  {
    title: "SOC 2 underway",
    body: "Our Type II audit is in flight. We’ll share current status and evidence under NDA on request.",
  },
  {
    title: "DPA ready to sign",
    body: "A standard Data Processing Agreement is prepared for counter-signature. We’re aligned with GDPR and CCPA.",
  },
  {
    title: "Encrypted end to end",
    body: "TLS 1.2+ on the wire and AES-256 at rest for the limited metadata we retain — account details and aggregated usage counts, nothing more.",
  },
  {
    title: "Questionnaires answered fast",
    body: "A pre-filled CAIQ Lite is available today, and we turn around custom security questionnaires within five business days.",
  },
  {
    title: "Responsible disclosure",
    body: "Report findings to security@usecapex.com for coordinated disclosure. Fixes go out through the normal plugin update channel.",
  },
];

const pilotSteps = [
  {
    title: "Pick a pilot squad",
    body: "Nominate up to 10 of your heaviest AI users to run CAPEX for 15 days — ideally across a couple of teams so the data generalizes.",
  },
  {
    title: "Drop it into their flow",
    body: "Install CAPEX inside the environments your team already uses. They get a direct Slack line to our engineers while we quietly track usage, performance, and adoption.",
  },
  {
    title: "Get the readout",
    body: "At the close we hand you a before-and-after on token savings, productivity, developer sentiment, and projected ROI — enough to make the rollout call with confidence.",
  },
];

const faqs = [
  {
    q: "Can CAPEX read our source code?",
    a: "No. The plugin executes in-process inside Claude Code on each developer’s laptop. Code, prompts, and Anthropic keys stay local. The only thing that reaches us is account information and aggregated usage telemetry — token counts and task metadata. The security page documents the exact data flow.",
  },
  {
    q: "Does this change how we pay Anthropic?",
    a: "Not at all. Your team keeps paying Anthropic directly, whether through Claude Code Pro/Max or an enterprise API contract. CAPEX simply makes each session cheaper, so the Anthropic invoice shrinks. The CAPEX subscription is billed separately, per seat.",
  },
  {
    q: "Will rolling this out disrupt our developers?",
    a: "No. Most orgs distribute CAPEX through tooling they already run — Homebrew, Brewfile, Nix, devcontainers, or MDM. The Claude Code experience is unchanged; it just runs faster and cheaper. Typical install takes under a minute.",
  },
  {
    q: "What happens if we decide to stop?",
    a: "There’s no lock-in. Uninstall the plugin and your developers are back on stock Claude Code immediately. Talk to our team and we’ll make the offboarding painless.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-ink/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
            <a href="#outcomes" className="hover:text-white">What you get</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <a href="#enterprise" className="hover:text-white">Enterprise</a>
            <a href="#security" className="hover:text-white">Security</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-muted hover:text-white">
              Sign in
            </Link>
            <a
              href="#contact"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-600"
            >
              Book a pilot
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="glow">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
          <div className="fade-up inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            An official Claude Code plugin
          </div>
          <h1 className="fade-up mt-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Take up to{" "}
            <span className="text-accent">55%</span> off your org&apos;s AI
            coding bill.
          </h1>
          <p className="fade-up mx-auto mt-6 max-w-2xl text-lg text-muted">
            CAPEX is an official Claude Code plugin built for engineering orgs
            running Claude at scale. It cuts token spend by up to 55% and makes
            the agent measurably faster — installed with a single command,
            running on your existing Claude subscription, entirely inside the
            workflows and infrastructure your team already trusts.
          </p>
          <div className="fade-up mt-10 flex items-center justify-center gap-4">
            <a
              href="#contact"
              className="rounded-lg bg-accent px-6 py-3 font-medium text-white transition hover:bg-accent-600"
            >
              Book a pilot
            </a>
            <Link
              href="/auth/login"
              className="rounded-lg border border-border px-6 py-3 font-medium text-white transition hover:bg-surface"
            >
              Open the app
            </Link>
          </div>
          <p className="fade-up mt-6 text-sm text-muted">
            Trusted by platform teams rolling Claude Code out to hundreds of
            developers.
          </p>
        </div>
      </section>

      {/* What you get */}
      <Section id="outcomes">
        <Heading
          eyebrow="What you get"
          title="One plugin your CFO, CTO, and CISO all sign off on."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {outcomes.map((o) => (
            <div key={o.tag} className="card p-8">
              <div className="text-sm font-semibold uppercase tracking-widest text-accent">
                {o.tag}
              </div>
              <div className="mt-4 font-mono text-6xl font-bold">{o.value}</div>
              <div className="mt-2 text-lg font-medium">{o.title}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{o.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Pricing & ROI */}
      <Section id="pricing" alt>
        <Heading
          eyebrow="Pricing & ROI"
          title="Watch the savings add up across your fleet."
          subtitle="$50 per seat per month, plus 10% of the savings we measure. Volume pricing kicks in at 25 seats. Move the sliders to size it for your org."
        />
        <div className="mt-12">
          <PricingCalculator />
        </div>
      </Section>

      {/* Enterprise */}
      <Section id="enterprise">
        <Heading
          eyebrow="Enterprise"
          title="Made for the teams who deploy to everyone."
          subtitle="Everything a platform team needs to push CAPEX across the whole org and satisfy security and finance along the way."
        />
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          {enterprise.map((f) => (
            <div key={f.title} className="bg-surface p-6">
              <h3 className="font-medium">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Security */}
      <Section id="security" alt>
        <Heading
          eyebrow="Security"
          title="Control that comes from architecture, not promises."
          subtitle="CAPEX works inside the environment you already run, so your code and prompts stay under your org’s control by default."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {security.map((s) => (
            <div key={s.title} className="card p-6">
              <h3 className="font-medium">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href="#contact" className="text-sm text-accent hover:underline">
            Read the full security page →
          </a>
        </div>
      </Section>

      {/* Pilot */}
      <Section id="pilot">
        <Heading
          eyebrow="15-day pilot"
          title="Prove the numbers in 15 days."
          subtitle="A free 15-day pilot built for a fast decision. Your team gets hands-on support, a direct line to CAPEX engineers, and a clean before-and-after on performance."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pilotSteps.map((s, i) => (
            <div key={s.title} className="card p-8">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-accent/15 font-mono text-accent">
                {i + 1}
              </div>
              <h3 className="mt-4 font-medium">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" alt>
        <Heading eyebrow="FAQ" title="What engineering leaders ask first." />
        <div className="mx-auto mt-12 max-w-3xl">
          <Faq items={faqs} />
        </div>
      </Section>

      {/* Contact / Book a pilot */}
      <Section id="contact">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Heading
              eyebrow="Book a pilot"
              title="See what CAPEX does at your scale."
              subtitle="Talk to the team that builds CAPEX and get straight answers. Procurement, security, and pricing questions all welcome."
              left
            />
            <a
              href="#"
              className="mt-8 inline-flex rounded-lg border border-border px-6 py-3 font-medium text-white transition hover:bg-surface"
            >
              Open calendar
            </a>
            <p className="mt-6 text-sm text-muted">
              Grab a 30-minute pilot call — we&apos;ll reply within one business
              day.
            </p>
          </div>
          <ContactForm />
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-muted md:flex-row">
          <Logo />
          <div className="flex items-center gap-6">
            <a href="#security" className="hover:text-white">Security</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <a href="mailto:sales@usecapex.com" className="hover:text-white">
              sales@usecapex.com
            </a>
          </div>
          <div>© {new Date().getFullYear()} CAPEX. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

function Section({
  id,
  alt,
  children,
}: {
  id?: string;
  alt?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={alt ? "bg-surface/40" : ""}>
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">{children}</div>
    </section>
  );
}

function Heading({
  eyebrow,
  title,
  subtitle,
  left,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  left?: boolean;
}) {
  return (
    <div className={left ? "" : "mx-auto max-w-2xl text-center"}>
      <div className="text-sm font-semibold uppercase tracking-widest text-accent">
        {eyebrow}
      </div>
      <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg leading-relaxed text-muted">{subtitle}</p>
      )}
    </div>
  );
}
