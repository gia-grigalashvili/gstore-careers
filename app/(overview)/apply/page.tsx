import { fetchVacancies } from "@/actions/vacany";
import { ApplyForm } from "../../ui/apply/ApplyForm";

type PageProps = {
  searchParams: Promise<{
    vacancyId?: string | string[];
  }> | {
    vacancyId?: string | string[];
  };
};

const shellClass =
  "mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-12 lg:py-16 min-h-[calc(100vh-4rem)]";

export const revalidate = 0;

export default async function Page({ searchParams }: PageProps) {
  const vacancies = await fetchVacancies();
  
  // searchParams-ის წაკითხვა
  const params = searchParams instanceof Promise 
    ? await searchParams 
    : searchParams;

  console.log('🌐 Params:', params);
  
  const vacancyId = Array.isArray(params?.vacancyId)
    ? params.vacancyId[0]
    : params?.vacancyId;


  const selectedVacancy = vacancyId
    ? vacancies.find(v => String(v.id) === String(vacancyId))
    : undefined;


  return (
    <main className={shellClass}>
      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">
          Apply
        </p>
        <h2 className="text-3xl font-semibold">გაგვიზიარე შენი ისტორია</h2>
        <p className="max-w-3xl text-white/70">
          ეს ფორმა უკვე უკავშირდება Supabase-ს — ვალიდაციაც ადგილზეა და PDF
          ფაილების ატვირთვაც. აირჩიე შესაბამისი ვაკანსია და გამოგვიგზავნე შენი
          საუკეთესო რეზიუმე.
        </p>
      </section>
      
      <div className="grid gap-6 md:gap-8 lg:grid-cols-[2fr_1fr]">
        <article className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_25px_60px_rgba(12,18,32,0.35)] sm:p-6 md:max-w-none">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h3 className="text-xl font-semibold">განაცხადის ფორმა</h3>
            {selectedVacancy ? (
              <span className="text-sm text-white/60">
                {selectedVacancy.role || selectedVacancy.name}
              </span>
            ) : (
              <span className="text-sm text-red-400">ვაკანსია არ არის არჩეული</span>
            )}
          </div>
          <ApplyForm vacancy={selectedVacancy} />
        </article>
        
        <aside className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_25px_60px_rgba(12,18,32,0.35)] sm:p-6 md:max-w-none md:ml-auto">
          <h3 className="text-lg font-semibold">რა უნდა იცოდე?</h3>
          <div className="mt-6 space-y-4 text-sm text-white/70">
            <div>
              <p className="text-[#F5C96B]">რეზიუმე</p>
              <p>მხოლოდ PDF, 10MB-ზე ნაკლები.</p>
            </div>
            <div>
              <p className="text-[#F5C96B]">დაცულობა</p>
              <p>შენი ინფორმაცია მხოლოდ შიდა განხილვისთვის გამოიყენება.</p>
            </div>
            <div>
              <p className="text-[#F5C96B]">ფიდბექი</p>
              <p>პასუხს მაქსიმუმ 5 სამუშაო დღეში მიიღებ</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}