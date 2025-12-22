'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type DbUser = {
  _id?: { $oid?: string };
  supabaseUserId?: string;
  name?: string;
  title?: string;
  firstName?: string;
  middleNames?: string;
  surname?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  companyId?: { $oid?: string } | string;
  timeZone?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
};

const normalizeId = (value: any) => value?._id?.$oid ?? value?.$oid ?? value ?? "";

const formatDateTime = (value?: string | { $date?: string }) => {
  if (!value) return "Not set";
  const raw = typeof value === "string" ? value : value.$date;
  if (!raw) return "Not set";
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? "Not set" : date.toLocaleString();
};

export default function ProfilePage() {
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [companyName, setCompanyName] = useState<string>("Not set");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          data: { user: sessionUser },
        } = await supabase.auth.getUser();
        if (!sessionUser) {
          if (!cancelled) setDbUser(null);
          return;
        }

        const res = await fetch("/api/users_generic", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load user profile");
        const users: DbUser[] = await res.json();
        const matched =
          users.find(
            (u) =>
              u.supabaseUserId === sessionUser.id ||
              u.email?.toLowerCase() === (sessionUser.email ?? "").toLowerCase()
          ) ?? null;
        if (!cancelled) setDbUser(matched);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!dbUser?.companyId) {
      setCompanyName("Not set");
      return;
    }
    const companyId = normalizeId(dbUser.companyId);
    if (!companyId) return;

    const loadCompany = async () => {
      const res = await fetch(`/api/companies/${companyId}`, { cache: "no-store" });
      if (!res.ok) return;
      const company = await res.json();
      if (!cancelled) setCompanyName(company?.name ?? "Not set");
    };
    loadCompany();

    return () => {
      cancelled = true;
    };
  }, [dbUser?.companyId]);

  const fullName =
    dbUser?.name ||
    [dbUser?.firstName, dbUser?.middleNames, dbUser?.surname]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    "Name not provided";

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-2xl bg-surface/80 border-3 border-primary rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-accent">Profile</h1>
            <p className="text-sm text-foreground/70">Your account details from the directory.</p>
          </div>
          <Link
            href="/dashboard"
            className="border-3 px-5 py-2 rounded-lg text-sm font-bold text-background bg-primary border-primary hover:bg-background hover:text-primary transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {loading && <p className="text-foreground/70">Loading your profile...</p>}
        {!loading && error && <p className="text-red-500 text-sm">{error}</p>}

        {!loading && !error && dbUser && (
          <div className="grid gap-4">
            <Detail label="Name" value={fullName} />
            <Detail label="Email" value={dbUser.email || "Email not available"} />
            <Detail label="Title" value={dbUser.title || "Not set"} />
            {/* <Detail label="Role" value={dbUser.role || "Not set"} /> */}
            <Detail label="Phone" value={dbUser.phoneNumber || "Not set"} />
            <Detail label="Company" value={companyName} />
            <Detail label="Location" value={dbUser.location || "Not set"} />
            <Detail label="Time Zone" value={dbUser.timeZone || "Not set"} />
            <Detail label="Account Created" value={formatDateTime(dbUser.createdAt)} />
            <Detail label="Last Updated" value={formatDateTime(dbUser.updatedAt)} />
          </div>
        )}

        {!loading && !error && !dbUser && (
          <div className="flex flex-col gap-3">
            <p className="text-foreground/80">We could not find your profile.</p>
            <div className="flex gap-3">
              <Link
                href="/login"
                className="border-3 px-5 py-2 rounded-lg text-sm font-bold text-background bg-primary border-primary hover:bg-background hover:text-primary transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="border-3 px-5 py-2 rounded-lg text-sm font-bold text-background bg-accent border-accent hover:bg-background hover:text-accent transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-foreground/60">{label}</span>
      <span className="text-lg font-semibold break-words">{value}</span>
    </div>
  );
}
