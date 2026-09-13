import { FormEvent, useState } from "react";
import { ContentItem } from "../lib/types";
import { CloseIcon, PinIcon } from "./Icons";

interface EditContentModalProps {
  item: ContentItem;
  onClose: () => void;
  onSave: (updates: { tags?: string[]; note?: string; pinned?: boolean }) => Promise<void>;
}

export function EditContentModal({ item, onClose, onSave }: EditContentModalProps) {
  const [tagsInput, setTagsInput] = useState((item.tags ?? []).join(", "));
  const [note, setNote] = useState(item.note ?? "");
  const [pinned, setPinned] = useState(item.pinned ?? false);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 10);
    try {
      await onSave({ tags, note: note.trim(), pinned });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-swiss-ink/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-swiss-card border-2 border-swiss-ink w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-swiss-ink uppercase text-sm tracking-wide">Edit details</h2>
          <button onClick={onClose} className="text-swiss-faint hover:text-swiss-ink">
            <CloseIcon />
          </button>
        </div>

        <p className="text-xs text-swiss-muted mb-4 truncate font-mono" title={item.title}>
          {item.title}
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <button
            type="button"
            onClick={() => setPinned((p) => !p)}
            className={`w-full flex items-center gap-2 text-sm font-bold uppercase tracking-wide px-3 py-2.5 border-2 transition ${
              pinned ? "bg-swiss-ink border-swiss-ink text-swiss-bg" : "border-swiss-ink text-swiss-ink hover:bg-swiss-panel"
            }`}
          >
            <PinIcon filled={pinned} className="w-4 h-4" />
            {pinned ? "Pinned to top" : "Pin to top"}
          </button>

          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-swiss-muted">Tags (optional)</label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. interview, backend"
              className="mt-1.5 w-full border-2 border-swiss-ink px-3 py-2 text-sm outline-none focus:border-swiss-accent"
            />
            <p className="text-xs text-swiss-faint mt-1">Comma-separated, up to 10.</p>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-swiss-muted">Note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Why did you save this?"
              rows={3}
              className="mt-1.5 w-full border-2 border-swiss-ink px-3 py-2 text-sm outline-none focus:border-swiss-accent resize-none"
              maxLength={300}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-swiss-ink text-swiss-bg text-xs font-bold uppercase tracking-wide py-3 hover:bg-swiss-accent disabled:opacity-50 transition"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
