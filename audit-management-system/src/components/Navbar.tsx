"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Scroll effect
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Get current Supabase user session
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });


    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  console.log("Logged in User: ", user);
  
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-300 ${
        scrolled
          ? "bg-surface/80 backdrop-blur-md border-b border-border shadow-subtle"
          : "bg-transparent"
      }`}
    >
      {/* --- Brand --- */}
      <Link
        href={user ? "/dashboard" : "/"}
        className="font-semibold text-4xl text-accent hover:text-primary transition-colors"
      >
        <span className="text-accent">Clean</span> 
        <span className="text-primary">Audits</span> 
      </Link>

      {/* --- Auth Buttons --- */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link href="/profile" className="flex items-center gap-2">
              <div className="p-5.5 text-center flex h-10 w-10 items-center justify-center rounded-full border-3 border-primary bg-primary/10 text-sm font-semibold uppercase text-primary">
                {(user.user_metadata.firstName)
                  .charAt(0)
                  .toUpperCase()}
                {(user.user_metadata.middleNames)
                  .charAt(0)
                  .toUpperCase()}
                {(user.user_metadata.surname)
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <span className="text-sm text-text-secondary">
                {user.email}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="border-3 px-5 py-2 pl-7 pr-7 rounded-lg text-sm font-black text-background bg-primary border-primary hover:bg-background hover:text-primary"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="border-3 px-5 py-2 pl-7 pr-7 rounded-lg text-sm font-black text-background bg-primary border-primary hover:bg-background hover:text-primary"
              >
              Log in 
            </Link>
            <Link
              href="/register"
              className="border-3 hover:bg-background hover:text-accent px-5 py-2 rounded-lg text-sm font-black border-accent hover:border-accent text-background bg-accent transition"
            >
              Sign Me Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
