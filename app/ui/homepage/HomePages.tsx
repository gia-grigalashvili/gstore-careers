"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import VacancySearchFilter from "../components/VacancySearchFilter";
import { fetchVacancies } from "@/actions/vacany";

const shellClass =
  "mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-12 sm:px-6 lg:py-20";

interface Vacancy {
  id: string;
  role: string;
  description: string;
  type?: string;
  avarage_review_time?: string;
}

export default function HomePage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [filteredVacancies, setFilteredVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch vacancies on component mount
  useEffect(() => {
    const loadVacancies = async () => {
      try {
        setLoading(true);
        const data = await fetchVacancies();
        const vacanciesToSet = data || [];
        setVacancies(vacanciesToSet);
        setFilteredVacancies(vacanciesToSet);
      } catch (error) {
        console.error("Failed to fetch vacancies:", error);
        setVacancies([]);
        setFilteredVacancies([]);
      } finally {
        setLoading(false);
      }
    };

    loadVacancies();
  }, []);

  // Handle filtered results from search component
  const handleFilteredResults = (filtered: Vacancy[]) => {
    setFilteredVacancies(filtered);
  };

  return (
    <main className={shellClass}>
      {/* Hero Section */}
      <section className="space-y-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#3A6FF8]/10 px-4 py-2 text-xs font-medium tracking-wider text-[#3A6FF8]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#3A6FF8]"></span>
          შემოუერთდი გუნდს
        </div>
        
        <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
          კარიერა, სადაც{" "}
          <span className="bg-linear-to-r from-[#F5C96B] to-[#3A6FF8] bg-clip-text text-transparent">
            პროდუქტი და ადამიანები
          </span>{" "}
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

        {/* Search & Filter Component */}
        {!loading && (
          <VacancySearchFilter
            vacancies={vacancies}
            onFilteredResults={handleFilteredResults}
          />
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3A6FF8] border-t-transparent"></div>
          </div>
        ) : (
          /* Vacancies Grid */
          <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            {filteredVacancies.length === 0 ? (
              <article className="col-span-full rounded-2xl border border-white/5 bg-white/2 p-8 text-center backdrop-blur-sm">
                <div className="mx-auto max-w-md space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#3A6FF8]/10">
                    <svg className="h-6 w-6 text-[#3A6FF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {vacancies.length === 0 ? "ვაკანსიები მალე განახლდება" : "ვაკანსია ვერ მოიძებნა"}
                  </h3>
                  <p className="text-sm text-[#DDE2E9]/50">
                    {vacancies.length === 0 
                      ? "როგორც კი ახალი როლი დაემატება, ავტომატურად გამოჩნდება ამ გვერდზე"
                      : "სცადეთ სხვა ფილტრები ან გაასუფთავეთ ძებნა"
                    }
                  </p>
                </div>
              </article>
            ) : (
              filteredVacancies.map((vacancy) => (
                <article 
                  key={vacancy.id}
                  className="group flex flex-col justify-between gap-6 rounded-2xl border border-white/5 bg-linear-to-br from-white/3 to-transparent p-6 backdrop-blur-sm transition-all hover:border-[#3A6FF8]/20 hover:shadow-lg hover:shadow-[#3A6FF8]/5"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-xl font-semibold text-white group-hover:text-[#3A6FF8] transition-colors">
                        {vacancy.role}
                      </h3>
                      {vacancy.type && (
                        <span className="rounded-full bg-[#3A6FF8]/10 px-2.5 py-1 text-xs font-medium text-[#3A6FF8]">
                          {vacancy.type}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm leading-relaxed text-[#DDE2E9]/60">
                      {vacancy.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-3 border-t border-white/5 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                      href={`/apply?vacancyId=${vacancy.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3A6FF8] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#3A6FF8]/90 hover:shadow-lg hover:shadow-[#3A6FF8]/30"
                    >
                      გაგზავნე განაცხადი
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                    <span className="text-xs text-[#DDE2E9]/40">
                      განხილვა: {vacancy.avarage_review_time || "3 სამუშაო დღე"}
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </section>

      {/* Info Note */}
      <div className="rounded-xl border border-[#F5C96B]/10 bg-[#F5C96B]/5 p-4">
        <p className="text-center text-sm text-[#DDE2E9]/60">
          💡 „განაცხადის გაგზავნა&quot; ღილაკი გახსნის სრულ ფორმას, სადაც რეზიუმეს ატვირთავ
        </p>
      </div>
    </main>
  );
}