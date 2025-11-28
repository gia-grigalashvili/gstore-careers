'use client';

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN_FLAG_KEY = "gstore_admin_auth";

type AdminGuardProps = {
  children: ReactNode;
};

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const isAuthed =
      typeof window !== "undefined" &&
      window.localStorage.getItem(ADMIN_FLAG_KEY) === "true";

    if (!isAuthed) {
      router.replace("/admin");
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white text-xl">
        იტვირთება...
      </div>
    );
  }

  return <>{children}</>;
}
