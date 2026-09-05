import { createContext, ReactNode, useCallback, useContext, useState } from "react";

type ToastKind = "success" | "error";
interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

interface ToastContextValue {
  showToast: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// Maps common backend error messages to something a bit friendlier. Falls
// back to the server's own message (our API already writes fairly plain
// messages), and finally to a generic message if nothing is available.
export function friendlyError(err: any): string {
  const raw: string | undefined = err?.response?.data?.message;
  if (err?.code === "ERR_NETWORK") return "Can't reach the server. Is it running?";
  if (err?.response?.status === 429) return raw ?? "Too many attempts. Try again in a few minutes.";
  return raw ?? "Something went wrong. Please try again.";
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, kind: ToastKind = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, kind }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg text-white animate-[fadeIn_0.15s_ease-out] ${
              t.kind === "success" ? "bg-zinc-900" : "bg-red-500"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
