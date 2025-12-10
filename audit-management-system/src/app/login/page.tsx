"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const existsResponse = await fetch(
        `/api/users?email=${encodeURIComponent(email)}`
      );

      if (!existsResponse.ok) {
        setError("Either email and/or password is incorrect.");
        setLoading(false);
        return;
      }

      const { exists } = await existsResponse.json();

      if (!exists) {
        setError("Either email and/or password is incorrect.");
        setLoading(false);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        const message = signInError.message.toLowerCase();
        if (message.includes("confirm")) {
          setError("You did not confirm their email yet.");
        } else {
          setError("Either email and/or password is incorrect.");
        }
        setLoading(false);
        return;
      }

      window.location.href = "/dashboard";
    } catch (err) {
      setError("Either email and/or password is incorrect.");
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  return (
    <div className="bg-background text-foreground flex items-center justify-center px-6 py-16 w-full">
      <div className="max-w-md w-full bg-surface p-8 rounded-xl shadow-subtle border border-border">
        <h1 className="text-3xl font-semibold text-primary text-center mb-6">
          Welcome Back
        </h1>
        <p className="text-text-secondary text-center mb-8">
          Sign in to your CleanAudits account
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
          />

          {error && <p className="text-error text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-surface font-medium py-3 rounded-lg hover:bg-accent hover:text-background transition"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          Don’t have an account?{" "}
          <Link href="/register" className="text-accent hover:text-primary">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
