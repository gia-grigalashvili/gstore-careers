'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { fetchVacancies } from '@/actions/vacany';
import type { Vacancy } from '@/app/lib/actionAdminTypes';

interface VacancyFilters {
  search: string;
  role: string;
}

interface VacancySearchFilterProps {
  vacancies: Vacancy[];
  onFilteredResults: (filtered: Vacancy[]) => void;
}

export default function VacancySearchFilter({
  vacancies,
  onFilteredResults,
}: VacancySearchFilterProps) {
  const [filters, setFilters] = useState<VacancyFilters>({
    search: '',
    role: '',
  });
  const [allVacancies, setAllVacancies] = useState<Vacancy[]>([]);
  const onFilteredResultsRef = useRef(onFilteredResults);
  
  
  useEffect(() => {
    onFilteredResultsRef.current = onFilteredResults;
  }, [onFilteredResults]);

  useEffect(() => {
    let isMounted = true;

    const loadVacancies = async () => {
      try {
        const data = await fetchVacancies();
        if (isMounted) {
          setAllVacancies(data as unknown as Vacancy[] || []);
        }
      } catch (error) {
        console.error('Failed to fetch vacancies:', error);
        if (isMounted) {
          setAllVacancies([]);
        }
      }
    };
    
    loadVacancies();

    return () => {
      isMounted = false;
    };
  }, []);

  
  const vacancyRoles = useMemo(() => {
    const uniqueRoles = Array.from(
      new Set(
        allVacancies
          .map(v => v.role)
          .filter((role): role is string => Boolean(role?.trim()))
      )
    );
    
    return [
      { value: '', label: 'ყველა როლი' },
      ...uniqueRoles.map(role => ({ value: role, label: role })),
    ];
  }, [allVacancies]);

  
  const filteredVacancies = useMemo(() => {
    if (!filters.search && !filters.role) {
      return vacancies;
    }

    const searchLower = filters.search.toLowerCase();

    return vacancies.filter(vacancy => {
      const roleText = vacancy.role || '';
      const descText = vacancy.description || '';
      
      const matchesSearch =
        !filters.search ||
        roleText.toLowerCase().includes(searchLower) ||
        descText.toLowerCase().includes(searchLower);

      const matchesRole = !filters.role || vacancy.role === filters.role;

      return matchesSearch && matchesRole;
    });
  }, [vacancies, filters]);


  useEffect(() => {
    onFilteredResultsRef.current(filteredVacancies);
  }, [filteredVacancies]);

  const handleFilterChange = useCallback((key: keyof VacancyFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ search: '', role: '' });
  }, []);

  const hasActiveFilters = filters.search || filters.role;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[1fr,auto]">
        
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#DDE2E9]/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="search"
            placeholder="ძებნა პოზიციის ან აღწერის მიხედვით..."
            value={filters.search}
            onChange={e => handleFilterChange('search', e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/2 py-3 pl-12 pr-4 text-white placeholder:text-[#DDE2E9]/40 backdrop-blur-sm transition-all focus:border-[#3A6FF8]/50 focus:outline-none focus:ring-2 focus:ring-[#3A6FF8]/20"
            aria-label="Search vacancies"
          />
        </div>

       
        <select
          value={filters.role}
          onChange={e => handleFilterChange('role', e.target.value)}
          className="rounded-xl border border-white/10 bg-white/2 px-4 py-3 text-sm text-white backdrop-blur-sm transition-all focus:border-[#3A6FF8]/50 focus:outline-none focus:ring-2 focus:ring-[#3A6FF8]/20"
          aria-label="Filter by role"
        >
          {vacancyRoles.map(role => (
            <option key={role.value} value={role.value} className="bg-[#0C1220]">
              {role.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-[#DDE2E9]/60">
          <span className="font-medium text-[#3A6FF8]">
            {filteredVacancies.length}
          </span>
          <span>
            {filteredVacancies.length === 1 ? 'ვაკანსია' : 'ვაკანსია'} ნაპოვნია
          </span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[#DDE2E9]/60 transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#3A6FF8]/50"
            aria-label="Clear all filters"
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
