"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "../components/button";
import { Navlinks } from "./navlinks";

type SideNavbarLink = {
  title: string;
  href: string;
  icon?: string;
};

interface SideNavbarProps {
  links: SideNavbarLink[];
}

export function SideNavbar({ links }: SideNavbarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setIsCollapsed(windowWidth < 768);
  }, [windowWidth]);

  const mobileWidth = windowWidth < 768;

  return (
    <div
      className={`relative ${
        isCollapsed ? "min-w-[80px]" : "min-w-[200px]"
      } border-r px-3 pb-10 bg-white`}
    >
      {!mobileWidth ? (
        <div className="absolute right-[-20px] top-7">
          <Button
            onClick={() => setIsCollapsed((prev) => !prev)}
            variant="secondary"
            className="rounded-full p-2 bg-bg_dark text-center"
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>
      ) : null}
      <Navlinks isCollapsed={mobileWidth ? true : isCollapsed} links={links} />
    </div>
  );
}
