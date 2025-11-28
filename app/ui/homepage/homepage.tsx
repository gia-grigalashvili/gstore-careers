import Link from "next/link";
import { fetchVacancies } from "@/actions/vacany";

const shellClass =
  "mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-12 lg:py-16";
const cardClass =
  "flex flex-col justify-between gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_60px_rgba(12,18,32,0.35)]";

export default async function HomePage() {
  const vacancies = await fetchVacancies();

  return (
    <main className={shellClass}>
      <section
        className="rounded-3xl border border-white/10 p-6 sm:p-8 shadow-[0_30px_80px_rgba(7,13,26,0.6)]"
        style={{
          background:
            "linear-gradient(135deg, rgba(58,111,248,0.4), rgba(12,18,32,0.95))",
        }}
      >
        <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#F5C96B]">
          შემოუერთდი გუნდს <span className="text-white/60">∙</span> Gstore
        </p>
        <h1 className="text-2xl font-semibold leading-snug text-white sm:text-3xl md:text-4xl">
          კარიერა, სადაც{" "}
          <span className="text-[#F5C96B]">პროდუქტი და ადამიანები</span>{" "}
          თანაბრად მნიშვნელოვანია.
        </h1>
        <p className="mt-4 max-w-3xl text-base text-white/70 md:text-lg">
          ვქმნით თანამედროვე, მონაცემებზე დაფუძნებულ retail გამოცდილებებს. თუ
          გიყვარს სისუფთავე კოდი, სტრუქტურა და მომხმარებლის რეალური პრობლემების
          გადაჭრა — ქვემოთ შენი მომავალი პოზიცია გელოდება.
        </p>
       
      </section>

      <section id="vacancies" className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">
          ღია როლები
        </p>
        <h2 className="text-2xl font-semibold">აქტიური ვაკანსიები</h2>
        <p className="text-white/60">
          ჩვენ ვეძებთ ადამიანებს, რომლებიც დეტალებსაც აქცევენ ყურადღებას და
          შედეგზეა ორიენტირებული.
        </p>
          </div>
          <p className="text-sm text-white/50">
            „განაცხადის გაგზავნა“ ღილაკი გახსნის სრულ ფორმას, სადაც რეზიუმეს ატვირთავ.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {vacancies.length === 0 ? (
            <article className={`${cardClass} text-white/70`}>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  ვაკანსიები მალე განახლდება
                </h3>
                <p className="mt-2">
                  როგორც კი ახალი როლი დაემატება, ავტომატურად გამოჩნდება ამ
                  ბლოკში.
                </p>
              </div>
              <span className="text-sm text-white/40">
                განახლებული: {new Date().toLocaleDateString("ka-GE")}
              </span>
            </article>
          ) : (
            vacancies.map((vacancy) => (
              <article className={cardClass} key={vacancy.id}>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-white">
                    {vacancy.role}
                  </h3>
                  <p className="text-white/70">{vacancy.description}</p>
                </div>
                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    className="inline-flex items-center justify-center rounded-full bg-[#3A6FF8] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_15px_30px_rgba(58,111,248,0.35)] transition hover:-translate-y-0.5"
                    href={`/apply?vacancyId=${vacancy.id}`}
                  >
                    გაგზავნე განაცხადი
                  </Link>
                  <span className="text-sm text-white/50">
                    საშუალო განხილვის დრო{" "}
                    {vacancy.avarage_review_time || "3 სამუშაო დღე"}
                  </span>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
