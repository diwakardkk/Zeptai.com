"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { TableOfContentItem } from "@/types/blog";

type TableOfContentsProps = {
  items: TableOfContentItem[];
};

const NAVBAR_OFFSET_PX = 112;

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const headingIds = useMemo(() => items.map((item) => item.id).filter(Boolean), [items]);

  useEffect(() => {
    if (!headingIds.length) return;

    const hash = window.location.hash.replace("#", "");
    if (hash && headingIds.includes(hash)) {
      setActiveId(hash);
    }

    const headings = headingIds
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleEntries[0]) {
          setActiveId((visibleEntries[0].target as HTMLElement).id);
          return;
        }

        const reachedHeadings = headings.filter((heading) => heading.getBoundingClientRect().top <= NAVBAR_OFFSET_PX + 18);
        if (reachedHeadings.length) {
          setActiveId(reachedHeadings[reachedHeadings.length - 1].id);
        }
      },
      {
        rootMargin: `-${NAVBAR_OFFSET_PX - 20}px 0px -64% 0px`,
        threshold: [0, 1],
      },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [headingIds]);

  if (!items.length) return null;

  const onLinkClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET_PX;
    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top, behavior: "smooth" });
    setActiveId(id);
  };

  return (
    <nav aria-label="Table of contents" className="sticky top-28">
      <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-[#fffffa]/80 p-4 shadow-[0_18px_40px_-26px_rgba(0,0,0,0.45)] backdrop-blur-md">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/50 to-transparent" />
        <p className="mb-3 text-[0.67rem] font-semibold uppercase tracking-[0.16em] text-black/45">On this page</p>
        <div className="max-h-[calc(100vh-9.5rem)] overflow-y-auto pr-1">
          <ul className="relative space-y-1 border-l border-[#224bc3]/15 pl-3">
            {items.map((item) => {
              const isH3 = item.level === 3;
              const isActive = item.id === activeId;

              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(event) => onLinkClick(event, item.id)}
                    className={`group relative block rounded-lg border-l-2 py-1.5 pl-3 pr-2 transition-all duration-200 ${
                      isActive
                        ? "border-[#38ac06] bg-white/80 font-semibold text-[#224bc3] shadow-[0_8px_20px_-16px_rgba(34,75,195,0.9)]"
                        : "border-transparent text-black/70 hover:border-[#38ac06]/60 hover:bg-white/65 hover:text-black/90"
                    } ${isH3 ? "ml-2 text-[0.82rem]" : "text-[0.9rem]"}`}
                  >
                    <span
                      className={`absolute left-[-9px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full transition-colors duration-200 ${
                        isActive ? "bg-[#38ac06]" : "bg-[#224bc3]/15 group-hover:bg-[#224bc3]/40"
                      }`}
                    />
                    {item.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
