import type { HTMLAttributes } from "react";

import { cn } from "../lib/utils";

type TextColor = "black" | "white" | "primary";
type Alignment = "left" | "center" | "right";

interface SectionTitleProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subTitle?: string;
  txtColor?: TextColor;
  align?: Alignment;
}

const textColorClasses: Record<TextColor, string> = {
  black: "text-black",
  white: "text-white",
  primary: "text-primary",
};

const accentClasses: Record<TextColor, string> = {
  black: "bg-black",
  white: "bg-white",
  primary: "bg-primary",
};

const alignmentClasses: Record<Alignment, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

export function SectionTitle({
  title,
  subTitle,
  txtColor = "black",
  align = "center",
  className,
  ...props
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-[10px]",
        textColorClasses[txtColor],
        alignmentClasses[align],
        className
      )}
      {...props}
    >
      <h1 className="md:text-[32px] text-[22px] flex flex-col">
        {title}
        <span className={cn("w-[30%] h-[3px]", accentClasses[txtColor])} />
      </h1>
      {subTitle && (
        <h3 className="md:text-[18px] text-[12px] text-center">{subTitle}</h3>
      )}
    </div>
  );
}
