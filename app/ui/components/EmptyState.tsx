interface EmptyStateProps {
  hasVacancies: boolean;
}

export function EmptyState({ hasVacancies }: EmptyStateProps) {
  return (
    <article className="col-span-full rounded-2xl border border-white/5 bg-white/2 p-8 text-center backdrop-blur-sm">
      <div className="mx-auto max-w-md space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#3A6FF8]/10">
          <svg className="h-6 w-6 text-[#3A6FF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white">
          {hasVacancies ? "ვაკანსია ვერ მოიძებნა" : "ვაკანსიები მალე განახლდება"}
        </h3>
        <p className="text-sm text-[#DDE2E9]/50">
          {hasVacancies 
            ? "სცადეთ სხვა ფილტრები ან გაასუფთავეთ ძებნა"
            : "როგორც კი ახალი როლი დაემატება, ავტომატურად გამოჩნდება ამ გვერდზე"
          }
        </p>
      </div>
    </article>
  );
}