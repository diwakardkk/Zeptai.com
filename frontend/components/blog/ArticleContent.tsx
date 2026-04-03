type ArticleContentProps = {
  html: string;
};

export default function ArticleContent({ html }: ArticleContentProps) {
  return (
    <div
      data-blog-article-content
      className="prose prose-lg prose-neutral max-w-[680px] prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-4xl prose-h1:md:text-5xl prose-h2:text-[1.9rem] prose-h2:mt-12 prose-h2:mb-5 prose-h3:text-[1.35rem] prose-h3:mt-8 prose-h3:mb-3 prose-p:text-[18px] prose-p:leading-[1.7] prose-p:mb-5 prose-li:text-[18px] prose-li:leading-[1.7] prose-li:mb-2 prose-a:font-medium prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-4 prose-strong:font-semibold prose-img:rounded-2xl prose-img:border prose-img:border-border"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
