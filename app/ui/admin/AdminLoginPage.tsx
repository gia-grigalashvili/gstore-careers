'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ADMIN_FLAG_KEY = "gstore_admin_auth";
const shellClass =
  "mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:py-16 min-h-[calc(100vh-4rem)]";
const cardClass =
  "rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_60px_rgba(12,18,32,0.35)]";
const inputClass =
  "rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder-white/50 focus:border-[#3A6FF8] focus:outline-none focus:ring-2 focus:ring-[#3A6FF8]/40";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const alreadyAuthed = window.localStorage.getItem(ADMIN_FLAG_KEY) === "true";
    if (alreadyAuthed) {
      router.replace("/admin/applications");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      setError("Admin credentials are not configured in env.");
      return;
    }

    setIsLoading(true);

    const isValid = email === adminEmail && password === adminPassword;
    if (!isValid) {
      setIsLoading(false);
      setError("არასწორი მონაცემები. სცადე კიდევ ერთხელ.");
      return;
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(ADMIN_FLAG_KEY, "true");
    }

    router.push("/admin/applications");
  };

  return (
    <main className={shellClass}>
      <section className="grid gap-6 lg:grid-cols-2">
        <article className={cardClass}>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">
            ადმინ პანელი
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            Gstore ადმინ პანელში შესვლა
          </h2>
          <p className="mt-2 text-sm text-white/70">
            ეს არის მარტივი ავტორიზაციის ფენა, რომელიც ემყარება env ცვლადებს და
            localStorage-ს მხოლოდ ამ ტექნიკური დავალებისთვის.
          </p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 text-sm text-white/80">
              <label htmlFor="admin-email">ადმინის ელფოსტა</label>
              <input
                id="admin-email"
                type="email"
                placeholder="admin@gstore.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-2 text-sm text-white/80">
              <label htmlFor="admin-password">პაროლი</label>
              <input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>
            {error && (
              <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </p>
            )}
            <button
              className="inline-flex w-full items-center justify-center rounded-full bg-[#3A6FF8] px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_30px_rgba(58,111,248,0.35)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "იმოწმება..." : "შესვლა ადმინ პანელში"}
            </button>
          </form>
        </article>
        <aside className={cardClass}>
          <h3 className="text-lg font-semibold">შიდა გამოყენებისთვის</h3>
          <p className="mt-4 text-sm text-white/70">
            • რეალურ პროდუქტში ასეთ auth-ს არ გამოვიყენებდით — მხოლოდ
            დემონსტრაციის მიზნითაა.
            <br />
            • env ცვლადებში (NEXT_PUBLIC_ADMIN_EMAIL / NEXT_PUBLIC_ADMIN_PASSWORD)
            შეგიძლია შეცვალო შენი ტესტი კრედენშალები.
          </p>
        </aside>
      </section>
    </main>
  );
}


