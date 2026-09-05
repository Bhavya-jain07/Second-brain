import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../lib/api";
import { ContentItem } from "../lib/types";
import { ContentCard } from "../components/ContentCard";
import { BrainIcon } from "../components/Icons";

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
    return <div className="min-h-screen flex items-center justify-center text-zinc-400 text-sm">Loading brain…</div>;
  }

  if (status === "not-found") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2 text-center px-4">
        <BrainIcon className="w-8 h-8 text-zinc-300" />
        <p className="text-zinc-600 font-medium">This share link doesn't exist</p>
        <p className="text-sm text-zinc-400">It may have been removed by its owner.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center gap-2 px-6 py-4 border-b border-zinc-100">
        <BrainIcon className="w-6 h-6 text-brand-600" />
        <span className="font-semibold text-zinc-800">{username}'s Second Brain</span>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-6">
        {content.length === 0 ? (
          <p className="text-sm text-zinc-400 text-center py-16">This brain is empty for now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.map((item) => (
              <ContentCard key={item._id} item={item} readOnly />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
