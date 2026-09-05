import { useState } from "react";
import { api } from "../lib/api";
import { LinkIcon } from "./Icons";
import { useToast, friendlyError } from "./Toast";

interface ShareModalProps {
  onClose: () => void;
}

export function ShareModal({ onClose }: ShareModalProps) {
  const [hash, setHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const shareUrl = hash ? `${window.location.origin}/share/${hash}` : "";

  async function generateLink() {
    setLoading(true);
    try {
      const res = await api.post("/brain/share", { share: true });
      setHash(res.data.hash);
    } catch (err) {
      showToast(friendlyError(err), "error");
    } finally {
      setLoading(false);
    }
  }

  async function removeLink() {
    setLoading(true);
    try {
      await api.post("/brain/share", { share: false });
      setHash(null);
      showToast("Link removed");
    } catch (err) {
      showToast(friendlyError(err), "error");
    } finally {
      setLoading(false);
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-1">
          <LinkIcon className="w-5 h-5 text-brand-600" />
          <h2 className="font-semibold text-zinc-800">Share your brain</h2>
        </div>
        <p className="text-sm text-zinc-500 mb-4">
          Anyone with this link can view everything you've saved — read-only, no login needed.
        </p>

        {hash ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 border border-zinc-200 rounded-lg px-3 py-2">
              <input readOnly value={shareUrl} className="flex-1 text-sm bg-transparent outline-none text-zinc-600" />
              <button
                onClick={copyLink}
                className="text-xs font-medium text-brand-600 hover:text-brand-700 shrink-0"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <button
              onClick={removeLink}
              disabled={loading}
              className="text-sm text-red-500 hover:text-red-600 disabled:opacity-50"
            >
              Remove link
            </button>
          </div>
        ) : (
          <button
            onClick={generateLink}
            disabled={loading}
            className="w-full bg-brand-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-brand-700 disabled:opacity-50 transition"
          >
            {loading ? "Generating…" : "Generate share link"}
          </button>
        )}

        <button onClick={onClose} className="mt-4 text-sm text-zinc-400 hover:text-zinc-600">
          Close
        </button>
      </div>
    </div>
  );
}
