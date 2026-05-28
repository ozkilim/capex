"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: "▦" },
  { href: "/dashboard/token", label: "Token / Connect", icon: "⚷" },
  { href: "/dashboard/usage", label: "Usage", icon: "∿" },
  { href: "/dashboard/savings", label: "Savings", icon: "✦" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  async function handleLogout() {
    await signOut();
    router.push("/");
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex h-16 items-center px-6">
        <Logo href="/dashboard" />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {nav.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-accent/15 text-white"
                  : "text-muted hover:bg-surface-2 hover:text-white"
              }`}
            >
              <span className="w-4 text-center text-accent">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-accent text-sm font-semibold text-white">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{user?.name}</div>
            <div className="truncate text-xs text-muted">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-muted transition hover:bg-surface-2 hover:text-white"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
