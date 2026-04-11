"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Link, Mail } from "lucide-react";

const team = [
  {
    name: "Diwakar",
    tag: "Founder",
    role: "CTO",
    line: "Healthcare AI & technology",
    image: "https://raw.githubusercontent.com/prabhav1800-tech/zeptai_contents/main/uploads/Diwakar_photo.PNG",
    email: "diwakar@zeptai.com",
    linkedin: "https://www.linkedin.com/in/diwakarpro/",
    accent: "blue",
  },
  {
    name: "Prabhav Kumar",
    tag: "Co-Founder",
    role: "CEO",
    line: "Product & vision",
    image: "https://raw.githubusercontent.com/prabhav1800-tech/zeptai_contents/main/uploads/Prabhav.PNG",
    email: "Prabhav@zeptai.com",
    linkedin: "https://www.linkedin.com/in/prabhav-kumar-287ab21b1/",
    accent: "blue",
  },
  {
    name: "Shivam Kumar",
    tag: "Co-Founder",
    role: "CFO",
    line: "Finance & operations",
    image: "https://raw.githubusercontent.com/diwakardkk/Zeptai.com/main/uploads/Untitled%20design.png",
    email: "shivam@zeptai.com",
    linkedin: "https://www.linkedin.com/in/shivam-kumar-50237ab0/",
    accent: "green",
  },
];

const roleTagStyles = {
  blue: "border-[#224bc3]/25 bg-[#224bc3]/10 text-[#224bc3]",
  green: "border-[#38ac06]/30 bg-[#38ac06]/10 text-[#2f8f07]",
} as const;

export default function Team() {
  return (
    <section id="team" className="relative overflow-hidden bg-background py-10 md:py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-6 h-52 w-52 rounded-full bg-[#38ac06]/10 blur-[90px]" />
        <div className="absolute right-[-10%] top-10 h-64 w-64 rounded-full bg-[#224bc3]/10 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-6 max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">Our Team</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
            Meet the minds bridging the gap between cutting-edge AI research and clinical practice.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {team.map((member, idx) => {
            const tagStyle = roleTagStyles[member.accent as keyof typeof roleTagStyles] ?? roleTagStyles.blue;
            return (
              <motion.article
                key={member.email}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06, duration: 0.45 }}
                whileHover={{ y: -3 }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card/85 p-5 shadow-[0_24px_52px_-42px_rgba(0,0,0,0.6)] backdrop-blur-sm md:p-6"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#224bc3]/12 blur-2xl transition-opacity group-hover:opacity-90" />
                <div className="pointer-events-none absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-[#38ac06]/12 blur-2xl transition-opacity group-hover:opacity-90" />

                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-sm md:h-28 md:w-28">
                    <Image
                      src={member.image}
                      alt={member.name}
                      title={member.name}
                      width={320}
                      height={320}
                      sizes="96px"
                      className="h-full w-full rounded-xl object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${tagStyle}`}>
                      {member.tag}
                    </span>
                    <h3 className="mt-2 text-2xl font-bold text-foreground md:text-[1.9rem]">{member.name}</h3>
                    <p className="text-base font-semibold text-[#224bc3]">{member.role}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{member.line}</p>

                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} LinkedIn`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-[#224bc3]/35 hover:text-[#224bc3]"
                      >
                        <Link className="h-3.5 w-3.5" />
                        LinkedIn
                      </a>
                      <a
                        href={`mailto:${member.email}`}
                        aria-label={`Email ${member.name}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-[#38ac06]/35 hover:text-[#2f8f07]"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        Email
                      </a>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
