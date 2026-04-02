import ShareButtons from "@/components/blog/ShareButtons";
import LeadForm from "@/components/blog/LeadForm";
import { BlogPost } from "@/types/blog";

type BlogSidebarProps = {
  post: BlogPost;
  url: string;
};

export default function BlogSidebar({ post, url }: BlogSidebarProps) {
  return (
    <div className="sticky top-24 space-y-4">
      <ShareButtons title={post.title} url={url} />
      <div className="rounded-2xl border border-border bg-background p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tags</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <LeadForm sourcePage={`/blog/${post.slug}`} />
    </div>
  );
}

