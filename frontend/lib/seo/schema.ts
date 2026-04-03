import { BlogPost } from "@/types/blog";
import { siteConfig } from "@/lib/seo/site";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: siteConfig.ogImage,
  };
}

export function getBlogPostingSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    name: post.title,
    description: post.seoDescription ?? post.excerpt,
    url: `${siteConfig.url}/blog/${post.slug}`,
    image: post.coverImage,
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: siteConfig.ogImage,
      },
    },
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
    articleSection: post.category,
    keywords: (post.keywords ?? post.tags).join(", "),
  };
}
