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
  onDelete?: (id: string) => void;
  onEdit?: (item: ContentItem) => void;
  readOnly?: boolean;
}

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

export function ContentCard({ item, onDelete, onEdit, readOnly = false }: ContentCardProps) {
  const videoId = item.type === "youtube" ? youtubeIdFromUrl(item.link) : null;
  const isPdf = item.type === "file" && item.fileMimeType === "application/pdf";
  const [copied, setCopied] = useState(false);

  function copyLink(e: React.MouseEvent) {
    e.preventDefault();
    navigator.clipboard.writeText(item.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="group relative rounded-xl border border-zinc-200 bg-white overflow-hidden hover:shadow-md hover:border-zinc-300 transition-shadow">
      {item.pinned && (
        <span className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur rounded-full p-1 shadow-sm text-brand-600">
          <PinIcon filled className="w-3.5 h-3.5" />
        </span>
      )}

      {/* Thumbnail area */}
      {item.type === "youtube" && videoId ? (
        <a href={item.link} target="_blank" rel="noreferrer" className="block relative aspect-video bg-zinc-100">
          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
          <span className="absolute bottom-2 right-2 bg-black/70 rounded-full p-1.5">
            <YoutubeIcon className="w-3.5 h-3.5 text-white" />
          </span>
        </a>
      ) : item.type === "twitter" ? (
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center aspect-video bg-[#1DA1F2]/10"
        >
          <TwitterIcon className="w-9 h-9 text-[#1DA1F2]" />
        </a>
      ) : item.type === "file" ? (
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer"
          download={isPdf ? undefined : item.fileName}
          className={`flex items-center justify-center aspect-video ${isPdf ? "bg-red-50" : "bg-zinc-100"}`}
        >
          {isPdf ? (
            <PdfBadgeIcon className="w-10 h-10 text-red-500" />
          ) : (
            <FileIcon className="w-9 h-9 text-zinc-400" />
          )}
        </a>
      ) : (
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center aspect-video bg-zinc-100"
        >
          <LinkIcon className="w-9 h-9 text-zinc-400" />
        </a>
      )}

      {/* Body */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              download={item.type === "file" && !isPdf ? item.fileName : undefined}
              className="block text-sm font-medium text-zinc-800 truncate hover:text-brand-600"
              title={item.title}
            >
              {item.title}
            </a>
            <p className="text-xs text-zinc-400 truncate mt-0.5">
              {item.type === "file" ? formatFileSize(item.fileSize) : item.link}
            </p>
          </div>

          {!readOnly && (
            <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
              {item.type !== "file" && (
                <button
                  onClick={copyLink}
                  className="text-zinc-300 hover:text-brand-600 transition p-0.5"
                  aria-label="Copy link"
                  title={copied ? "Copied!" : "Copy link"}
                >
                  <CopyIcon />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(item)}
                  className="text-zinc-300 hover:text-brand-600 transition p-0.5"
                  aria-label="Edit"
                  title="Add tags, note, or pin"
                >
                  <EditIcon />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(item._id)}
                  className="text-zinc-300 hover:text-red-500 transition p-0.5"
                  aria-label="Delete"
                >
                  <TrashIcon />
                </button>
              )}
            </div>
          )}
        </div>

        {item.note && <p className="text-xs text-zinc-500 mt-2 line-clamp-2">{item.note}</p>}

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-medium bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
