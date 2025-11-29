'use client';

import { useActionState, useEffect } from "react";
import { submitApplication, ApplyActionState } from "@/actions/apply";
import type { VacancyRecord } from "@/actions/vacany";
import { SubmitButton } from "./SubmitButton";
import { FormField } from "./FormField";
import { useFormValidation } from "./useFormValidation";

type ApplyFormProps = {
  vacancy?: VacancyRecord;
};

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
    `w-full rounded-2xl border ${
      touched[fieldName] && errors[fieldName]
        ? "border-red-400/60 bg-red-500/10"
        : "border-white/15 bg-white/5"
    } px-4 py-2.5 text-sm text-white placeholder-white/50 focus:border-[#3A6FF8] focus:outline-none focus:ring-2 focus:ring-[#3A6FF8]/40 sm:px-4 sm:py-3 sm:text-base`;

  const vacancyDisplayName = vacancy?.role || vacancy?.name || 'უცნობი ვაკანსია';

  return (
    <form id="apply-form" className="space-y-4 sm:space-y-5" action={formAction}>
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
          placeholder="+995 5XXXXXXXX"
          defaultValue="+995 "
          required
          minLength={14}
          maxLength={14}
          onBlur={handleBlur}
          onChange={handleChange}
          className={getInputClassName('phone')}
        />
      </FormField>

      {vacancy ? (
        <div className="flex flex-col gap-2 text-sm text-white/80 sm:text-base">
          <label htmlFor="vacancyDisplay">ვაკანსია</label>
          <input
            id="vacancyDisplay"
            value={vacancyDisplayName}
            readOnly
            className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white sm:px-4 sm:py-3 sm:text-base"
          />
          <input type="hidden" name="vacancyId" value={String(vacancy.id)} />
          <p className="text-xs text-white/60 sm:text-sm">
            {vacancyDisplayName} — განაცხადი გადაიგზავნება ამ პოზიციაზე.
          </p>
        </div>
      ) : (
        <p className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-xs text-red-100 sm:text-sm">
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
          className={`w-full rounded-2xl border border-dashed ${
            touched.resume && errors.resume
              ? "border-red-400/60 bg-red-500/10"
              : "border-white/25 bg-transparent"
          } px-4 py-4 text-sm text-white file:mr-3 file:rounded-full file:border-0 file:bg-[#3A6FF8] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:border-white/60 sm:px-4 sm:py-6 sm:text-base sm:file:mr-4 sm:file:px-4 sm:file:py-2 sm:file:text-sm`}
        />
        <p className="text-xs text-white/60 sm:text-sm">მხოლოდ PDF, მაქს. 10MB.</p>
      </FormField>

      {state.status !== "idle" && (
        <p className={
          state.status === "success"
            ? "rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-100 sm:text-sm"
            : "rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs text-red-100 sm:text-sm"
        }>
          {state.message}
        </p>
      )}

      <SubmitButton disabled={!vacancy} />
      {isPending && <p className="text-xs text-white/60 sm:text-sm">მონაცემები იგზავნება…</p>}
    </form>
  );
}