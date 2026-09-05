import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../lib/api";
import { ContentItem, ContentType } from "../lib/types";
import { detectType, fetchLinkPreview } from "../lib/linkPreview";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { MobileTabBar } from "../components/MobileTabBar";
import { DropZone } from "../components/DropZone";
import { ContentCard } from "../components/ContentCard";
import { ShareModal } from "../components/ShareModal";
import { SkeletonGrid } from "../components/SkeletonGrid";
import { EmptyState } from "../components/EmptyState";
import { EditContentModal } from "../components/EditContentModal";
import { BulkAddModal } from "../components/BulkAddModal";
import { SearchIcon, SortIcon } from "../components/Icons";
import { useToast, friendlyError } from "../components/Toast";

type SortOrder = "newest" | "oldest";

export function Dashboard() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") ?? undefined;
  const { showToast } = useToast();

  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ContentType | "all">("all");
  const [shareOpen, setShareOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [bulkAddOpen, setBulkAddOpen] = useState(false);

  useEffect(() => {
    if (!token) return;
    loadContent();
  }, []);

  // Press "/" anywhere to jump to the quick-add input, like most apps with
  // a search/add bar. Ignored while typing in a field or with a modal open.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "/") return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (editingItem || bulkAddOpen || shareOpen) return;
      e.preventDefault();
      document.getElementById("sb-quick-add-input")?.focus();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editingItem, bulkAddOpen, shareOpen]);

  async function loadContent() {
    setLoading(true);
    try {
      const res = await api.get("/content");
      setContent(res.data.content);
    } catch (err) {
      showToast(friendlyError(err), "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddLink(url: string) {
    try {
      const type = detectType(url);
      const preview = await fetchLinkPreview(url, type);

      const res = await api.post("/content", {
        link: url,
        type,
        title: preview.title,
        thumbnail: preview.thumbnail,
      });

      setContent((prev) => [res.data.content, ...prev]);
      showToast("Saved!");
    } catch (err) {
      showToast(friendlyError(err), "error");
      throw err;
    }
  }

  async function handleBulkAdd(urls: string[]) {
    let succeeded = 0;
    for (const url of urls) {
      try {
        await handleAddLink(url);
        succeeded++;
      } catch {
        // handleAddLink already toasts the error — keep going with the rest.
      }
    }
    if (succeeded > 0) {
      showToast(`Added ${succeeded} of ${urls.length} link${urls.length === 1 ? "" : "s"}`);
    }
  }

  async function handleDelete(id: string) {
    const removed = content.find((c) => c._id === id);
    setContent((prev) => prev.filter((c) => c._id !== id));
    try {
      await api.delete(`/content/${id}`);
      showToast("Removed");
    } catch (err) {
      if (removed) setContent((prev) => [removed, ...prev]);
      showToast(friendlyError(err), "error");
    }
  }

  async function handleSaveEdit(updates: { tags?: string[]; note?: string; pinned?: boolean }) {
    if (!editingItem) return;
    try {
      const res = await api.patch(`/content/${editingItem._id}`, updates);
      setContent((prev) => prev.map((c) => (c._id === editingItem._id ? res.data.content : c)));
      showToast("Updated");
    } catch (err) {
      showToast(friendlyError(err), "error");
      throw err;
    }
  }

  const filtered = useMemo(() => {
    let list = filter === "all" ? content : content.filter((c) => c.type === filter);

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.link.toLowerCase().includes(q) ||
          (c.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    }

    list = [...list].sort((a, b) => {
      if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? -diff : diff;
    });

    return list;
  }, [content, filter, query, sortOrder]);

  const counts = useMemo(
    () => ({
      all: content.length,
      youtube: content.filter((c) => c.type === "youtube").length,
      twitter: content.filter((c) => c.type === "twitter").length,
      other: content.filter((c) => c.type === "other").length,
    }),
    [content]
  );

  if (!token) return <Navigate to="/signin" replace />;

  return (
    <div className="min-h-screen bg-white pb-16 sm:pb-0">
      <Navbar username={username} onShareClick={() => setShareOpen(true)} />

      <div className="flex gap-6 max-w-6xl mx-auto px-6 py-6">
        <Sidebar active={filter} onChange={setFilter} counts={counts} />

        <main className="flex-1 min-w-0">
          {/* Search + sort bar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 flex items-center gap-2 border border-zinc-200 rounded-lg px-3 py-2">
              <SearchIcon className="w-4 h-4 text-zinc-400 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search titles, links, or tags…"
                className="flex-1 text-sm outline-none bg-transparent placeholder:text-zinc-400"
              />
            </div>
            <button
              onClick={() => setSortOrder((s) => (s === "newest" ? "oldest" : "newest"))}
              className="flex items-center gap-1.5 text-sm text-zinc-600 border border-zinc-200 rounded-lg px-3 py-2 hover:bg-zinc-50 transition shrink-0"
              title="Toggle sort order"
            >
              <SortIcon className="w-4 h-4" />
              {sortOrder === "newest" ? "Newest" : "Oldest"}
            </button>
          </div>

          <DropZone onAddLink={handleAddLink} onBulkAddClick={() => setBulkAddOpen(true)}>
            {loading ? (
              <SkeletonGrid />
            ) : filtered.length === 0 ? (
              <EmptyState
                message={
                  content.length === 0
                    ? "Nothing here yet — drag a link in, paste one above, or press / to jump right to it."
                    : query
                    ? "No matches for your search."
                    : "Nothing in this category yet."
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((item) => (
                  <ContentCard key={item._id} item={item} onDelete={handleDelete} onEdit={setEditingItem} />
                ))}
              </div>
            )}
          </DropZone>
        </main>
      </div>

      <MobileTabBar active={filter} onChange={setFilter} />

      {shareOpen && <ShareModal onClose={() => setShareOpen(false)} />}
      {editingItem && (
        <EditContentModal item={editingItem} onClose={() => setEditingItem(null)} onSave={handleSaveEdit} />
      )}
      {bulkAddOpen && <BulkAddModal onClose={() => setBulkAddOpen(false)} onAddMany={handleBulkAdd} />}
    </div>
  );
}
