import { AdminGuard } from "@/app/ui/admin/AdminGuard";

export default function ApplicationsLayout({ children }) {
  return <AdminGuard>{children}</AdminGuard>;
}
