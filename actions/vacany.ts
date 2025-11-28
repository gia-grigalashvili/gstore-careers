"use server";

import { supabase } from "@/app/lib/supabaseClient";

export type VacancyRecord = {
  id: string;
  name?: string | null;
  role?: string | null;
  description?: string | null;
  type?: string | null;
  avarage_review_time?: string | null;
  created_at?: string | null;
  [key: string]: unknown;
};

export async function fetchVacancies(): Promise<VacancyRecord[]> {
  const { data, error } = await supabase
    .from("vacancies")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[fetchVacancies] failed:", error.message);
    return [];
  }

  return data ?? [];
}
