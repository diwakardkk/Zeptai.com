import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  showWordmark?: boolean;
  textClassName?: string;
};

export default function BrandLogo({
  className = "h-11 w-11 rounded-full",
  showWordmark = true,
  textClassName = "text-left",
}: BrandLogoProps) {
  return (
    <span className="inline-flex items-center gap-3">
      <Image
        src="/favicon.png"
        alt="ZeptAI logo"
        title="ZeptAI logo"
        width={56}
        height={56}
        className={className}
      />
      {showWordmark ? (
        <span className={`flex flex-col ${textClassName}`}>
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#224bc3]/75">
            Research-led healthcare AI
          </span>
          <span className="mt-1 text-lg font-extrabold tracking-[0.22em] text-foreground sm:text-xl">
            <span className="text-[#224bc3]">ZEPT</span>
            <span className="text-[#38ac06]">AI</span>
          </span>
        </span>
      ) : null}
    </span>
  );
}
