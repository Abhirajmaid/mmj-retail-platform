"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@jewellery-retail/ui";

const PREVIEW_SIZE = "min-h-[80px] w-full max-w-[100px]";

interface ImageUploadProps {
  label: string;
  labelBold?: boolean;
  value?: string;
  onChange: (dataUrl: string) => void;
  accept?: string;
}

export function ImageUpload({
  label,
  labelBold,
  value,
  onChange,
  accept = "image/*",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (result) onChange(result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-2">
      <label
        className={`block text-xs font-medium text-zinc-700 ${
          labelBold ? "font-semibold uppercase tracking-wider text-amber-600" : ""
        }`}
      >
        {label}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <div
          className={`${PREVIEW_SIZE} flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 shadow-[0_2px_8px_rgba(15,23,42,0.06)] overflow-hidden`}
        >
          {value ? (
            <img
              src={value}
              alt={label}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400">
              <Upload className="h-8 w-8" />
            </div>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFile}
        />
        <Button
          type="button"
          size="icon"
          className="h-11 w-11 shrink-0 rounded-full bg-amber-500 text-white hover:bg-amber-600 sm:h-10 sm:w-10"
          onClick={() => inputRef.current?.click()}
          aria-label={`Upload ${label}`}
        >
          <Upload className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
