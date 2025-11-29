'use client';

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitApplication, ApplyActionState } from "@/actions/apply";
import type { VacancyRecord } from "@/actions/vacany";

type ApplyFormProps = {
  vacancy?: VacancyRecord;
};

type FieldErrors = Record<string, string>;

const VALIDATION_RULES = {
  name: {
    required: "სახელი და გვარი სავალდებულოა",
    minLength: { value: 2, message: "სახელი უნდა შედგებოდეს მინიმუმ 2 სიმბოლოსგან" }
  },
  email: {
    required: "ელფოსტა სავალდებულოა",
    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "არასწორი ელფოსტის ფორმატი" }
  },
  phone: {
    required: "ტელეფონი სავალდებულოა",
    minLength: { value: 9, message: "ტელეფონი უნდა შედგებოდეს მინიმუმ 9 სიმბოლოსგან" },
    pattern: { value: /^[\d\s+\-()]+$/, message: "არასწორი ტელეფონის ფორმატი" }
  },
  resume: {
    required: "CV-ის ატვირთვა სავალდებულოა",
    fileType: { value: "application/pdf", message: "მხოლოდ PDF ფაილები დაშვებულია" },
    maxSize: { value: 10 * 1024 * 1024, message: "ფაილის ზომა არ უნდა აღემატებოდეს 10MB-ს" }
  }
};

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="inline-flex w-full items-center justify-center rounded-full bg-[#3A6FF8] px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_30px_rgba(58,111,248,0.35)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "გზავნა..." : "განაცხადის გაგზავნა"}
    </button>
  );
}

function FormField({ 
  label, 
  name, 
  error, 
  touched, 
  children 
}: { 
  label: string; 
  name: string; 
  error?: string; 
  touched?: boolean; 
  children: React.ReactNode; 
}) {
  return (
    <div className="flex flex-col gap-2 text-sm text-white/80">
      <label htmlFor={name}>{label}</label>
      {children}
      {touched && error && (
        <p className="text-xs text-red-300">{error}</p>
      )}
    </div>
  );
}

function useFormValidation() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string, files?: FileList | null): string => {
    const rules = VALIDATION_RULES[name as keyof typeof VALIDATION_RULES];
    if (!rules) return "";

    // Required validation
    if ('required' in rules && !value.trim() && (!files || files.length === 0)) {
      return rules.required;
    }

    // Min length validation
    if ('minLength' in rules && value.trim().length < rules.minLength.value) {
      return rules.minLength.message;
    }

    // Pattern validation
    if ('pattern' in rules && value && !rules.pattern.value.test(value)) {
      return rules.pattern.message;
    }

    // File validation
    if (name === 'resume' && files && files.length > 0) {
      const file = files[0];
      if ('fileType' in rules && file.type !== rules.fileType.value) {
        return rules.fileType.message;
      }
      if ('maxSize' in rules && file.size > rules.maxSize.value) {
        return rules.maxSize.message;
      }
    }

    return "";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value, files);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (touched[name]) {
      const error = validateField(name, value, files);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const reset = () => {
    setErrors({});
    setTouched({});
  };

  return { errors, touched, handleBlur, handleChange, reset };
}

export function ApplyForm({ vacancy }: ApplyFormProps) {
  const initialState: ApplyActionState = { status: "idle" };
  const [state, formAction, isPending] = useActionState(submitApplication, initialState);
  const { errors, touched, handleBlur, handleChange, reset } = useFormValidation();

  useEffect(() => {
    if (state.status === "success") {
      const form = document.getElementById("apply-form") as HTMLFormElement | null;
      form?.reset();
      reset();
    }
  }, [state.status, reset]);

  const getInputClassName = (fieldName: string) => 
    `rounded-2xl border ${
      touched[fieldName] && errors[fieldName]
        ? "border-red-400/60 bg-red-500/10"
        : "border-white/15 bg-white/5"
    } px-4 py-3 text-base text-white placeholder-white/50 focus:border-[#3A6FF8] focus:outline-none focus:ring-2 focus:ring-[#3A6FF8]/40`;

  return (
    <form id="apply-form" className="space-y-5" action={formAction}>
      <FormField label="სახელი და გვარი *" name="name" error={errors.name} touched={touched.name}>
        <input
          id="name"
          name="name"
          placeholder="მაგ: ანა გიორგაძე"
          required
          minLength={2}
          onBlur={handleBlur}
          onChange={handleChange}
          className={getInputClassName('name')}
        />
      </FormField>

      <FormField label="ელფოსტა *" name="email" error={errors.email} touched={touched.email}>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="ana@gstore.com"
          required
          onBlur={handleBlur}
          onChange={handleChange}
          className={getInputClassName('email')}
        />
      </FormField>

      <FormField label="ტელეფონი *" name="phone" error={errors.phone} touched={touched.phone}>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+995 5XX XX XX XX"
          required
          minLength={9}
          maxLength={13}
          pattern="[\d\s\+\-\(\)]+"
          onBlur={handleBlur}
          onChange={handleChange}
          className={getInputClassName('phone')}
        />
      </FormField>

      {vacancy ? (
        <div className="flex flex-col gap-2 text-sm text-white/80">
          <label htmlFor="vacancyDisplay">ვაკანსია</label>
          <input
            id="vacancyDisplay"
            value={vacancy.role || vacancy.name || String(vacancy.id)}
            readOnly
            className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white"
          />
          <input type="hidden" name="vacancyId" value={String(vacancy.id)} />
          <p className="text-xs text-white/60">
            {vacancy.role || vacancy.name} — განაცხადი გადაიგზავნება ამ პოზიციაზე.
          </p>
        </div>
      ) : (
        <p className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          ვერ მოიძებნა ვაკანსია. დაბრუნდი კარიერის გვერდზე და აირჩიე კონკრეტული როლი.
        </p>
      )}

      <FormField label="CV ატვირთვა (PDF) *" name="resume" error={errors.resume} touched={touched.resume}>
        <input
          id="resume"
          name="resume"
          type="file"
          accept="application/pdf"
          required
          onBlur={handleBlur}
          onChange={handleChange}
          className={`rounded-2xl border border-dashed ${
            touched.resume && errors.resume
              ? "border-red-400/60 bg-red-500/10"
              : "border-white/25 bg-transparent"
          } px-4 py-6 text-base text-white file:mr-4 file:rounded-full file:border-0 file:bg-[#3A6FF8] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-white/60`}
        />
        <p className="text-xs text-white/60">მხოლოდ PDF, მაქს. 10MB.</p>
      </FormField>

      {state.status !== "idle" && (
        <p className={
          state.status === "success"
            ? "rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
            : "rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100"
        }>
          {state.message}
        </p>
      )}

      <SubmitButton disabled={!vacancy} />
      {isPending && <p className="text-xs text-white/60">მონაცემები იგზავნება…</p>}
    </form>
  );
}