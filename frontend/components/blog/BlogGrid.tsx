import { BlogPost } from "@/types/blog";
import BlogCard from "@/components/blog/BlogCard";

type BlogGridProps = {
  posts: BlogPost[];
};

export default function BlogGrid({ posts }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}

