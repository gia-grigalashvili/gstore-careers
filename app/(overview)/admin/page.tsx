/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const ADMIN_FLAG_KEY = "gstore_admin_auth";

const AdminApplicationsPage = dynamic(
  () => import('@/app/ui/admin/AdminApplicationsPage'),
  { ssr: false }
);

export default function Page() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const isAuthed = window.localStorage.getItem(ADMIN_FLAG_KEY) === "true";
    if (!isAuthed) {
      router.replace("/admin"); 
    } else {
      
      setAllowed(true);
    }
  }, [router]);

  if (!allowed) {
    return <p className="text-white p-10">Loading...</p>;
  }

  return <AdminApplicationsPage />;
}
