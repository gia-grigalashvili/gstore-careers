'use client';

import { useState, useEffect, useCallback } from 'react';
import VacancySearchFilter from '../components/VacancySearchFilter';
import { EmptyState } from '../components/EmptyState';
import { VacancyCard } from '../components/VacancyCard';
import { Pagination } from '../components/Pagination';
import { usePagination } from '@/app/lib/usePagination';
import { fetchVacancies } from '@/actions/vacany';
import type { Vacancy } from '@/app/lib/actionAdminTypes';

const ITEMS_PER_PAGE = 6;

export default function HomePage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [filteredVacancies, setFilteredVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { currentPage, totalPages, currentItems, goToPage, reset } = usePagination(
    filteredVacancies,
    ITEMS_PER_PAGE
  );

 
  useEffect(() => {
    let isMounted = true;

    const loadVacancies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchVacancies();
        
        if (isMounted) {
          setVacancies(data as unknown as Vacancy[] || []);
          setFilteredVacancies(data as unknown as Vacancy[] || []);
        }
      } catch (err) {
        console.error('Failed to fetch vacancies:', err);
        if (isMounted) {
          setError('ვერ მოხერხდა ვაკანსიების ჩატვირთვა');
          setVacancies([]);
          setFilteredVacancies([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadVacancies();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleFilteredResults = useCallback((filtered: Vacancy[]) => {
    setFilteredVacancies(filtered);
    reset();
  }, [reset]);

  const hasVacancies = filteredVacancies.length > 0;
  const showPagination = totalPages > 1;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-12 sm:px-6 lg:py-20">
      
      <section className="space-y-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#3A6FF8]/10 px-4 py-2 text-xs font-medium tracking-wider text-[#3A6FF8]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#3A6FF8]" aria-hidden="true" />
          შემოუერთდი გუნდს
        </div>
        
        <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
          კარიერა, სადაც{' '}
          <span className="bg-linear-to-r from-[#F5C96B] to-[#3A6FF8] bg-clip-text text-transparent">
            პროდუქტი და ადამიანები
          </span>{' '}
          თანაბრად მნიშვნელოვანია
        </h1>
        
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#DDE2E9]/70 sm:text-lg">
          ვქმნით თანამედროვე, მონაცემებზე დაფუძნებულ retail გამოცდილებებს. 
          თუ გიყვარს სისუფთავე კოდი, სტრუქტურა და მომხმარებლის რეალური 
          პრობლემების გადაჭრა — ქვემოთ შენი მომავალი პოზიცია გელოდება.
        </p>
      </section>

      {/* Vacancies Section */}
      <section id="vacancies" className="space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#DDE2E9]/40">
            ღია როლები
          </p>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            აქტიური ვაკანსიები
          </h2>
          <p className="max-w-2xl text-[#DDE2E9]/60">
            ჩვენ ვეძებთ ადამიანებს, რომლებიც დეტალებსაც აქცევენ ყურადღებას და 
            შედეგზე არიან ორიენტირებული.
          </p>
        </div>

      
        {!loading && !error && (
          <VacancySearchFilter
            vacancies={vacancies}
            onFilteredResults={handleFilteredResults}
          />
        )}

      
        {!loading && !error && hasVacancies && (
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <p className="text-sm text-[#DDE2E9]/60">
              ნაპოვნია <span className="font-semibold text-white">{filteredVacancies.length}</span> ვაკანსია
            </p>
            {showPagination && (
              <p className="text-sm text-[#DDE2E9]/60">
                გვერდი {currentPage} / {totalPages}
              </p>
            )}
          </div>
        )}

 
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3A6FF8]/20 border-t-[#3A6FF8]" />
          </div>
        )}

     
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

      
        {!loading && !error && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
              {currentItems.length === 0 ? (
                <EmptyState hasVacancies={vacancies.length > 0} />
              ) : (
                currentItems.map(vacancy => (
                  <VacancyCard key={vacancy.id} vacancy={vacancy} />
                ))
              )}
            </div>

            {showPagination && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                className="pt-8"
              />
            )}
          </>
        )}
      </section>

  
      <div className="rounded-xl border border-[#F5C96B]/10 bg-[#F5C96B]/5 p-4">
        <p className="text-center text-sm text-[#DDE2E9]/60">
          💡 „განაცხადის გაგზავნა&quot; ღილაკი გახსნის სრულ ფორმას, სადაც რეზიუმეს ატვირთავ
        </p>
      </div>
    </main>
  );
}
