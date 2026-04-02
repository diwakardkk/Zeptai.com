import { BlogPost } from "@/types/blog";

export function getBlogPostingSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription ?? post.excerpt,
    image: post.coverImage,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "ZeptAI",
      logo: {
        "@type": "ImageObject",
        url: "https://raw.githubusercontent.com/prabhav1800-tech/zeptai_contents/main/uploads/logo.png",
      },
    },
    mainEntityOfPage: `https://www.zeptai.com/blog/${post.slug}`,
    keywords: (post.keywords ?? post.tags).join(", "),
  };
}

