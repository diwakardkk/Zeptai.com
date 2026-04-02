import { Apple, Smartphone, ArrowDownCircle } from "lucide-react";

export default function AppDownload() {
  return (
    <section id="access" className="py-24 bg-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border bg-card p-10 shadow-lg shadow-primary/10">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <ArrowDownCircle className="h-4 w-4" />
                Browser Access + Enterprise API
              </span>
              <h2 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Use ZeptAI in Two Powerful Ways
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl">
                Individuals can use the browser experience to talk with ZeptAI before meeting a doctor, while enterprise teams can integrate the same intake and screening logic through an API-first model for telemedicine and clinical platforms.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90"
                >
                  <Apple className="h-5 w-5" />
                  Try in Browser
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-primary bg-background px-6 py-3 text-sm font-semibold text-primary shadow-lg shadow-primary/5 transition hover:bg-primary/5"
                >
                  <Smartphone className="h-5 w-5 text-primary" />
                  Discuss API Access
                </a>
              </div>
            </div>
            <div className="relative isolate overflow-hidden rounded-[2rem] border border-border bg-background p-8 shadow-2xl shadow-primary/5">
              <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -right-10 bottom-10 h-24 w-24 rounded-full bg-accent/20 blur-3xl" />
              <div className="relative grid gap-6">
                <div className="rounded-[2rem] bg-gradient-to-br from-primary/90 to-blue-600 p-6 text-primary-foreground shadow-xl shadow-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold uppercase tracking-[0.2em]">Enterprise + Browser</span>
                    <span className="text-xs bg-white/10 px-3 py-1 rounded-full">Production Direction</span>
                  </div>
                  <div className="mt-8 space-y-3">
                    <div className="text-4xl font-bold">ZeptAI</div>
                    <p className="text-sm text-primary-foreground/90">
                      Voice-first patient intake with structured doctor-ready summaries.
                    </p>
                  </div>
                </div>
                <div className="rounded-[2rem] bg-background p-6 shadow-inner shadow-black/5">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Delivery model</span>
                    <span className="font-semibold text-foreground">API + Browser</span>
                  </div>
                  <div className="mt-6 rounded-3xl border border-border bg-secondary/10 p-5 text-sm text-foreground">
                    <p>Symptoms, history, vitals, and summary in one workflow</p>
                    <p className="mt-3 text-xs text-muted-foreground">Designed for telemedicine, clinics, and direct browser use</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
