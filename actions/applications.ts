"use server";

import { supabase } from "@/config/supabaseClient";

export type ApplicationRecord = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  vacanyId: string | number | null;
  resume: string | null;
  created_at: string | null;
};

export type ApplicationFilters = {
  vacancyId?: string;
  from?: string;
  to?: string;
  sort?: "recent" | "oldest" | "az" | "za";
  search?: string;
};

export async function fetchApplications(
  filters: ApplicationFilters = {}
): Promise<ApplicationRecord[]> {
  let query = supabase
    .from("apply")
    .select("id, name, email, phone, vacanyId, resume, created_at");

  if (filters.vacancyId) {
    query = query.eq("vacanyId", filters.vacancyId);
  }

  if (filters.from) {
    query = query.gte("created_at", filters.from);
  }

  if (filters.to) {
    query = query.lte("created_at", filters.to);
  }

  if (filters.search) {
    const term = filters.search.trim();
    if (term.length > 0) {
      query = query.or(
        `name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`
      );
    }
  }

  switch (filters.sort) {
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "az":
      query = query.order("name", { ascending: true }).order("created_at", {
        ascending: false,
      });
      break;
    case "za":
      query = query.order("name", { ascending: false }).order("created_at", {
        ascending: false,
      });
      break;
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error) {
    console.error("[fetchApplications] error", error.message);
    return [];
  }

  return data ?? [];
}


