"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) setError(error.message);
    else setMessage("Check your email to confirm your account!");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full bg-surface p-8 rounded-xl shadow-subtle border border-border">
        <h1 className="text-3xl font-semibold text-primary text-center mb-6">
          Create Your Account
        </h1>
        <p className="text-text-secondary text-center mb-8">
          Join CleanAudits to simplify your compliance workflow.
        </p>

        <form onSubmit={handleRegister} className="space-y-6">
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

          {message && <p className="text-success text-sm">{message}</p>}
          {error && <p className="text-error text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-surface font-medium py-3 rounded-lg hover:bg-accent hover:text-background transition"
          >
            {loading ? "Signing up..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:text-primary">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
