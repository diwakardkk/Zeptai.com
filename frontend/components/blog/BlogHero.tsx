import { Sparkles } from "lucide-react";

type BlogHeroProps = {
  title: string;
  description: string;
};

export default function BlogHero({ title, description }: BlogHeroProps) {
  return (
    <section className="relative overflow-hidden pt-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#38ac06]/12 blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#224bc3]/12 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[34px] border border-[#090909]/8 bg-white/70 px-6 py-10 shadow-[0_28px_80px_rgba(9,9,9,0.07)] backdrop-blur-xl md:px-10 md:py-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#38ac06]/20 bg-[#38ac06]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#38ac06]">
            <Sparkles className="h-3.5 w-3.5" />
            ZeptAI Publication
          </span>
          <div className="mt-6 max-w-4xl">
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[#090909] md:text-6xl">
              {title}
            </h1>
            <div className="mt-5 h-px w-28 bg-[linear-gradient(90deg,#38ac06_0%,#224bc3_100%)]" />
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#090909]/70 md:text-xl">
              {description}
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-[#090909]/66">
            <span className="rounded-full border border-[#090909]/8 bg-[#fffffa] px-3 py-2 shadow-sm">
              Voice AI healthcare
            </span>
            <span className="rounded-full border border-[#38ac06]/18 bg-[#38ac06]/6 px-3 py-2 shadow-sm">
              Patient intake AI
            </span>
            <span className="rounded-full border border-[#224bc3]/16 bg-[#224bc3]/6 px-3 py-2 shadow-sm">
              Clinical summaries AI
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
