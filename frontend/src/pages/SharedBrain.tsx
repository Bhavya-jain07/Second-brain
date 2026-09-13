import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../lib/api";
import { ContentItem } from "../lib/types";
import { ContentCard } from "../components/ContentCard";
import { ThemeToggle } from "../components/ThemeToggle";

export function SharedBrain() {
  const { shareLink } = useParams();
  const [username, setUsername] = useState("");
  const [content, setContent] = useState<ContentItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "not-found">("loading");

  useEffect(() => {
    if (!shareLink) return;
    axios
      .get(`${BACKEND_URL}/brain/${shareLink}`)
      .then((res) => {
        setUsername(res.data.username);
        setContent(res.data.content);
        setStatus("ready");
      })
      .catch(() => setStatus("not-found"));
  }, [shareLink]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-swiss-bg flex items-center justify-center text-swiss-muted text-sm">
        Loading brain…
      </div>
    );
  }

  if (status === "not-found") {
    return (
      <div className="min-h-screen bg-swiss-bg flex flex-col items-center justify-center gap-2 text-center px-4">
        <p className="text-5xl font-extrabold text-swiss-faint">∅</p>
        <p className="text-swiss-ink font-bold">This share link doesn't exist</p>
        <p className="text-sm text-swiss-muted">It may have been removed by its owner.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-swiss-bg text-swiss-ink">
      <header className="flex items-center justify-between px-6 md:px-10 py-6 border-b-[3px] border-swiss-ink">
        <span className="font-extrabold text-lg tracking-tight">
          {username}'s SECOND<span className="text-swiss-accent">.</span>BRAIN
        </span>
        <span className="text-xs font-bold uppercase tracking-wide text-swiss-muted flex items-center gap-3">
          Read-only
          <ThemeToggle />
        </span>
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-10 py-8">
        {content.length === 0 ? (
          <p className="text-sm text-swiss-muted text-center py-16 border-2 border-dashed border-swiss-faint">
            This brain is empty for now.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t-2 border-l-2 border-swiss-ink">
            {content.map((item, i) => (
              <ContentCard key={item._id} item={item} index={i} readOnly />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
