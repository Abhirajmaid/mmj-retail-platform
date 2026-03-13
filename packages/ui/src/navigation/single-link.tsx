"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { cn } from "../lib/utils";

type SubLink = {
  id?: number | string;
  linkText: string;
  url: string;
  target?: string;
};

interface SingleLinkProps {
  id?: number | string;
  linkText: string;
  url?: string;
  subLinks?: SubLink[];
  target?: string;
  isActive?: (href?: string) => boolean;
  className?: string;
  dropdownClassName?: string;
}

export function SingleLink({
  id,
  linkText,
  url = "/",
  subLinks,
  target,
  isActive,
  className,
  dropdownClassName,
}: SingleLinkProps) {
  const [open, setOpen] = useState(false);
  const showDrop = Boolean(subLinks?.length) && open;
  const active = isActive?.(url) ?? false;

  return (
    <div
      className="relative w-fit h-fit"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        key={id}
        className={cn(
          "relative w-full flex items-center gap-x-1 text-[16px] text-dark dark:text-white cursor-pointer opacity-100",
          className
        )}
        href={url}
        target={target}
      >
        {linkText}
        <span
          style={{
            transform: showDrop || active ? "scaleX(1)" : "scaleX(0)",
          }}
          className="absolute -bottom-4 left-0 w-full h-[9px] origin-left scale-x-0 bg-sec transition-transform duration-300 ease-out"
        />
        {subLinks?.length ? <Icon icon="fe:arrow-down" /> : null}
      </Link>

      {showDrop ? (
        <div
          className={cn(
            "absolute left-1/2 top-[38px] z-50 w-[20vw] -translate-x-1/2",
            dropdownClassName
          )}
        >
          <div className="absolute -top-4 left-0 right-0 h-6 bg-transparent" />
          <div className="z-[99] bg-white text-black p-6 rounded-sm shadow-lg w-full">
            <ul className="gap-[20px] flex flex-col">
              {subLinks?.map((subLink) => (
                <Link
                  key={subLink.id}
                  href={subLink.url}
                  target={subLink.target}
                  className="opacity-100 text-[16px] hover:opacity-70 uppercase flex flex-col justify-center items-center"
                >
                  {subLink.linkText}
                  <span className="w-full h-[1px] bg-[#424242]/20 mt-4" />
                </Link>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
