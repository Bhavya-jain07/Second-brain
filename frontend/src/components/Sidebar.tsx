import { BrainIcon, LinkIcon, TwitterIcon, YoutubeIcon } from "./Icons";
import { ContentType } from "../lib/types";

interface SidebarProps {
  active: ContentType | "all";
  onChange: (filter: ContentType | "all") => void;
  counts: Record<ContentType | "all", number>;
}

const ITEMS: { key: ContentType | "all"; label: string; icon: typeof BrainIcon }[] = [
  { key: "all", label: "All notes", icon: BrainIcon },
  { key: "youtube", label: "Videos", icon: YoutubeIcon },
  { key: "twitter", label: "Tweets", icon: TwitterIcon },
  { key: "other", label: "Links", icon: LinkIcon },
];

export function Sidebar({ active, onChange, counts }: SidebarProps) {
  return (
    <aside className="w-56 shrink-0 border-r border-zinc-100 pr-4 hidden sm:block">
      <nav className="space-y-1">
        {ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive ? "bg-brand-50 text-brand-700" : "text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {label}
              </span>
              <span className={`text-xs ${isActive ? "text-brand-500" : "text-zinc-400"}`}>{counts[key]}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
