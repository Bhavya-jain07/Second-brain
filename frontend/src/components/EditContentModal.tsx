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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-zinc-800">Edit details</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <CloseIcon />
          </button>
        </div>

        <p className="text-xs text-zinc-500 mb-4 truncate" title={item.title}>
          {item.title}
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <button
            type="button"
            onClick={() => setPinned((p) => !p)}
            className={`w-full flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border transition ${
              pinned ? "bg-brand-50 border-brand-200 text-brand-700" : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            <PinIcon filled={pinned} className="w-4 h-4" />
            {pinned ? "Pinned to top" : "Pin to top"}
          </button>

          <div>
            <label className="text-sm font-medium text-zinc-700">Tags (optional)</label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. interview, backend"
              className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
            <p className="text-xs text-zinc-400 mt-1">Comma-separated, up to 10.</p>
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">Note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Why did you save this?"
              rows={3}
              className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500 resize-none"
              maxLength={300}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-brand-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-brand-700 disabled:opacity-50 transition"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
