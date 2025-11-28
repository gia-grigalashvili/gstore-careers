'use client';

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

const ADMIN_FLAG_KEY = "gstore_admin_auth";

type AdminGuardProps = {
  children: ReactNode;
};

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();

  useEffect(() => {
    const isAuthed =
      typeof window !== "undefined" &&
      window.localStorage.getItem(ADMIN_FLAG_KEY) === "true";
    if (!isAuthed) {
      router.replace("/admin");
    }
  }, [router]);

  return <>{children}</>;
}


