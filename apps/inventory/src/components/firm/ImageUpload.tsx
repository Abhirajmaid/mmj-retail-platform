"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";

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
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFile(file);
    e.target.value = "";
  };

  const readFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (result) onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  return (
    <div className="space-y-2">
      <label
        className={`block text-sm font-medium text-zinc-700 ${
          labelBold ? "font-semibold uppercase tracking-wider text-amber-600" : ""
        }`}
      >
        {label}
      </label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          group relative flex min-h-[160px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors
          overflow-hidden
          ${value ? "border-zinc-100 bg-zinc-50/50" : ""}
          ${!value && isDragOver ? "border-amber-400 bg-amber-50/50" : ""}
          ${!value && !isDragOver ? "border-zinc-200 bg-zinc-50/80 hover:border-amber-300 hover:bg-amber-50/30" : ""}
        `}
        style={{ boxShadow: value ? "none" : "0_2px_8px_rgba(15,23,42,0.04)" }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={handleFile}
          aria-label={label}
        />
        {value ? (
          <>
            <img
              src={value}
              alt={label}
              className="h-full w-full object-contain p-2"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
              <span className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm opacity-0 transition-opacity group-hover:opacity-100">
                Change image
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
              <Upload className="h-6 w-6" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-zinc-600">
                Click or drag to upload
              </p>
              <p className="text-xs text-zinc-400">PNG, JPG up to 5MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
