import Image from "next/image";

type BrandLogoProps = {
  className?: string;
};

export default function BrandLogo({ className = "h-10 w-auto rounded-full" }: BrandLogoProps) {
  return (
    <Image
      src="https://raw.githubusercontent.com/prabhav1800-tech/zeptai_contents/main/uploads/logo.png"
      alt="ZeptAI logo"
      title="ZeptAI logo"
      width={180}
      height={180}
      className={className}
    />
  );
}
