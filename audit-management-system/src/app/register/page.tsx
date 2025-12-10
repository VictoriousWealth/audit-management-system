"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [title, setTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleNames, setMiddleNames] = useState("");
  const [surname, setSurname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const passwordsMatch = password === confirmPassword || confirmPassword === "";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          title,
          firstName,
          middleNames,
          surname,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const supabaseUserId = data?.user?.id;
    console.debug("Supabase signUp completed", { supabaseUserId, email });

    if (!supabaseUserId) {
      setError("Unable to complete registration. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supabaseUserId,
          email,
          title,
          firstName,
          middleNames,
          surname,
        }),
      });

      if (!response.ok) {
        const { error: apiError } = await response.json();
        console.debug("Persisting user failed", {
          supabaseUserId,
          status: response.status,
          apiError,
        });
        setError(apiError ?? "Failed to save user profile.");
        setLoading(false);
        return;
      }

      console.debug("Persisted user profile", { supabaseUserId });
      setLoading(false);
      router.push("/register/check-email");
    } catch (err) {
      console.debug("Error while persisting user profile", {
        error:
          err instanceof Error
            ? { name: err.name, message: err.message, stack: err.stack }
            : err,
      });
      setError("Failed to save user profile.");
      setLoading(false);
    }
  };

  return (
    <main className="w-full bg-background text-foreground flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full bg-surface p-8 rounded-xl shadow-subtle border border-border">
        <h1 className="text-3xl font-semibold text-primary text-center mb-6">
          Create Your Account
        </h1>
        <p className=" text-center mb-8">
          Join CleanAudits to simplify your compliance workflow.
        </p>

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Other Identifiers */}
          <div className="space-y-6">
            <div className="flex flex-row gap-3">
              <label className="flex flex-col w-full gap-1">
                <span className="text-sm ">Title (optional)</span>
                <input
                  id="title"
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
                />
              </label>
              <label className="flex flex-col w-full gap-1">
                <div className="flex flex-row">
                  <span className="text-sm">First name</span>
                  <span className="text-sm text-error">*</span>
                </div>
                <input
                  id="first-name"
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
                />
              </label>
            </div>
            <div className="flex flex-row gap-3">
              <label className="flex flex-col w-full gap-1">
                <span className="text-sm ">Middle names (Optional)</span>
                <input
                  id="middle-names"
                  type="text"
                  placeholder="Middle names"
                  value={middleNames}
                  onChange={(e) => setMiddleNames(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
                />
              </label>
              <label className="flex flex-col w-full gap-1">
                <div className="flex flex-row">
                  <span className="text-sm ">Surname</span>
                  <span className="text-sm text-error">*</span>
                </div>
                <input
                  id="surname"
                  type="text"
                  placeholder="Surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                  className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
                />
              </label>
            </div>
          </div>
          
          {/* Email */}
          <label className="flex flex-col gap-1">
            <div className="flex flex-row">
              <span className="text-sm">Email address</span>
              <span className="text-sm text-error">*</span>
            </div>
            <input
              id="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
            />
          </label>


          {/* Passwords */}
          {!passwordsMatch && (
            <p className="text-sm text-error">Passwords must match.</p>
          )}
          <div className="flex flex-row gap-3">
            <label className="flex flex-col w-full gap-1">
              <div className="flex flex-row">
                <span className="text-sm ">Password</span>
                <span className="text-sm text-error">*</span>
              </div>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
              />
            </label>
            
            <label className="flex flex-col w-full gap-1">
              <div className="flex flex-row">
                <span className="text-sm ">Confirm Password</span>
                <span className="text-sm text-error">*</span>
              </div>              
              <input
                id="confirm-password"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
              />
            </label>
          </div>

          {error && <p className="text-error text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-surface font-medium py-3 rounded-lg hover:bg-accent hover:text-background transition"
          >
            {loading ? "Signing up..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm  mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:text-primary">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
