type BrandLogoProps = {
  className?: string;
};

export default function BrandLogo({ className = "h-10 w-auto rounded-full" }: BrandLogoProps) {
  return (
    <img
      src="https://raw.githubusercontent.com/prabhav1800-tech/zeptai_contents/main/uploads/logo.png"
      alt="ZeptAI logo"
      className={className}
    />
  );
}

