import { useRef, useState, ChangeEvent, DragEvent, FormEvent, ReactNode } from "react";
import { UploadIcon, PlusIcon, ListIcon, PaperclipIcon } from "./Icons";

interface DropZoneProps {
  onAddLink: (url: string) => Promise<void>;
  onUploadFile: (file: File) => Promise<void>;
  onBulkAddClick?: () => void;
  children: ReactNode;
}

const MAX_FILE_SIZE = 8 * 1024 * 1024; // keep in sync with backend limit

/**
 * Wraps the dashboard content. Drop a link OR an actual file (PDF, image,
 * doc — dragged from your computer) anywhere inside and it gets added to
 * the brain. A small input/paperclip at the top are manual fallbacks for
 * when dragging isn't convenient (e.g. on a touchscreen).
 */
export function DropZone({ onAddLink, onUploadFile, onBulkAddClick, children }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragDepth, setDragDepth] = useState(0);
  const [manualLink, setManualLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function extractUrl(raw: string): string | null {
    const match = raw.match(/https?:\/\/[^\s]+/);
    return match ? match[0] : null;
  }

  async function handleLink(url: string) {
    setError("");
    setBusy(true);
    try {
      await onAddLink(url);
    } catch {
      // Parent already surfaces this as a toast — nothing more to do here.
    } finally {
      setBusy(false);
    }
  }

  async function handleFile(file: File) {
    setError("");
    if (file.size > MAX_FILE_SIZE) {
      setError(`"${file.name}" is over 8MB — pick a smaller file.`);
      return;
    }
    setBusy(true);
    try {
      await onUploadFile(file);
    } catch {
      // Parent already surfaces this as a toast.
    } finally {
      setBusy(false);
    }
  }

  function onDragEnter(e: DragEvent) {
    e.preventDefault();
    setDragDepth((d) => d + 1);
    setIsDragging(true);
  }

  function onDragLeave(e: DragEvent) {
    e.preventDefault();
    setDragDepth((d) => {
      const next = d - 1;
      if (next <= 0) setIsDragging(false);
      return next;
    });
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault();
  }

  async function onDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    setDragDepth(0);

    // Real files (dragged from the desktop/Finder/Explorer) take priority.
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      for (const file of Array.from(e.dataTransfer.files)) {
        await handleFile(file);
      }
      return;
    }

    const uriList = e.dataTransfer.getData("text/uri-list");
    const plainText = e.dataTransfer.getData("text/plain");
    const url = extractUrl(uriList) || extractUrl(plainText);

    if (!url) {
      setError("Drop a link (YouTube video, tweet, or any URL) or a file.");
      return;
    }
    await handleLink(url);
  }

  async function onManualSubmit(e: FormEvent) {
    e.preventDefault();
    const url = extractUrl(manualLink.trim()) || manualLink.trim();
    if (!url) return;
    await handleLink(url);
    setManualLink("");
  }

  async function onFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (const file of Array.from(files)) {
      await handleFile(file);
    }
    e.target.value = ""; // allow re-selecting the same file later
  }

  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`relative border-2 border-dashed transition-colors ${
        isDragging ? "border-swiss-ink bg-swiss-panel" : "border-swiss-faint"
      }`}
    >
      <form onSubmit={onManualSubmit} className="flex items-center gap-2 p-4 border-b-2 border-swiss-ink">
        <UploadIcon className="w-5 h-5 text-swiss-muted shrink-0" />
        <input
          id="sb-quick-add-input"
          type="text"
          value={manualLink}
          onChange={(e) => setManualLink(e.target.value)}
          placeholder="Drag a link or file here, or paste a link… (press / to focus)"
          className="flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-swiss-faint"
        />
        <input ref={fileInputRef} type="file" className="hidden" onChange={onFileInputChange} multiple />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1 text-swiss-muted hover:text-swiss-accent px-2 py-1.5 transition shrink-0"
          title="Upload a file or PDF (max 8MB)"
        >
          <PaperclipIcon className="w-4 h-4" />
        </button>
        {onBulkAddClick && (
          <button
            type="button"
            onClick={onBulkAddClick}
            className="flex items-center gap-1 text-swiss-muted hover:text-swiss-accent px-2 py-1.5 transition shrink-0"
            title="Add multiple links at once"
          >
            <ListIcon className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          disabled={busy || !manualLink.trim()}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide bg-swiss-ink text-swiss-bg px-4 py-2 hover:bg-swiss-accent disabled:opacity-40 transition shrink-0"
        >
          <PlusIcon className="w-3 h-3" /> Add
        </button>
      </form>

      {error && <p className="px-4 pt-3 text-sm text-swiss-accent">{error}</p>}
      {busy && <p className="px-4 pt-3 text-sm text-swiss-muted">Adding…</p>}

      <div className="p-4">{children}</div>

      {isDragging && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-swiss-bg/90">
          <div className="flex flex-col items-center gap-2 text-swiss-ink">
            <UploadIcon className="w-8 h-8" />
            <p className="font-bold uppercase text-sm tracking-wide">Drop a link or file to add it</p>
          </div>
        </div>
      )}
    </div>
  );
}
