import AdminApplicationsPage from "@/app/ui/admin/AdminApplicationsPage";

type PageProps = {
  searchParams?: Promise<{
    vacancyId?: string;
    from?: string;
    to?: string;
    sort?: string;
    search?: string;
  }>;
};

export default function Page({ searchParams }: PageProps) {
  return <AdminApplicationsPage searchParams={searchParams} />;
}