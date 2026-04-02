import {
  ArrowRight,
  Binary,
  Building2,
  Globe2,
  Layers3,
} from "lucide-react";

export default function AppDownload() {
  return (
    <section id="access" className="py-24 bg-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border bg-card p-10 shadow-lg shadow-primary/10">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <Layers3 className="h-4 w-4" />
                Web Access + Enterprise API
              </span>
              <h2 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                One intake engine, two clear ways to use ZeptAI
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                Patients can use ZeptAI through a web-based intake experience,
                while healthcare platforms can integrate the same intake and
                screening workflow through an API-first model.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-border bg-background/90 p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                    <Globe2 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Web-Based Intake
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Guided voice intake for patients before consultation.
                  </p>
                </div>

                <div className="rounded-3xl border border-border bg-background/90 p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Enterprise API
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Integration-ready intake and summary workflow for healthcare products.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90"
                >
                  <Globe2 className="h-5 w-5" />
                  Try Web Intake
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-primary bg-background px-6 py-3 text-sm font-semibold text-primary shadow-lg shadow-primary/5 transition hover:bg-primary/5"
                >
                  <Binary className="h-5 w-5 text-primary" />
                  Explore API Access
                </a>
              </div>
            </div>
            <div className="relative isolate overflow-hidden rounded-[2rem] border border-border bg-background p-8 shadow-2xl shadow-primary/5">
              <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -right-10 bottom-10 h-24 w-24 rounded-full bg-accent/20 blur-3xl" />
              <div className="relative grid gap-6">
                <div className="rounded-[2rem] bg-gradient-to-br from-primary/90 to-blue-600 p-6 text-primary-foreground shadow-xl shadow-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold uppercase tracking-[0.2em]">
                      Delivery Model
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                      Web + API
                    </span>
                  </div>
                  <div className="mt-8 space-y-4">
                    <div className="text-3xl font-bold">
                      Patient conversation in. Structured clinical context out.
                    </div>
                    <p className="text-sm leading-6 text-primary-foreground/90">
                      The same ZeptAI intake workflow can power direct patient
                      access on the web and embedded clinical intake for partner
                      platforms.
                    </p>
                  </div>
                </div>
                <div className="rounded-[2rem] bg-background p-6 shadow-inner shadow-black/5">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Best fit</span>
                    <span className="font-semibold text-foreground">
                      Patients and platforms
                    </span>
                  </div>
                  <div className="mt-6 rounded-3xl border border-border bg-secondary/10 p-5 text-sm text-foreground">
                    <p className="font-medium">
                      Symptoms, history, screening context, and summary in one
                      workflow.
                    </p>
                    <div className="mt-4 grid gap-3 text-xs text-muted-foreground sm:grid-cols-2">
                      <div className="rounded-2xl bg-background px-3 py-3">
                        Web intake for individuals
                      </div>
                      <div className="rounded-2xl bg-background px-3 py-3">
                        API delivery for telemedicine and clinics
                      </div>
                    </div>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
                      See how ZeptAI fits your workflow <ArrowRight className="h-4 w-4" />
                    </div>
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
