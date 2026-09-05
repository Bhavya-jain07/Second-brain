import { FormEvent, useState } from "react";
import { CloseIcon } from "./Icons";

interface BulkAddModalProps {
  onClose: () => void;
  onAddMany: (urls: string[]) => Promise<void>;
}

export function BulkAddModal({ onClose, onAddMany }: BulkAddModalProps) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const urls = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (urls.length === 0) return;
    setBusy(true);
    try {
      await onAddMany(urls);
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold text-zinc-800">Add multiple links</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <CloseIcon />
          </button>
        </div>
        <p className="text-sm text-zinc-500 mb-4">Paste one link per line.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder={"https://youtube.com/watch?v=...\nhttps://x.com/user/status/...\nhttps://example.com/article"}
            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500 resize-none font-mono"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">{urls.length} link{urls.length === 1 ? "" : "s"} detected</span>
            <button
              type="submit"
              disabled={busy || urls.length === 0}
              className="bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-700 disabled:opacity-40 transition"
            >
              {busy ? "Adding…" : `Add ${urls.length || ""}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
