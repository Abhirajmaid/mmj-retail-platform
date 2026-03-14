import Image from "next/image";

import { cn } from "../lib/utils";

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <div
      className={cn(
        "relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-[16px] border border-[#173684]/10 bg-[#173684] shadow-[0_14px_28px_-18px_rgba(23,54,132,0.55)]",
        className
      )}
    >
      <Image src="/Primary_Logo.png" alt="MMJ logo" fill sizes="48px" className="object-cover" />
    </div>
  );
}
