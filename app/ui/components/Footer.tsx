export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-[#050914]/90">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-white/70 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#F5C96B]">
            Gstore Careers
          </p>
          <p className="max-w-sm">
            ვაშენებთ გუნდს, რომელიც სიყვარულით ქმნის პროდუქტს. თუ კითხვები გაქვს,
            მოგვწერე anytime.
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-white">კონტაქტი</p>
          <p>careers@gstore.com</p>
          <p>+995 555 55 55 55</p>
        </div>
        <div className="space-y-2">
          <p className="text-white">მისამართი</p>
          <p>თბილისი, მანგლისის ქ. 22</p>
        </div>
      </div>
      <div className="px-4 py-4 text-center text-xs text-white/40 sm:px-6">
        © {year} Gstore • ყველა უფლება დაცულია
      </div>
    </footer>
  );
}

