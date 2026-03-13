"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "../components/button";
import { cn } from "../lib/utils";

interface PaginationControlsProps {
  count: number;
  perPage?: number;
  pageParamName?: string;
  perPageParamName?: string;
  className?: string;
}

export function PaginationControls({
  count,
  perPage = 12,
  pageParamName = "page",
  perPageParamName = "per_page",
  className,
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get(pageParamName) ?? "1");
  const currentPerPage = Number(searchParams.get(perPageParamName) ?? String(perPage));

  const maxPage = useMemo(
    () => Math.max(1, Math.ceil(count / currentPerPage)),
    [count, currentPerPage]
  );

  const updatePage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(pageParamName, String(nextPage));
    params.set(perPageParamName, String(currentPerPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div
      className={cn(
        "md:mt-[80px] mt-[50px] md:mb-[60px] mb-[140px] flex gap-4 items-center justify-center",
        className
      )}
    >
      <Button
        variant="sec"
        className="text-white"
        disabled={page <= 1}
        onClick={() => updatePage(page - 1)}
      >
        prev page
      </Button>

      <div>
        {page} / {maxPage}
      </div>

      <Button
        variant="sec"
        className="text-white"
        disabled={page >= maxPage}
        onClick={() => updatePage(page + 1)}
      >
        next page
      </Button>
    </div>
  );
}
