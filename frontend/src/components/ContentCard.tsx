import { useState } from "react";
import { ContentItem } from "../lib/types";
import {
  CopyIcon,
  EditIcon,
  FileIcon,
  LinkIcon,
  PdfBadgeIcon,
  PinIcon,
  TrashIcon,
  TwitterIcon,
  YoutubeIcon,
} from "./Icons";

interface ContentCardProps {
  item: ContentItem;
  index?: number;
  onDelete?: (id: string) => void;
  onEdit?: (item: ContentItem) => void;
  readOnly?: boolean;
}

const TYPE_LABEL: Record<ContentItem["type"], string> = {
  youtube: "VIDEO",
  twitter: "TWEET",
  file: "FILE",
  other: "LINK",
};

function youtubeIdFromUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  return match ? match[1] : null;
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ContentCard({ item, index, onDelete, onEdit, readOnly = false }: ContentCardProps) {
  const videoId = item.type === "youtube" ? youtubeIdFromUrl(item.link) : null;
  const isPdf = item.type === "file" && item.fileMimeType === "application/pdf";
  const [copied, setCopied] = useState(false);

  function copyLink(e: React.MouseEvent) {
    e.preventDefault();
    navigator.clipboard.writeText(item.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  const indexLabel = typeof index === "number" ? String(index + 1).padStart(2, "0") : null;

  return (
    <div className="group relative bg-swiss-card border-r-2 border-b-2 border-swiss-ink hover:bg-swiss-ink transition-colors">
      {item.pinned && (
        <span className="absolute top-2.5 left-2.5 z-10 bg-swiss-accent text-white text-[10px] font-extrabold px-1.5 py-0.5 tracking-wide">
          PINNED
        </span>
      )}

      {/* Thumbnail area */}
      {item.type === "youtube" && videoId ? (
        <a href={item.link} target="_blank" rel="noreferrer" className="block relative aspect-video bg-swiss-panel border-b-2 border-swiss-ink group-hover:border-swiss-bg/20">
          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
        </a>
      ) : item.type === "twitter" ? (
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center aspect-video bg-swiss-panel border-b-2 border-swiss-ink group-hover:border-swiss-bg/20 group-hover:bg-swiss-ink text-swiss-ink group-hover:text-swiss-bg transition-colors"
        >
          <TwitterIcon className="w-8 h-8" />
        </a>
      ) : item.type === "file" ? (
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer"
          download={isPdf ? undefined : item.fileName}
          className="flex items-center justify-center aspect-video bg-swiss-panel border-b-2 border-swiss-ink group-hover:border-swiss-bg/20 group-hover:bg-swiss-ink text-swiss-ink group-hover:text-swiss-bg transition-colors"
        >
          {isPdf ? <PdfBadgeIcon className="w-9 h-9" /> : <FileIcon className="w-8 h-8" />}
        </a>
      ) : (
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center aspect-video bg-swiss-panel border-b-2 border-swiss-ink group-hover:border-swiss-bg/20 group-hover:bg-swiss-ink text-swiss-ink group-hover:text-swiss-bg transition-colors"
        >
          <LinkIcon className="w-8 h-8" />
        </a>
      )}

      {/* Body */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {indexLabel && (
              <p className="text-[10px] font-bold text-swiss-faint group-hover:text-swiss-bg/40 mb-1 tracking-wide">
                {indexLabel} — {TYPE_LABEL[item.type]}
              </p>
            )}
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              download={item.type === "file" && !isPdf ? item.fileName : undefined}
              className="block text-sm font-semibold text-swiss-ink group-hover:text-swiss-bg truncate"
              title={item.title}
            >
              {item.title}
            </a>
            <p className="text-xs text-swiss-muted group-hover:text-swiss-bg/50 truncate mt-0.5 font-mono">
              {item.type === "file" ? formatFileSize(item.fileSize) : item.link}
            </p>
          </div>

          {!readOnly && (
            <div className="shrink-0 flex items-center gap-0.5">
              {item.type !== "file" && (
                <button
                  onClick={copyLink}
                  className="text-swiss-faint hover:text-swiss-accent group-hover:text-swiss-bg/50 group-hover:hover:text-swiss-accent transition p-0.5"
                  aria-label="Copy link"
                  title={copied ? "Copied!" : "Copy link"}
                >
                  <CopyIcon />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(item)}
                  className="text-swiss-faint hover:text-swiss-accent group-hover:text-swiss-bg/50 group-hover:hover:text-swiss-accent transition p-0.5"
                  aria-label="Edit"
                  title="Add tags, note, or pin"
                >
                  <EditIcon />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(item._id)}
                  className="text-swiss-faint hover:text-swiss-accent group-hover:text-swiss-bg/50 group-hover:hover:text-swiss-accent transition p-0.5"
                  aria-label="Delete"
                >
                  <TrashIcon />
                </button>
              )}
            </div>
          )}
        </div>

        {item.note && <p className="text-xs text-swiss-muted group-hover:text-swiss-bg/60 mt-2 line-clamp-2">{item.note}</p>}

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold uppercase tracking-wide border border-swiss-ink group-hover:border-swiss-bg/30 text-swiss-ink group-hover:text-swiss-bg/70 px-1.5 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
