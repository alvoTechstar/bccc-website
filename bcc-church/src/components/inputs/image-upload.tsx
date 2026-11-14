import { useEffect, useMemo, useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { IciLabel } from "./inputs";
import { resolveUploadUrl } from "@/utilities/Endpoints";
import { cn } from "@/lib/utils";

function FileThumb({ file, onRemove }: { file: File; onRemove: () => void }) {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);
  return (
    <span className="group relative block overflow-hidden rounded-lg border border-accent/60 ring-1 ring-accent/40">
      <img src={url} alt={file.name} loading="lazy" className="aspect-square h-full w-full object-cover" />
      <span className="absolute left-1 top-1 rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-black uppercase text-primary">
        New
      </span>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove image"
        className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
      >
        <X size={13} />
      </button>
    </span>
  );
}

/**
 * Multi-image picker used by Blog Posts + Events (+ Media).
 * Shows already-saved images (URLs) and newly-picked files side by side,
 * each removable. Parent owns both lists and sends
 * `images: File[]` + `keepImages: string[]` to the API.
 */
export function ImageUpload({
  label,
  existing,
  onRemoveExisting,
  files,
  onAdd,
  onRemoveFile,
  hint,
  className,
}: {
  label: string;
  existing: string[];
  onRemoveExisting: (url: string) => void;
  files: File[];
  onAdd: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  hint?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={className}>
      <IciLabel>{label}</IciLabel>
      {(existing.length > 0 || files.length > 0) && (
        <div className="mb-2 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {existing.map((url) => (
            <span key={url} className="group relative block overflow-hidden rounded-lg border border-slate-200">
              <img
                src={resolveUploadUrl(url) ?? url}
                alt=""
                loading="lazy"
                className="aspect-square h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemoveExisting(url)}
                aria-label="Remove image"
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
              >
                <X size={13} />
              </button>
            </span>
          ))}
          {files.map((f, i) => (
            <FileThumb key={`${f.name}-${f.size}-${i}`} file={f} onRemove={() => onRemoveFile(i)} />
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300",
          "bg-[#F8F8F8] px-3 py-4 text-xs font-semibold text-slate-500 transition hover:border-primary hover:text-primary"
        )}
      >
        <ImagePlus size={16} />
        {existing.length + files.length > 0 ? "Add more photos" : "Upload photos from this device"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => {
          onAdd(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />
      {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}
