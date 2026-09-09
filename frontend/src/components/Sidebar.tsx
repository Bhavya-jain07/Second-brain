import { ContentType } from "../lib/types";

interface SidebarProps {
  active: ContentType | "all";
  onChange: (filter: ContentType | "all") => void;
  counts: Record<ContentType | "all", number>;
}

const ITEMS: { key: ContentType | "all"; label: string; idx: string }[] = [
  { key: "all", label: "All notes", idx: "01" },
  { key: "youtube", label: "Videos", idx: "02" },
  { key: "twitter", label: "Tweets", idx: "03" },
  { key: "file", label: "Files", idx: "04" },
  { key: "other", label: "Links", idx: "05" },
];

export function Sidebar({ active, onChange, counts }: SidebarProps) {
  return (
    <aside className="w-52 shrink-0 border-r-[3px] border-swiss-ink pr-5 hidden sm:block">
      <p className="text-[11px] font-bold uppercase tracking-widest text-swiss-muted mb-4">Filter</p>
      <nav>
        {ITEMS.map(({ key, label, idx }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`w-full flex items-baseline justify-between py-2.5 border-b border-swiss-line text-sm transition ${
                isActive ? "font-bold text-swiss-ink" : "text-swiss-muted hover:text-swiss-ink"
              }`}
            >
              <span>
                <span className={`text-[11px] mr-2 font-bold ${isActive ? "text-swiss-accent" : "text-swiss-faint"}`}>
                  {idx}
                </span>
                {label}
              </span>
              <span className={`text-[11px] ${isActive ? "text-swiss-accent" : "text-swiss-faint"}`}>
                {counts[key]}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
