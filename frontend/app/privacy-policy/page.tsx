import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type TocItem = {
  id: string;
  title: string;
};

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTags(value: string) {
  return decodeEntities(value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim());
}

function slugify(value: string) {
  return stripTags(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function transformPolicyHtml(rawHtml: string) {
  const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let body = bodyMatch ? bodyMatch[1] : rawHtml;
  const toc: TocItem[] = [];
  const usedIds = new Map<string, number>();

  body = body
    .replace(/<span class="Apple-converted-space">\s*&nbsp;\s*<\/span>/g, " ")
    .replace(/<span class="Apple-converted-space"> <\/span>/g, " ")
    .replace(/\sclass="[^"]*"/g, "")
    .replace(/<p>\s*<br>\s*<\/p>/g, "");

  const topMetaMatch = body.match(
    /<p>\s*<b>Effective Date:<\/b>\s*([^<]+?)<br>\s*<b>Company Name:<\/b>\s*([^<]+?)<br>\s*<b>Contact Email:<\/b>\s*([^<]+?)\s*<\/p>/i,
  );

  const topMeta = {
    effectiveDate: topMetaMatch?.[1]?.trim() ?? "",
    companyName: topMetaMatch?.[2]?.trim() ?? "",
    contactEmail: topMetaMatch?.[3]?.trim() ?? "",
  };

  body = body
    .replace(/<p>\s*<b>PRIVACY POLICY<\/b>\s*<\/p>/i, "")
    .replace(
      /<p>\s*<b>Effective Date:<\/b>\s*[^<]+?<br>\s*<b>Company Name:<\/b>\s*[^<]+?<br>\s*<b>Contact Email:<\/b>\s*[^<]+?\s*<\/p>/i,
      "",
    );

  body = body.replace(/<p>\s*<b>(.*?)<\/b>\s*<\/p>/gi, (_match, rawText) => {
    const headingText = stripTags(rawText);
    if (!headingText) return "";

    const baseId = slugify(headingText);
    const seenCount = usedIds.get(baseId) ?? 0;
    const id = seenCount ? `${baseId}-${seenCount + 1}` : baseId;
    usedIds.set(baseId, seenCount + 1);

    if (/^\d+\.\s+/.test(headingText)) {
      toc.push({ id, title: headingText });
      return `<h2 id="${id}" class="policy-section">${rawText}</h2>`;
    }

    if (/^\d+\.\d+\s+/.test(headingText)) {
      return `<h3 id="${id}" class="policy-subsection">${rawText}</h3>`;
    }

    return `<h3 id="${id}" class="policy-subsection">${rawText}</h3>`;
  });

  body = body.replace(/<p>\s*((?:\d+\.\d+)\s+[^<]+)\s*<\/p>/gi, (_match, rawText) => {
    const headingText = stripTags(rawText);
    if (!headingText) return "";

    const baseId = slugify(headingText);
    const seenCount = usedIds.get(baseId) ?? 0;
    const id = seenCount ? `${baseId}-${seenCount + 1}` : baseId;
    usedIds.set(baseId, seenCount + 1);

    return `<h3 id="${id}" class="policy-subsection">${rawText}</h3>`;
  });

  return {
    html: body.trim(),
    toc,
    topMeta,
  };
}

async function getPolicyContent() {
  const filePath = path.join(process.cwd(), "content", "legal", "privacy-policy-source.html");
  const source = await readFile(filePath, "utf-8");
  return transformPolicyHtml(source);
}

export const metadata: Metadata = {
  title: "Privacy Policy | ZeptAI",
  description: "ZeptAI Privacy Policy outlining how we collect, use, and protect healthcare data.",
};

export default async function PrivacyPolicyPage() {
  const { html, toc, topMeta } = await getPolicyContent();

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col pt-16 selection:bg-primary/30 selection:text-white">
      <Navbar />

      <section className="border-b border-border bg-background/95">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card/90 px-6 py-8 shadow-[0_24px_64px_-42px_rgba(0,0,0,0.55)] sm:px-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Privacy Policy</h1>
            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              {topMeta.effectiveDate && <p>Effective Date: {topMeta.effectiveDate}</p>}
              {topMeta.companyName && <p>Company Name: {topMeta.companyName}</p>}
              {topMeta.contactEmail && <p>Contact Email: {topMeta.contactEmail}</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-border bg-card/85 p-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Contents</h2>
              <nav className="mt-3">
                <ul className="space-y-1.5">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="block rounded-md px-2 py-1 text-xs leading-5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          <article
            className="mx-auto w-full max-w-[820px] rounded-3xl border border-border bg-card/88 px-5 py-6 text-sm leading-7 text-foreground shadow-[0_24px_64px_-42px_rgba(0,0,0,0.55)] sm:px-8 sm:py-8 sm:text-[15px] [&_h2.policy-section]:mt-12 [&_h2.policy-section]:border-t [&_h2.policy-section]:border-border [&_h2.policy-section]:pt-8 [&_h2.policy-section]:text-xl [&_h2.policy-section]:font-bold [&_h2.policy-section]:tracking-tight [&_h2.policy-section]:text-foreground [&_h3.policy-subsection]:mt-6 [&_h3.policy-subsection]:text-base [&_h3.policy-subsection]:font-semibold [&_h3.policy-subsection]:text-foreground [&_p]:mt-3 [&_p]:text-justify [&_p]:text-muted-foreground [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_li]:text-muted-foreground [&_b]:font-semibold [&_b]:text-foreground"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
