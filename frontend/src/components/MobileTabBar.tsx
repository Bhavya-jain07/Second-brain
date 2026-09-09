import { ContentType } from "../lib/types";
import { BrainIcon, FileIcon, LinkIcon, TwitterIcon, YoutubeIcon } from "./Icons";

interface MobileTabBarProps {
  active: ContentType | "all";
  onChange: (filter: ContentType | "all") => void;
}

const ITEMS: { key: ContentType | "all"; label: string; icon: typeof BrainIcon }[] = [
  { key: "all", label: "All", icon: BrainIcon },
  { key: "youtube", label: "Videos", icon: YoutubeIcon },
  { key: "twitter", label: "Tweets", icon: TwitterIcon },
  { key: "file", label: "Files", icon: FileIcon },
  { key: "other", label: "Links", icon: LinkIcon },
];

export function MobileTabBar({ active, onChange }: MobileTabBarProps) {
  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-swiss-bg border-t-[3px] border-swiss-ink flex items-stretch z-40">
      {ITEMS.map(({ key, label, icon: Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-bold uppercase tracking-wide transition ${
              isActive ? "text-swiss-accent" : "text-swiss-faint"
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
