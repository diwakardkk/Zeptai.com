import { TableOfContentItem } from "@/types/blog";

type TableOfContentsProps = {
  items: TableOfContentItem[];
};

export default function TableOfContents({ items }: TableOfContentsProps) {
  return (
    <div className="sticky top-24 rounded-2xl border border-border bg-background p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Table of Contents</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`text-sm hover:text-primary ${item.level === 3 ? "pl-3 text-foreground/70" : "text-foreground/85"}`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

