"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Link, Mail, Sparkles } from "lucide-react";

const team = [
  {
    name: "Prabhav Kumar",
    role: "CEO",
    image: "https://raw.githubusercontent.com/prabhav1800-tech/zeptai_contents/main/uploads/Prabhav.PNG",
    email: "Prabhav@zeptai.com",
    linkedin: "https://www.linkedin.com/in/prabhav-kumar-287ab21b1/",
  },
  {
    name: "Shivam Kumar",
    role: "CFO",
    image: "/team-shivam.svg",
    email: "shivam@zeptai.com",
    linkedin: "https://www.linkedin.com/in/shivam-kumar-50237ab0/",
  },
  {
    name: "Diwakar",
    role: "CTO",
    image: "https://raw.githubusercontent.com/prabhav1800-tech/zeptai_contents/main/uploads/Diwakar_photo.PNG",
    email: "diwakar@zeptai.com",
    linkedin: "https://www.linkedin.com/in/diwakarpro/",
  },
];

export default function Team() {
  const [founder, ...leadership] = team;

  return (
    <section id="team" className="relative overflow-hidden bg-background py-12 md:py-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-6 h-52 w-52 rounded-full bg-[#38ac06]/10 blur-[90px]" />
        <div className="absolute right-[-10%] top-10 h-64 w-64 rounded-full bg-[#224bc3]/10 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-7 max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">Our Team</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
            Meet the minds bridging the gap between cutting-edge AI research and clinical practice.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
          <motion.article
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            whileHover={{ y: -3 }}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card/85 p-4 shadow-[0_24px_52px_-42px_rgba(0,0,0,0.6)] backdrop-blur-sm md:p-5"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#224bc3]/12 blur-2xl transition-opacity group-hover:opacity-90" />
            <div className="pointer-events-none absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-[#38ac06]/12 blur-2xl transition-opacity group-hover:opacity-90" />

            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-sm md:h-24 md:w-24">
                <Image
                  src={founder.image}
                  alt={founder.name}
                  title={founder.name}
                  width={320}
                  height={320}
                  sizes="96px"
                  className="h-full w-full rounded-xl object-cover"
                />
              </div>

              <div className="flex-1">
                <span className="inline-flex items-center gap-1 rounded-full border border-[#224bc3]/25 bg-card/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#224bc3]">
                  <Sparkles className="h-3 w-3" />
                  Founder Spotlight
                </span>
                <h3 className="mt-2 text-xl font-bold text-foreground md:text-2xl">{founder.name}</h3>
                <p className="text-sm font-semibold text-[#224bc3]">{founder.role}</p>
                <p className="mt-1 text-xs text-muted-foreground">Driving product vision and execution</p>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <a
                    href={founder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${founder.name} LinkedIn`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-[#224bc3]/35 hover:text-[#224bc3]"
                  >
                    <Link className="h-3.5 w-3.5" />
                    LinkedIn
                  </a>
                  <a
                    href={`mailto:${founder.email}`}
                    aria-label={`Email ${founder.name}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-[#38ac06]/35 hover:text-[#2f8f07]"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </a>
                </div>
              </div>
            </div>
          </motion.article>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {leadership.map((member, idx) => (
              <motion.article
                key={member.email}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06, duration: 0.35 }}
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-border bg-card/90 p-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-border bg-[#fffffa] p-1">
                    <Image
                      src={member.image}
                      alt={member.name}
                      title={member.name}
                      width={180}
                      height={180}
                      sizes="44px"
                      className="h-full w-full rounded-lg object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{member.name}</p>
                    <p className="text-xs font-medium text-[#224bc3]">{member.role}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} LinkedIn`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-[#224bc3]/10 text-[#224bc3] transition hover:-translate-y-0.5 hover:border-[#224bc3]/35 hover:bg-[#224bc3]/15"
                  >
                    <Link className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    aria-label={`Email ${member.name}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-[#38ac06]/10 text-[#2f8f07] transition hover:-translate-y-0.5 hover:border-[#38ac06]/35 hover:bg-[#38ac06]/15"
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
