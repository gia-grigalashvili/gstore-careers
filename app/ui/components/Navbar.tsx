/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ADMIN_FLAG_KEY = "gstore_admin_auth";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const flag = window.localStorage.getItem(ADMIN_FLAG_KEY);
    setIsAdmin(flag === "true");
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ADMIN_FLAG_KEY);
    }
    setIsAdmin(false);
    router.push("/admin");
  };

  const linkClass = (target: string) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      pathname === target
        ? "bg-white/20 text-white"
        : "text-white/70 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0C1220]/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <button
          type="button"
          className="flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40"
          onClick={() => router.push("/")}
        >
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{
              background:
                "linear-gradient(135deg, #F5C96B 0%, #3A6FF8 100%)",
            }}
          />
          <span className="flex flex-col leading-tight">
            <span>Gstore</span>
            <span className="text-xs font-normal text-white/70">Careers</span>
          </span>
        </button>
        <div className="ml-auto flex items-center gap-4">
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/" className={linkClass("/")}>
              კარიერა
            </Link>
            {isAdmin && (
              <Link
                href="/admin/applications"
                className={linkClass("/admin/applications")}
              >
                ადმინი
              </Link>
            )}
          </nav>
          {isAdmin && isAdminRoute && (
            <button
              type="button"
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/50"
              onClick={handleLogout}
            >
              გასვლა
            </button>
          )}
        </div>
      </div>
    </header>
  );
}


