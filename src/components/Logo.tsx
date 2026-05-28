import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 font-semibold">
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-sm font-bold text-white shadow-[0_0_20px_rgba(124,92,255,0.5)]">
        C
      </span>
      <span className="text-lg tracking-tight">CAPEX</span>
    </Link>
  );
}
