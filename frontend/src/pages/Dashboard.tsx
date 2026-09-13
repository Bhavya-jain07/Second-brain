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
import { SearchIcon, SortIcon, SparkleIcon } from "../components/Icons";
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
  const [smartMode, setSmartMode] = useState(false);
  const [smartResults, setSmartResults] = useState<ContentItem[] | null>(null);
  const [smartLoading, setSmartLoading] = useState(false);

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

  // Debounced semantic search — only runs while "Smart" mode is on, and
  // waits half a second after typing stops so we're not hitting the
  // (locally-run, but not free of CPU cost) embedding model on every
  // keystroke.
  useEffect(() => {
    if (!smartMode || !query.trim()) {
      setSmartResults(null);
      return;
    }
    const handle = setTimeout(async () => {
      setSmartLoading(true);
      try {
        const res = await api.post("/content/search", { query: query.trim() });
        setSmartResults(res.data.content);
      } catch (err) {
        showToast(friendlyError(err), "error");
        setSmartResults([]);
      } finally {
        setSmartLoading(false);
      }
    }, 500);
    return () => clearTimeout(handle);
  }, [smartMode, query]);

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

  async function handleUploadFile(file: File) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/content/upload", formData);

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
    // Smart mode with an active query defers entirely to the semantic
    // search results from the server (already ranked by relevance).
    if (smartMode && query.trim() && smartResults) {
      return filter === "all" ? smartResults : smartResults.filter((c) => c.type === filter);
    }

    let list = filter === "all" ? content : content.filter((c) => c.type === filter);

    const q = query.trim().toLowerCase();
    if (q && !smartMode) {
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
  }, [content, filter, query, sortOrder, smartMode, smartResults]);

  const counts = useMemo(
    () => ({
      all: content.length,
      youtube: content.filter((c) => c.type === "youtube").length,
      twitter: content.filter((c) => c.type === "twitter").length,
      file: content.filter((c) => c.type === "file").length,
      other: content.filter((c) => c.type === "other").length,
    }),
    [content]
  );

  if (!token) return <Navigate to="/signin" replace />;

  return (
    <div className="min-h-screen bg-swiss-bg text-swiss-ink pb-16 sm:pb-0">
      <Navbar username={username} onShareClick={() => setShareOpen(true)} />

      <div className="flex gap-6 max-w-6xl mx-auto px-6 md:px-10 py-7">
        <Sidebar active={filter} onChange={setFilter} counts={counts} />

        <main className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between mb-6 pb-4 border-b-[3px] border-swiss-ink">
            <h1 className="text-4xl font-extrabold tracking-tight">Your Brain</h1>
            <span className="text-xs font-bold uppercase tracking-wide text-swiss-muted">
              {content.length} saved item{content.length === 1 ? "" : "s"}
            </span>
          </div>

          {/* Search + sort bar */}
          <div className="grid grid-cols-[1fr_auto_auto] border-2 border-swiss-ink mb-2">
            <div className="flex items-center gap-2.5 px-4 py-3 border-r-2 border-swiss-ink">
              <SearchIcon className="w-4 h-4 text-swiss-muted shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={smartMode ? "Ask in plain words… e.g. 'that video about react'" : "Search titles, links, or tags…"}
                className="flex-1 min-w-0 text-sm outline-none bg-transparent placeholder:text-swiss-faint"
              />
            </div>
            <button
              onClick={() => setSmartMode((s) => !s)}
              className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-4 border-r-2 border-swiss-ink transition ${
                smartMode ? "bg-swiss-ink text-swiss-bg" : "hover:bg-swiss-panel"
              }`}
              title="Toggle semantic (meaning-based) search"
            >
              <SparkleIcon className="w-3.5 h-3.5" />
              Smart
            </button>
            <button
              onClick={() => setSortOrder((s) => (s === "newest" ? "oldest" : "newest"))}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-5 hover:bg-swiss-ink hover:text-swiss-bg transition shrink-0"
              title="Toggle sort order"
            >
              <SortIcon className="w-3.5 h-3.5" />
              {sortOrder === "newest" ? "Newest" : "Oldest"}
            </button>
          </div>
          {smartMode && (
            <p className="text-xs text-swiss-muted mb-6">
              {smartLoading
                ? "Searching by meaning…"
                : "Smart search matches by meaning, not just exact words — runs locally, free."}
            </p>
          )}
          {!smartMode && <div className="mb-6" />}

          <DropZone onAddLink={handleAddLink} onUploadFile={handleUploadFile} onBulkAddClick={() => setBulkAddOpen(true)}>
            {loading ? (
              <SkeletonGrid />
            ) : smartMode && smartLoading ? (
              <SkeletonGrid count={3} />
            ) : filtered.length === 0 ? (
              <EmptyState
                message={
                  content.length === 0
                    ? "Nothing here yet — drag a link or file in, paste a link above, or press / to jump right to it."
                    : smartMode && query
                    ? "No meaningfully similar results — try different words."
                    : query
                    ? "No matches for your search."
                    : "Nothing in this category yet."
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t-2 border-l-2 border-swiss-ink">
                {filtered.map((item, i) => (
                  <ContentCard key={item._id} item={item} index={i} onDelete={handleDelete} onEdit={setEditingItem} />
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
