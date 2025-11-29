'use client';

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  disabled?: boolean;
};

export function SubmitButton({ disabled }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="inline-flex w-full items-center justify-center rounded-full bg-[#3A6FF8] px-5 py-3 text-sm font-semibold text-white shadow-[0_15px_30px_rgba(58,111,248,0.35)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:px-6 sm:py-3.5 sm:text-base"
    >
      {pending ? "გზავნა..." : "განაცხადის გაგზავნა"}
    </button>
  );
}