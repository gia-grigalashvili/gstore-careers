'use client';

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitApplication, ApplyActionState } from "@/actions/apply";
import type { VacancyRecord } from "@/actions/vacany";
import { useEffect } from "react";

type ApplyFormProps = {
  vacancy?: VacancyRecord;
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

  useEffect(() => {
    if (state.status === "success") {
      const form = document.getElementById("apply-form") as HTMLFormElement | null;
      form?.reset();
    }
  }, [state.status]);

  return (
    <form
      id="apply-form"
      className="space-y-5"
      action={formAction}
    >
      <div className="flex flex-col gap-2 text-sm text-white/80">
        <label htmlFor="name">სახელი და გვარი</label>
        <input
          id="name"
          name="name"
          placeholder="მაგ: ანა გიორგაძე"
          required
          className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder-white/50 focus:border-[#3A6FF8] focus:outline-none focus:ring-2 focus:ring-[#3A6FF8]/40"
        />
      </div>
      <div className="flex flex-col gap-2 text-sm text-white/80">
        <label htmlFor="email">ელფოსტა</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="ana@gstore.com"
          required
          className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder-white/50 focus:border-[#3A6FF8] focus:outline-none focus:ring-2 focus:ring-[#3A6FF8]/40"
        />
      </div>
      <div className="flex flex-col gap-2 text-sm text-white/80">
        <label htmlFor="phone">ტელეფონი</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+995 5XX XX XX XX"
          required
          className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder-white/50 focus:border-[#3A6FF8] focus:outline-none focus:ring-2 focus:ring-[#3A6FF8]/40"
        />
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
        <label htmlFor="resume">CV ატვირთვა (PDF)</label>
        <input
          id="resume"
          name="resume"
          type="file"
          accept="application/pdf"
          required
          className="rounded-2xl border border-dashed border-white/25 bg-transparent px-4 py-6 text-base text-white file:mr-4 file:rounded-full file:border-0 file:bg-[#3A6FF8] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-white/60"
        />
        <p className="text-xs text-white/60">მხოლოდ PDF, მაქს. 10MB.</p>
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


