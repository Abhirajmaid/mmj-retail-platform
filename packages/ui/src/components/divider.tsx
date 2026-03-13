import type { HTMLAttributes, ImgHTMLAttributes } from "react";

import { cn } from "../lib/utils";

interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  imageClassName?: string;
  lineClassName?: string;
  imageProps?: ImgHTMLAttributes<HTMLImageElement>;
}

export function Divider({
  src = "/statics/divider.svg",
  alt = "Divider",
  className,
  imageClassName,
  lineClassName,
  imageProps,
  ...props
}: DividerProps) {
  return (
    <div
      className={cn("w-full h-auto md:my-[60px] my-2", className)}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn("md:w-[70%] w-[90%] h-[80px] mx-auto object-contain", imageClassName)}
          {...imageProps}
        />
      ) : (
        <div className={cn("mx-auto h-px w-full bg-zinc-200", lineClassName)} />
      )}
    </div>
  );
}
