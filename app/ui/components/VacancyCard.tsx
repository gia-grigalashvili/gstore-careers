import Link from "next/link";
import type { Vacancy } from "@/app/lib/actionAdminTypes";

interface VacancyCardProps {
  vacancy: Vacancy;
}

export function VacancyCard({ vacancy }: VacancyCardProps) {
  const vacancyIdForUrl = String(vacancy.id);

  return (
    <article className="group flex flex-col justify-between gap-6 rounded-2xl border border-white/5 bg-linear-to-br from-white/3 to-transparent p-6 backdrop-blur-sm transition-all hover:border-[#3A6FF8]/20 hover:shadow-lg hover:shadow-[#3A6FF8]/5">
      <div className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-xl font-semibold text-white group-hover:text-[#3A6FF8] transition-colors">
            {vacancy.role}
          </h3> 
        </div>
        <p className="text-sm leading-relaxed text-[#DDE2E9]/60">
          {vacancy.description}
        </p>
      </div>
      
      <div className="flex flex-col gap-3 border-t border-white/5 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={`/apply?vacancyId=${vacancyIdForUrl}`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3A6FF8] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#3A6FF8]/90 hover:shadow-lg hover:shadow-[#3A6FF8]/30"
        >
          <span>მაგზავნე განაცხადი</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
        <span className="text-xs text-[#DDE2E9]/40">
          განხილვა: 3 სამუშაო დღე
        </span>
      </div>
    </article>
  );
}