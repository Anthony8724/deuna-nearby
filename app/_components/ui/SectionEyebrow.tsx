import { premium } from "./premium";

type SectionEyebrowProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionEyebrow({ children, className = "" }: SectionEyebrowProps) {
  return (
    <span className={`${premium.eyebrow} ${className}`.trim()}>{children}</span>
  );
}
