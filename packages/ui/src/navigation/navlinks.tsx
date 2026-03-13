"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import type { ReactNode } from "react";

import { buttonVariants } from "../components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/tooltip";
import { cn } from "../lib/utils";

type NavLinkItem = {
  title: string;
  href: string;
  icon?: string | ReactNode;
};

interface NavlinksProps {
  links: NavLinkItem[];
  isCollapsed?: boolean;
}

function renderIcon(icon: NavLinkItem["icon"], className: string) {
  if (!icon) return null;
  if (typeof icon === "string") {
    return <Icon icon={icon} className={className} />;
  }

  return icon;
}

export function Navlinks({ links, isCollapsed = false }: NavlinksProps) {
  const pathname = usePathname();

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 pt-4 data-[collapsed=true]:py-2 data-[collapsed=true]:pt-4"
    >
      <nav className="grid gap-3 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <TooltipProvider key={index}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      buttonVariants({
                        variant: link.href === pathname ? "default" : "ghost",
                        size: "icon",
                      }),
                      "h-9 w-9",
                      link.href === pathname &&
                        "bg-primary text-white hover:bg-primary hover:text-white"
                    )}
                  >
                    {renderIcon(link.icon, "h-5 w-5")}
                    <span className="sr-only">{link.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-4">
                  {link.title}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Link
              key={index}
              href={link.href}
              className={cn(
                buttonVariants({
                  variant: link.href === pathname ? "default" : "ghost",
                  size: "sm",
                }),
                link.href === pathname &&
                  "bg-primary text-white hover:bg-primary hover:text-white",
                "justify-start text-md"
              )}
            >
              {renderIcon(link.icon, "mr-2 h-5 w-5")}
              {link.title}
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
