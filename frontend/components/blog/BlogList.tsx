"use client";

import { useState } from "react";
import { BlogPost } from "@/types/blog";
import BlogGrid from "@/components/blog/BlogGrid";

type BlogListProps = {
  commentCounts: Record<string, number>;
  posts: BlogPost[];
};

const CATEGORIES_INFO = [
  {
    name: "Artificial Intelligence",
    description: "Models, evaluation, trustworthy AI, efficient learning and practical implementation.",
  },
  {
    name: "Healthcare Technology",
    description: "Conversational systems, clinical communication, safety, privacy and digital-health design.",
  },
  {
    name: "Quantum Computing",
    description: "Quantum concepts, QAOA, QUBO, hybrid workflows, realistic limitations and application studies.",
  },
  {
    name: "Research Notes",
    description: "Experiment summaries, methods, datasets, reproducibility and lessons learned.",
  },
  {
    name: "Product Engineering",
    description: "Architecture, APIs, user experience, deployment, testing and security.",
  },
  {
    name: "Company Updates",
    description: "Collaborations, publications, pilots, events and verified milestones.",
  },
] as const;

// Maps existing document tags into the 6 official blueprint categories
const CATEGORY_MAP: Record<string, string> = {
  "Explainable AI": "Artificial Intelligence",
  "AI Governance": "Artificial Intelligence",
  "Mental Health AI": "Healthcare Technology",
  "Voice AI Healthcare": "Healthcare Technology",
  "Patient Intake AI": "Healthcare Technology",
  "AI Healthcare": "Healthcare Technology",
  "Clinical AI": "Healthcare Technology",
  "Clinical Workflow": "Healthcare Technology",
  "Operations": "Healthcare Technology",
  "Research": "Research Notes",
  "Sample Draft": "Research Notes",
  "Company Updates": "Company Updates",
  "Medical Imaging": "Product Engineering",
};

export default function BlogList({ commentCounts, posts }: BlogListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Map each post's category to the official blueprint category
  const mappedPosts = posts.map(post => {
    const mappedCategory = CATEGORY_MAP[post.category] || "Research Notes";
    return {
      ...post,
      displayCategory: mappedCategory
    };
  });

  // Filter posts
  const filteredPosts = selectedCategory === "All"
    ? mappedPosts
    : mappedPosts.filter(post => post.displayCategory === selectedCategory);

  // Find active category description
  const activeCategoryDesc = CATEGORIES_INFO.find(c => c.name === selectedCategory)?.description;

  return (
    <div className="space-y-8">
      {/* Categories Description Panel */}
      <div className="rounded-[28px] border border-border bg-card/60 p-6 shadow-sm backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Journal Categories
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES_INFO.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name === selectedCategory ? "All" : cat.name)}
              className={`text-left p-4 rounded-2xl border transition duration-300 ${
                selectedCategory === cat.name
                  ? "border-[#224bc3] bg-[#224bc3]/[0.03] shadow-[0_8px_20px_-10px_rgba(34,75,195,0.25)]"
                  : "border-border/30 bg-background/50 hover:border-border"
              }`}
            >
              <h3 className={`text-sm font-bold ${selectedCategory === cat.name ? "text-[#224bc3]" : "text-foreground"}`}>
                {cat.name}
              </h3>
              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                {cat.description}
              </p>
            </button>
          ))}
        </div>
        {selectedCategory !== "All" && (
          <div className="mt-4 pt-4 border-t border-border/40 flex justify-between items-center text-xs">
            <span className="text-muted-foreground">
              Filtering by: <strong>{selectedCategory}</strong>
            </span>
            <button
              onClick={() => setSelectedCategory("All")}
              className="text-[#224bc3] font-semibold hover:underline"
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>

      {/* Grid of posts */}
      {filteredPosts.length > 0 ? (
        <BlogGrid 
          commentCounts={commentCounts} 
          posts={filteredPosts.map(p => ({
            ...p,
            category: p.displayCategory // Override category for the card render
          }))} 
        />
      ) : (
        <div className="text-center py-12 rounded-[28px] border border-dashed border-border p-6 bg-card/20">
          <p className="text-sm text-muted-foreground">No articles published under this category yet.</p>
          <button
            onClick={() => setSelectedCategory("All")}
            className="mt-3 text-xs font-bold text-[#224bc3] uppercase tracking-wider hover:underline"
          >
            Show All Articles
          </button>
        </div>
      )}
    </div>
  );
}
