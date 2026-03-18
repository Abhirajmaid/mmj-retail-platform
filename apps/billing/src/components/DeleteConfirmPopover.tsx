"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Trash2 } from "lucide-react";

import { Button } from "@jewellery-retail/ui";

type DeleteConfirmPopoverProps = {
  onConfirm: () => void;
  label?: string;
  iconClassName?: string;
};

export function DeleteConfirmPopover({ onConfirm, label = "Want to delete?", iconClassName }: DeleteConfirmPopoverProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);

  const popoverWidth = 140;
  const padding = 8;

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    let left = rect.left + rect.width / 2 - popoverWidth / 2;
    left = Math.max(padding, Math.min(window.innerWidth - popoverWidth - padding, left));
    setPosition({
      top: rect.bottom + 6,
      left,
    });
  }, []);

  const handleOpen = () => {
    const el = triggerRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      let left = rect.left + rect.width / 2 - popoverWidth / 2;
      left = Math.max(padding, Math.min(window.innerWidth - popoverWidth - padding, left));
      setPosition({
        top: rect.bottom + 6,
        left,
      });
    }
    setOpen(true);
  };

  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const onScrollOrResize = () => updatePosition();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  const handleYes = () => {
    onConfirm();
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        ref={triggerRef}
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 text-zinc-500 hover:text-red-600 hover:bg-red-50"
        aria-label="Delete"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleOpen();
        }}
      >
        <Trash2 className={iconClassName ?? "h-4 w-4"} />
      </Button>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[90]"
              aria-hidden
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
            />
            <div
              role="dialog"
              aria-label="Delete confirmation"
              className="fixed z-[100] w-[140px] rounded-md border border-zinc-200 bg-white p-1.5 shadow-lg"
              style={{
                top: position.top,
                left: position.left,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-2 py-1.5 text-xs text-zinc-500">{label}</div>
              <button
                type="button"
                className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm text-red-600 outline-none hover:bg-red-50 focus:bg-red-50"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleYes();
                }}
              >
                Yes
              </button>
              <button
                type="button"
                className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm text-zinc-700 outline-none hover:bg-zinc-100 focus:bg-zinc-100"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCancel();
                }}
              >
                Cancel
              </button>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
