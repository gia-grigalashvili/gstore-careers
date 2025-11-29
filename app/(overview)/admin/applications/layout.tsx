import { AdminGuard } from "@/app/ui/admin/AdminGuard";

export default function ApplicationsLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return <AdminGuard>{children}</AdminGuard>;
}