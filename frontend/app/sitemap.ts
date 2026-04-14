import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog/getAllPosts";
import { siteConfig } from "@/lib/seo/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getAllPosts();
  const currentDate = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/pricing`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/terms`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];

  const seenBlogUrls = new Set<string>();
  const blogRoutes: MetadataRoute.Sitemap = [];

  for (const post of blogPosts) {
    const url = `${siteConfig.url}/blog/${post.slug}`;
    if (seenBlogUrls.has(url)) continue;
    seenBlogUrls.add(url);

    blogRoutes.push({
      url,
      lastModified: new Date(post.updatedAt ?? post.date),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return [
    ...staticRoutes,
    ...blogRoutes,
  ];
}
