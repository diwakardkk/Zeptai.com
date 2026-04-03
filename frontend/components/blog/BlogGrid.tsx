import { BlogPost } from "@/types/blog";
import BlogCard from "@/components/blog/BlogCard";

type BlogGridProps = {
  commentCounts: Record<string, number>;
  posts: BlogPost[];
};

export default function BlogGrid({ commentCounts, posts }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <BlogCard
          key={post.slug}
          commentCount={commentCounts[post.slug] ?? 0}
          post={post}
        />
      ))}
    </div>
  );
}
