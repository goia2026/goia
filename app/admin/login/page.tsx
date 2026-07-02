"use client";

import { motion } from "framer-motion";
import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { GoiaLogo } from "@/components/GoiaLogo";

const luxuryEase = [0.16, 1, 0.3, 1] as const;

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    setLoading(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error || "Connexion impossible.");
      return;
    }

    const nextPath = new URLSearchParams(window.location.search).get("next") || "/admin";
    router.replace(nextPath);
    router.refresh();
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-black px-5 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(138,118,101,0.24),transparent_30rem),linear-gradient(145deg,#050505,#14100d_55%,#050505)]" />
      <div className="pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-[#8A7665]/18 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-16 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

      <motion.form
        initial={{ opacity: 0, y: 18, filter: "blur(14px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: luxuryEase }}
        onSubmit={handleSubmit}
        className="glass relative z-10 grid w-full max-w-md gap-6 rounded-[2rem] p-6 text-center shadow-[0_34px_110px_rgba(0,0,0,0.48)] sm:p-8"
      >
        <div className="mx-auto">
          <GoiaLogo compact mark />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#8A7665]">Studio privé</p>
          <h1 className="mt-3 text-3xl font-semibold">Administration GOIA</h1>
          <p className="mt-3 text-sm leading-6 text-white/55">
            Connectez-vous pour modifier la carte, les prix et les photos produits.
          </p>
        </div>

        <label className="grid gap-2 text-left text-xs uppercase tracking-[0.18em] text-white/42">
          Mot de passe
          <span className="flex h-14 items-center gap-3 rounded-2xl border border-white/10 bg-black/28 px-4 focus-within:border-[#8A7665]/70">
            <LockKeyhole size={18} className="text-[#8A7665]" />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className="min-w-0 flex-1 bg-transparent text-base normal-case tracking-normal text-white outline-none"
            />
          </span>
        </label>

        {error && (
          <p className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-14 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-[#f8f7f4] disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? "Connexion..." : "Entrer dans le studio"}
        </button>
      </motion.form>
    </main>
  );
}
