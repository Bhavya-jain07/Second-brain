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
    <div className="fixed inset-0 bg-swiss-ink/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-swiss-card border-2 border-swiss-ink w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-1">
          <LinkIcon className="w-5 h-5 text-swiss-accent" />
          <h2 className="font-extrabold text-swiss-ink uppercase text-sm tracking-wide">Share your brain</h2>
        </div>
        <p className="text-sm text-swiss-muted mb-4">
          Anyone with this link can view everything you've saved — read-only, no login needed.
        </p>

        {hash ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-2 border-swiss-ink px-3 py-2">
              <input readOnly value={shareUrl} className="flex-1 text-sm bg-transparent outline-none text-swiss-ink font-mono" />
              <button
                onClick={copyLink}
                className="text-xs font-bold uppercase text-swiss-accent shrink-0"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <button
              onClick={removeLink}
              disabled={loading}
              className="text-sm text-swiss-accent hover:underline disabled:opacity-50"
            >
              Remove link
            </button>
          </div>
        ) : (
          <button
            onClick={generateLink}
            disabled={loading}
            className="w-full bg-swiss-ink text-swiss-bg text-xs font-bold uppercase tracking-wide py-3 hover:bg-swiss-accent disabled:opacity-50 transition"
          >
            {loading ? "Generating…" : "Generate share link"}
          </button>
        )}

        <button onClick={onClose} className="mt-4 text-sm text-swiss-faint hover:text-swiss-ink">
          Close
        </button>
      </div>
    </div>
  );
}
