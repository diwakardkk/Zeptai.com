import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col pt-16 selection:bg-primary/30 selection:text-white">
      <Navbar />
      <section className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-start">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold uppercase tracking-wider">
                About ZeptAI
              </span>
              <h1 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">Welcome to ZEPTA FOCUSAI Technology Private Limited</h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Zeptai FocusAI Technology Pvt. Ltd. is where healthcare meets innovation. We are building India’s first AI-powered Virtual Nurse Assistant designed to transform how hospitals and clinics interact with patients.
              </p>
              <div className="mt-10 space-y-6 text-base leading-8 text-muted-foreground">
                <p>
                  Our mission is simple — to simplify patient intake, reduce consultation time, and help doctors focus on what matters most: delivering care. Our flagship product is an intelligent voice-based assistant that talks to patients, collects their symptoms and history, and generates a structured prescreening report.
                </p>
                <p>
                  That report is instantly shared with doctors before consultation, saving valuable time and enabling better diagnosis. Whether it is online or offline appointments, our bot ensures a smooth and smart experience for both patients and healthcare professionals.
                </p>
                <p>
                  Backed by deep expertise in Artificial Intelligence, Machine Learning, and healthcare systems, our team is committed to creating secure, explainable, and human-friendly AI tools that make a real difference in clinical practice.
                </p>
                <p>
                  At Zeptai, we believe the future of healthcare starts with a conversation — and our Nurse Bot is just the beginning.
                </p>
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-card p-8 shadow-lg shadow-primary/5">
              <h2 className="text-2xl font-bold text-foreground mb-6">What makes Zeptai different</h2>
              <ul className="space-y-4 text-muted-foreground">
                <li className="rounded-2xl bg-background p-5 border border-border">
                  <strong className="block text-foreground font-semibold">Voice-first patient intake</strong>
                  Natural conversation that collects symptoms, medical history, and patient concerns automatically.
                </li>
                <li className="rounded-2xl bg-background p-5 border border-border">
                  <strong className="block text-foreground font-semibold">Doctor-ready reports</strong>
                  Structured prescreening reports are generated instantly and shared before consultation.
                </li>
                <li className="rounded-2xl bg-background p-5 border border-border">
                  <strong className="block text-foreground font-semibold">Hospital-ready deployment</strong>
                  Designed for clinics and hospitals with secure workflows and fast integration.
                </li>
                <li className="rounded-2xl bg-background p-5 border border-border">
                  <strong className="block text-foreground font-semibold">Human-centered AI</strong>
                  Explainable, trustworthy AI built to support healthcare professionals — not replace them.
                </li>
              </ul>
              <Link href="/pricing" className="mt-8 inline-flex items-center justify-center w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                View Pricing Plans
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
