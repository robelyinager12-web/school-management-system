"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiClient.post("/auth/login", { email, password });
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      router.push("/");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      <div className="aurora-bg absolute inset-0" />

      <div className="glass-panel relative z-10 w-full max-w-md rounded-2xl p-8 shadow-2xl">
        <h1 className="gradient-text text-3xl font-bold tracking-tight">
          Heroy
        </h1>
        <p className="mt-1 text-sm text-white/60">
          Sign in to your school management dashboard
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm text-white/70">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none transition focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20"
              placeholder="you@school.com"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none transition focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-pink-400 px-4 py-2.5 font-medium text-white transition hover:opacity-90",
              loading && "cursor-not-allowed opacity-60"
            )}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}