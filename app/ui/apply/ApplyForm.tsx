'use client';

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitApplication, ApplyActionState } from "@/actions/apply";
import type { VacancyRecord } from "@/actions/vacany";
import { useEffect, useState } from "react";

type ApplyFormProps = {
  vacancy?: VacancyRecord;
};

type FieldErrors = {
  name?: string;
  email?: string;
  phone?: string;
  resume?: string;
};

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      className="inline-flex w-full items-center justify-center rounded-full bg-[#3A6FF8] px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_30px_rgba(58,111,248,0.35)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      type="submit"
      disabled={pending || disabled}
    >
      {pending ? "გზავნა..." : "განაცხადის გაგზავნა"}
    </button>
  );
}

export function ApplyForm({ vacancy }: ApplyFormProps) {
  const initialState: ApplyActionState = { status: "idle" };
  const [state, formAction, isPending] = useActionState(
    submitApplication,
    initialState
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (state.status === "success") {
      const form = document.getElementById("apply-form") as HTMLFormElement | null;
      form?.reset();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFieldErrors({});
      setTouched({});
    }
  }, [state.status]);

  const validateField = (name: string, value: string, files?: FileList | null) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "სახელი და გვარი სავალდებულოა";
        } else if (value.trim().length < 2) {
          error = "სახელი უნდა შედგებოდეს მინიმუმ 2 სიმბოლოსგან";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "ელფოსტა სავალდებულოა";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "არასწორი ელფოსტის ფორმატი";
        }
        break;
      case "phone":
        if (!value.trim()) {
          error = "ტელეფონი სავალდებულოა";
        } else if (value.trim().length < 9) {
          error = "ტელეფონი უნდა შედგებოდეს მინიმუმ 9 სიმბოლოსგან";
        } else if (!/^[\d\s+\-()]+$/.test(value)) {
          error = "არასწორი ტელეფონის ფორმატი";
        }
        break;
      case "resume":
        if (files && files.length > 0) {
          const file = files[0];
          if (file.type !== "application/pdf") {
            error = "მხოლოდ PDF ფაილები დაშვებულია";
          } else if (file.size > 10 * 1024 * 1024) {
            error = "ფაილის ზომა არ უნდა აღემატებოდეს 10MB-ს";
          }
        } else if (!files || files.length === 0) {
          error = "CV-ის ატვირთვა სავალდებულოა";
        }
        break;
    }

    setFieldErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value, files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (touched[name]) {
      validateField(name, value, files);
    }
  };

  return (
    <form
      id="apply-form"
      className="space-y-5"
      action={formAction}
    >
      <div className="flex flex-col gap-2 text-sm text-white/80">
        <label htmlFor="name">სახელი და გვარი *</label>
        <input
          id="name"
          name="name"
          placeholder="მაგ: ანა გიორგაძე"
          required
          minLength={2}
          onBlur={handleBlur}
          onChange={handleChange}
          className={`rounded-2xl border ${
            touched.name && fieldErrors.name
              ? "border-red-400/60 bg-red-500/10"
              : "border-white/15 bg-white/5"
          } px-4 py-3 text-base text-white placeholder-white/50 focus:border-[#3A6FF8] focus:outline-none focus:ring-2 focus:ring-[#3A6FF8]/40`}
        />
        {touched.name && fieldErrors.name && (
          <p className="text-xs text-red-300">{fieldErrors.name}</p>
        )}
      </div>
      <div className="flex flex-col gap-2 text-sm text-white/80">
        <label htmlFor="email">ელფოსტა *</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="ana@gstore.com"
          required
          onBlur={handleBlur}
          onChange={handleChange}
          className={`rounded-2xl border ${
            touched.email && fieldErrors.email
              ? "border-red-400/60 bg-red-500/10"
              : "border-white/15 bg-white/5"
          } px-4 py-3 text-base text-white placeholder-white/50 focus:border-[#3A6FF8] focus:outline-none focus:ring-2 focus:ring-[#3A6FF8]/40`}
        />
        {touched.email && fieldErrors.email && (
          <p className="text-xs text-red-300">{fieldErrors.email}</p>
        )}
      </div>
      <div className="flex flex-col gap-2 text-sm text-white/80">
        <label htmlFor="phone">ტელეფონი *</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+995 5XX XX XX XX"
          required
          minLength={9}
          maxLength={13}
          pattern="[\d\s\+\-\(\)]+"
          title="გთხოვთ შეიყვანოთ სწორი ტელეფონის ნომერი"
          onBlur={handleBlur}
          onChange={handleChange}
          className={`rounded-2xl border ${
            touched.phone && fieldErrors.phone
              ? "border-red-400/60 bg-red-500/10"
              : "border-white/15 bg-white/5"
          } px-4 py-3 text-base text-white placeholder-white/50 focus:border-[#3A6FF8] focus:outline-none focus:ring-2 focus:ring-[#3A6FF8]/40`}
        />
        {touched.phone && fieldErrors.phone && (
          <p className="text-xs text-red-300">{fieldErrors.phone}</p>
        )}
      </div>
      {vacancy ? (
        <div className="flex flex-col gap-2 text-sm text-white/80">
          <label htmlFor="vacancyDisplay">ვაკანსია</label>
          <input
            id="vacancyDisplay"
            value={vacancy.role || vacancy.name || String(vacancy.id)}
            readOnly
            className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white"
          />
          <input
            type="hidden"
            name="vacancyId"
            value={String(vacancy.id)}
          />
          <p className="text-xs text-white/60">
            {vacancy.role || vacancy.name} — განაცხადი გადაიგზავნება ამ პოზიციაზე.
          </p>
        </div>
      ) : (
        <p className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          ვერ მოიძებნა ვაკანსია. დაბრუნდი კარიერის გვერდზე და აირჩიე კონკრეტული როლი.
        </p>
      )}
      <div className="flex flex-col gap-2 text-sm text-white/80">
        <label htmlFor="resume">CV ატვირთვა (PDF) *</label>
        <input
          id="resume"
          name="resume"
          type="file"
          accept="application/pdf"
          required
          onBlur={handleBlur}
          onChange={handleChange}
          className={`rounded-2xl border border-dashed ${
            touched.resume && fieldErrors.resume
              ? "border-red-400/60 bg-red-500/10"
              : "border-white/25 bg-transparent"
          } px-4 py-6 text-base text-white file:mr-4 file:rounded-full file:border-0 file:bg-[#3A6FF8] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-white/60`}
        />
        <p className="text-xs text-white/60">მხოლოდ PDF, მაქს. 10MB.</p>
        {touched.resume && fieldErrors.resume && (
          <p className="text-xs text-red-300">{fieldErrors.resume}</p>
        )}
      </div>
      {state.status !== "idle" && (
        <p
          className={
            state.status === "success"
              ? "rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
              : "rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100"
          }
        >
          {state.message}
        </p>
      )}
      <SubmitButton disabled={!vacancy} />
      {isPending && <p className="text-xs text-white/60">მონაცემები იგზავნება…</p>}
    </form>
  );
}