'use client';

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ApplicationRecord } from "@/actions/applications";
import type { VacancyRecord } from "@/actions/vacany";  

type ApplicationsTableProps = {
  applications: ApplicationRecord[];
  vacancies: VacancyRecord[];
  filters: {
    vacancyId?: string;
    from?: string;
    to?: string;
    sort?: string;
    search?: string;
  };
};

const sortOptions = [
  { label: "უახლესი ჯერ", value: "recent" },
  { label: "უფრო ძველი", value: "oldest" },
  { label: "ა → ჰ", value: "az" },
  { label: "ჰ → ა", value: "za" },
];

export function ApplicationsTable({
  applications,
  vacancies,
  filters,
}: ApplicationsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const vacancyOptions = useMemo(
    () => vacancies.map((vacancy) => ({ id: vacancy.id, label: vacancy.role || vacancy.name || vacancy.id })),
    [vacancies]
  );

  const vacancyLabel = (id: string | number | null) => {
    if (!id) return "—";
    const match = vacancyOptions.find((option) => String(option.id) === String(id));
    return match?.label || id;
  };

  const setParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (value && value.length > 0) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setParam(name, value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const term = formData.get("search")?.toString() ?? "";
    setParam("search", term);
  };

  const handleResetFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const formatDate = (value: string | null) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("ka-GE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateForCsv = (value: string | null) => {
    if (!value) return "-";
    try {
      return new Date(value).toISOString();
    } catch {
      return value;
    }
  };

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const csvContent = useMemo(() => {
    if (applications.length === 0) return "";
    const header = ["სახელი", "ელფოსტა", "ვაკანსია", "თარიღი", "რეზიუმე URL"];
    const rows = applications.map((app) => [
      `"${(app.name || "").replace(/"/g, '""')}"`,
      `"${(app.email || "").replace(/"/g, '""')}"`,
      `"${String(vacancyLabel(app.vacanyId) || "").replace(/"/g, '""')}"`,
      `"${formatDateForCsv(app.created_at)}"`,
      `"${(app.resume || "").replace(/"/g, '""')}"`,
    ]);
    return [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
  }, [applications, vacancies]);

  const handleExportCsv = () => {
    if (!csvContent) return;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "applications.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  const filterInputClass =
    "rounded-2xl border border-white/20 bg-white px-4 py-3 text-sm text-[#0C1220] placeholder-black/40 focus:border-[#3A6FF8] focus:outline-none focus:ring-2 focus:ring-[#3A6FF8]/40";

  const ghostButtonClass =
    "rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/50";
  const primaryButtonClass =
    "rounded-full bg-[#3A6FF8] px-4 py-2 text-sm font-semibold text-white shadow-[0_15px_30px_rgba(58,111,248,0.35)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_25px_60px_rgba(12,18,32,0.35)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-center">
          <select
            name="vacancyId"
            value={filters.vacancyId || ""}
            onChange={handleFilterChange}
            className={filterInputClass}
          >
            <option value="">ყველა ვაკანსია</option>
            {vacancyOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="from"
            value={filters.from || ""}
            onChange={handleFilterChange}
            className={filterInputClass}
          />
          <input
            type="date"
            name="to"
            value={filters.to || ""}
            onChange={handleFilterChange}
            className={filterInputClass}
          />
          <select
            name="sort"
            value={filters.sort || "recent"}
            onChange={handleFilterChange}
            className={filterInputClass}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <form
            className="flex flex-1 items-center gap-2"
            onSubmit={handleSearchSubmit}
          >
            <input
              type="search"
              name="search"
              defaultValue={filters.search || ""}
              placeholder="ძებნა (სახელი, ელფოსტა)"
              className={`${filterInputClass} flex-1`}
            />
            <button
              type="submit"
              className="rounded-2xl bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/30"
            >
              ძიება
            </button>
          </form>
          <div className="flex flex-wrap gap-2 lg:ml-auto">
            <button
              type="button"
              className={ghostButtonClass}
              onClick={handleResetFilters}
            >
              გასუფთავება
            </button>
            <button
              type="button"
              className={primaryButtonClass}
              onClick={handleExportCsv}
              disabled={!csvContent}
            >
              CSV ექსპორტი
            </button>
          </div>
        </div>
      </div>

      <div className="max-h-[70vh] overflow-x-auto overflow-y-auto rounded-3xl border border-white/10 bg-white/5 shadow-[0_25px_60px_rgba(12,18,32,0.35)]">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-white/5 text-left text-white/60">
              <th className="px-5 py-4 font-semibold">სახელი</th>
              <th className="px-5 py-4 font-semibold">ელფოსტა</th>
              <th className="px-5 py-4 font-semibold">ვაკანსია</th>
              <th className="px-5 py-4 font-semibold">თარიღი</th>
              <th className="px-5 py-4 font-semibold">რეზიუმე</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-12 text-center text-white/60"
                >
                  განაცხადი არ მოიძებნა არჩეული ფილტრით.
                </td>
              </tr>
            ) : (
              applications.map((application, index) => (
                <tr
                  key={application.id}
                  className={index % 2 === 0 ? "bg-transparent" : "bg-white/5"}
                >
                  <td className="px-5 py-4 text-white">{application.name}</td>
                  <td className="px-5 py-4 text-white/80">
                    {application.email}
                  </td>
                  <td className="px-5 py-4 text-white/80">
                    {vacancyLabel(application.vacanyId)}
                  </td>
                  <td className="px-5 py-4 text-white/70" suppressHydrationWarning>
                    {formatDate(application.created_at)}
                  </td>
                  <td className="px-5 py-4">
                    {application.resume ? (
                      <Link
                        className="text-[#F5C96B] underline-offset-4 hover:underline"
                        href={application.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        ჩამოტვირთვა
                      </Link>
                    ) : (
                      <span className="text-white/40">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


