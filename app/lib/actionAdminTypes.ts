// lib/types.ts

export interface Vacancy {
  id: string;
  title: string;
  description: string;
  department: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  vacancy_id: string;
  name: string;
  email: string;
  phone: string;
  resume_url: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  created_at: string;
}

export interface ApplicationWithVacancy extends Application {
  vacancy?: Vacancy;
}

export interface ApplicationFilters {
  vacancy_id?: string;
  status?: Application["status"];
  dateFrom?: string;
  dateTo?: string;
}

export interface Statistics {
  total: number;
  today: number;
  statusCounts: {
    pending: number;
    reviewed: number;
    accepted: number;
    rejected: number;
  };
}

export type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

export interface UploadResponse {
  url: string | null;
  fileName: string | null;
  error: string | null;
}

// Status labels for UI
export const STATUS_LABELS: Record<Application["status"], string> = {
  pending: "განსახილველი",
  reviewed: "განხილული",
  accepted: "მიღებული",
  rejected: "უარყოფილი",
};

// Status colors for UI
export const STATUS_COLORS: Record<Application["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewed: "bg-blue-100 text-blue-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};