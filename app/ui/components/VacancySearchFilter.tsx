"use client";

import { useState, useMemo, useEffect } from "react";
import { fetchVacancies } from "@/actions/vacany";

// Types
interface VacancyFilters {
  search: string;
  role: string;
}

interface VacancySearchFilterProps {
  vacancies?: Vacancy[];
  onFilteredResults: (filtered: Vacancy[]) => void;
}

interface Vacancy {
  id: string;
  role: string;
  description: string;
  type?: string;
  avarage_review_time?: string;
}

export default function VacancySearchFilter({
  vacancies = [],
  onFilteredResults,
}: VacancySearchFilterProps) {
  const [filters, setFilters] = useState<VacancyFilters>({
    search: "",
    role: "",
  });
  const [allVacancies, setAllVacancies] = useState<Vacancy[]>([]);

  // Fetch all vacancies to get unique roles
  useEffect(() => {
    const loadVacancies = async () => {
      try {
        const data = await fetchVacancies();
        setAllVacancies(data || []);
      } catch (error) {
        console.error("Failed to fetch vacancies:", error);
        setAllVacancies([]);
      }
    };
    
    loadVacancies();
  }, []);

  // Extract unique roles from ALL vacancies
  const vacancyRoles = useMemo(() => {
    const roles = allVacancies
      .map((v) => v.role)
      .filter((role): role is string => !!role && role.trim() !== "");
    
    const uniqueRoles = Array.from(new Set(roles));
    
    return [
      { value: "", label: "ყველა როლი" },
      ...uniqueRoles.map((role) => ({
        value: role,
        label: role,
      })),
    ];
  }, [allVacancies]);

  // Memoized filtered results
  const filteredVacancies = useMemo(() => {
    // If no filters are active, return all vacancies
    if (!filters.search && !filters.role) {
      return vacancies;
    }

    return vacancies.filter((vacancy) => {
      const matchesSearch =
        !filters.search ||
        vacancy.role.toLowerCase().includes(filters.search.toLowerCase()) ||
        vacancy.description.toLowerCase().includes(filters.search.toLowerCase());

      const matchesRole = !filters.role || vacancy.role === filters.role;

      return matchesSearch && matchesRole;
    });
  }, [vacancies, filters]);

  // Sync filtered results with parent - only when filters change
  useEffect(() => {
    onFilteredResults(filteredVacancies);
  }, [filteredVacancies, onFilteredResults]);

  const handleFilterChange = (key: keyof VacancyFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const hasActiveFilters = filters.search !== "" || filters.role !== "";

  const clearFilters = () => {
    setFilters({
      search: "",
      role: "",
    });
  };

  return (
    <div className="space-y-4">
      {/* Search Bar + Role Filter */}
      <div className="grid gap-3 sm:grid-cols-[1fr,auto]">
        {/* Search Input */}
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#DDE2E9]/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="ძებნა პოზიციის ან აღწერის მიხედვით..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/2 py-3 pl-12 pr-4 text-white placeholder:text-[#DDE2E9]/40 backdrop-blur-sm transition-all focus:border-[#3A6FF8]/50 focus:outline-none focus:ring-2 focus:ring-[#3A6FF8]/20"
          />
        </div>

        {/* Role Filter - dynamically generated from fetchVacancies() */}
        <select
          value={filters.role}
          onChange={(e) => handleFilterChange("role", e.target.value)}
          className="rounded-xl border border-white/10 bg-white/2 px-4 py-3 text-sm text-white backdrop-blur-sm transition-all focus:border-[#3A6FF8]/50 focus:outline-none focus:ring-2 focus:ring-[#3A6FF8]/20"
        >
          {vacancyRoles.map((role) => (
            <option key={role.value} value={role.value} className="bg-[#0C1220]">
              {role.label}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filters & Results Count */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-[#DDE2E9]/60">
          <span className="font-medium text-[#3A6FF8]">
            {filteredVacancies.length}
          </span>
          <span>
            {filteredVacancies.length === 1 ? "ვაკანსია" : "ვაკანსია"} ნაპოვნია
          </span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[#DDE2E9]/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            ფილტრების გასუფთავება
          </button>
        )}
      </div>
    </div>
  );
}