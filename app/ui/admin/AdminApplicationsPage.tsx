import { ApplicationsTable } from "./ApplicationsTable";
import { AdminGuard } from "./AdminGuard";
import { fetchApplications } from "@/actions/applications";
import { fetchVacancies } from "@/actions/vacany";

type AdminPageProps = {
  searchParams?: Promise<{
    vacancyId?: string;
    from?: string;
    to?: string;
    sort?: string;
    search?: string;
  }>;
};

export default async function AdminApplicationsPage({
  searchParams,
}: AdminPageProps) {
  const params = (await searchParams) ?? {};
  const validSorts = ["recent", "oldest", "az", "za"] as const;
  const sortValue = params.sort && validSorts.includes(params.sort as any)
    ? (params.sort as "recent" | "oldest" | "az" | "za")
    : "recent";
  const filterValues = {
    vacancyId: params.vacancyId || undefined,
    from: params.from || undefined,
    to: params.to || undefined,
    sort: sortValue,
    search: params.search || "",
  };

  const [applications, vacancies] = await Promise.all([
    fetchApplications(filterValues),
    fetchVacancies(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:py-16 min-h-[calc(100vh-4rem)]">
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">
          Admin · Applications
        </p>
        <h2 className="text-3xl font-semibold">Incoming Applications</h2>
        <p className="max-w-3xl text-white/70">
          ცხრილი პირდაპირ Supabase-დან იკითხება. გამოიყენე ზედა ფილტრები, რომ
          სწრაფად მოძებნო განაცხადები.
        </p>
      </section>

      <AdminGuard>
        <ApplicationsTable
          applications={applications}
          vacancies={vacancies}
          filters={filterValues}
        />
      </AdminGuard>
    </main>
  );
}

