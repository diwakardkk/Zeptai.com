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
    <section className="relative overflow-hidden pt-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute -left-28 top-10 h-80 w-80 rounded-full bg-[#38ac06]/14 blur-[110px]"
          animate={{ x: [0, 24, 0], y: [0, -14, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-20 top-2 h-[26rem] w-[26rem] rounded-full bg-[#224bc3]/14 blur-[120px]"
          animate={{ x: [0, -26, 0], y: [0, 12, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.028)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30 [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[34px] border border-border bg-card/80 px-6 py-10 shadow-[0_30px_90px_rgba(9,9,9,0.08)] backdrop-blur-xl md:px-10 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#224bc3]/25 bg-[#224bc3]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#224bc3]">
              <Sparkles className="h-3.5 w-3.5" />
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
            <h1 className="text-4xl font-bold leading-tight tracking-[-0.045em] text-foreground md:text-6xl">
              {headline}
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
