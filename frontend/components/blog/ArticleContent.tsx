type ArticleContentProps = {
  html: string;
};

export default function ArticleContent({ html }: ArticleContentProps) {
  return (
    <div
      className="prose prose-neutral max-w-none prose-headings:scroll-mt-24 prose-headings:font-bold prose-p:text-[1.05rem] prose-p:leading-8 prose-li:leading-7 prose-img:rounded-2xl prose-img:border prose-img:border-border"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
