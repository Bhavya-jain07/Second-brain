import { useState, DragEvent, FormEvent, ReactNode } from "react";
import { UploadIcon, PlusIcon, ListIcon } from "./Icons";

interface DropZoneProps {
  onAddLink: (url: string) => Promise<void>;
  onBulkAddClick?: () => void;
  children: ReactNode;
}

/**
 * Wraps the dashboard content. Drop a link anywhere inside (drag a tab, an
 * address-bar URL, or any text containing a link) and it gets added to the
 * brain. A small input at the top is a manual fallback for when dragging
 * isn't convenient (e.g. on a touchscreen).
 */
export function DropZone({ onAddLink, onBulkAddClick, children }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragDepth, setDragDepth] = useState(0);
  const [manualLink, setManualLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

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

    const uriList = e.dataTransfer.getData("text/uri-list");
    const plainText = e.dataTransfer.getData("text/plain");
    const url = extractUrl(uriList) || extractUrl(plainText);

    if (!url) {
      setError("Drop a link (YouTube video, tweet, or any URL).");
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

  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`relative rounded-2xl border-2 border-dashed transition-colors ${
        isDragging ? "drop-active" : "border-zinc-200"
      }`}
    >
      <form onSubmit={onManualSubmit} className="flex items-center gap-2 p-4 border-b border-zinc-100">
        <UploadIcon className="w-5 h-5 text-zinc-400 shrink-0" />
        <input
          id="sb-quick-add-input"
          type="text"
          value={manualLink}
          onChange={(e) => setManualLink(e.target.value)}
          placeholder="Drag a link anywhere here, or paste one and press add… (press / to focus)"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-zinc-400"
        />
        {onBulkAddClick && (
          <button
            type="button"
            onClick={onBulkAddClick}
            className="flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-800 px-2 py-1.5 rounded-lg transition shrink-0"
            title="Add multiple links at once"
          >
            <ListIcon className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          disabled={busy || !manualLink.trim()}
          className="flex items-center gap-1 text-sm font-medium bg-brand-600 text-white px-3 py-1.5 rounded-lg hover:bg-brand-700 disabled:opacity-40 transition shrink-0"
        >
          <PlusIcon className="w-3.5 h-3.5" /> Add
        </button>
      </form>

      {error && <p className="px-4 pt-3 text-sm text-red-500">{error}</p>}
      {busy && <p className="px-4 pt-3 text-sm text-zinc-400">Adding…</p>}

      <div className="p-4">{children}</div>

      {isDragging && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-brand-50/80">
          <div className="flex flex-col items-center gap-2 text-brand-600">
            <UploadIcon className="w-8 h-8" />
            <p className="font-medium">Drop to add to your brain</p>
          </div>
        </div>
      )}
    </div>
  );
}
