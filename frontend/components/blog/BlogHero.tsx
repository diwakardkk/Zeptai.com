"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

type BlogHeroProps = {
  title: string;
  headline: string;
  description: string;
  tags: string[];
};

export default function BlogHero({ title, headline, description, tags }: BlogHeroProps) {
  return (
    <section className="relative overflow-hidden pt-32 pb-6 md:pt-36 md:pb-8 lg:pb-10">
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[34px] border border-border bg-card/85 px-6 py-10 shadow-[0_24px_70px_rgba(9,9,9,0.06)] backdrop-blur-xl md:px-10 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/20 bg-white/78 px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#224bc3] shadow-[0_18px_40px_-30px_rgba(34,75,195,0.5)] backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#38ac06]" />
              {title}
            </span>
          </motion.div>

          <motion.div
            className="mt-6 max-w-4xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.08, ease: "easeOut" }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.12]">
              {headline.includes("across") ? (
                <>
                  {headline.split("across")[0]}
                  <br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-[#224bc3] via-[#224bc3] to-[#38ac06] bg-clip-text text-transparent">
                    across {headline.split("across")[1]}
                  </span>
                </>
              ) : (
                headline
              )}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.16, ease: "easeOut" }}
          >
            <div className="mt-5 h-px w-28 bg-[linear-gradient(90deg,#38ac06_0%,#224bc3_100%)]" />
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">
              {description}
            </p>
          </motion.div>

          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-medium text-muted-foreground md:justify-start"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.24, ease: "easeOut" }}
          >
            {tags.map((tag, index) => {
              const isBlue = index % 2 === 0;
              return (
                <span
                  key={tag}
                  className={`rounded-full border px-4 py-2 shadow-sm transition duration-300 hover:-translate-y-0.5 ${
                    isBlue
                      ? "border-[#224bc3]/24 bg-[#224bc3]/7 hover:shadow-[0_0_18px_rgba(34,75,195,0.18)]"
                      : "border-[#38ac06]/24 bg-[#38ac06]/7 hover:shadow-[0_0_18px_rgba(56,172,6,0.16)]"
                  }`}
                >
                  {tag}
                </span>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
