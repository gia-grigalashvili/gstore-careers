'use client';

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN_FLAG_KEY = "gstore_admin_auth";

type AdminGuardProps = {
  children: ReactNode;
};

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const authFlag = window.localStorage.getItem(ADMIN_FLAG_KEY) === "true";
        
        if (!authFlag) {
          router.replace("/admin");
        } else {
          setIsAuthed(true);
        }
      }
      setChecking(false);
    };

    checkAuth();
  }, [router]);

  if (checking) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white text-xl">
        იტვირთება...
      </div>
    );
  }

  if (!isAuthed) {
    return null;
  }

  return <>{children}</>;
}
