"use client";

/**
 * Modular auth layer.
 *
 * Today this is a mock provider backed by localStorage so the whole app runs
 * with no credentials. To switch to real Google OAuth later, replace the body
 * of `signInWithGoogle` / `signOut` / session bootstrapping with NextAuth (or
 * any provider) — the `AuthContextValue` interface and every consumer stay the
 * same.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const STORAGE_KEY = "capex.session";

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function persistUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else window.localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(loadStoredUser());
    setLoading(false);
  }, []);

  const setSession = useCallback((next: User | null) => {
    persistUser(next);
    setUser(next);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    // MOCK: pretend a Google popup returned a profile. Swap for NextAuth later.
    await new Promise((r) => setTimeout(r, 600));
    setSession({
      id: "mock-google-user",
      name: "Alex Morgan",
      email: "alex@capex.dev",
      avatarUrl: undefined,
    });
  }, [setSession]);

  const signInWithEmail = useCallback(
    async (email: string, _password: string) => {
      await new Promise((r) => setTimeout(r, 500));
      setSession({
        id: "mock-email-user",
        name: email.split("@")[0] || "User",
        email,
      });
    },
    [setSession]
  );

  const signOut = useCallback(async () => {
    setSession(null);
  }, [setSession]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, signInWithGoogle, signInWithEmail, signOut }),
    [user, loading, signInWithGoogle, signInWithEmail, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
