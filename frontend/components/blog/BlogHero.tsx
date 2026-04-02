import { Sparkles } from "lucide-react";

type BlogHeroProps = {
  title: string;
  description: string;
};

export default function BlogHero({ title, description }: BlogHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border pt-28">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            ZeptAI Publication
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">{title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
    </section>
  );
}

