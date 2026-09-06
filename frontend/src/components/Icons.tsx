type IconProps = { className?: string };

export function BrainIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.5 3.5a2.5 2.5 0 0 0-2.5 2.5v.2A3 3 0 0 0 5 9a3 3 0 0 0 .6 5.9A2.9 2.9 0 0 0 5 17a3 3 0 0 0 3 3 2.5 2.5 0 0 0 4.5-1.5V6A2.5 2.5 0 0 0 9.5 3.5Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.5 3.5a2.5 2.5 0 0 1 2.5 2.5v.2A3 3 0 0 1 19 9a3 3 0 0 1-.6 5.9A2.9 2.9 0 0 1 19 17a3 3 0 0 1-3 3 2.5 2.5 0 0 1-4.5-1.5V6a2.5 2.5 0 0 1 2.5-2.5Z"
      />
    </svg>
  );
}

export function YoutubeIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3A2.7 2.7 0 0 0 2.4 7.2 28 28 0 0 0 2 12a28 28 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.8ZM10 15V9l5.2 3-5.2 3Z" />
    </svg>
  );
}

export function TwitterIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.9 3H22l-7 8 8.2 10h-6.4l-5-6.6L5 21H2l7.5-8.6L1.6 3H8.2l4.5 6L18.9 3Zm-1.1 16.2h1.8L7.3 4.7H5.4l12.4 14.5Z" />
    </svg>
  );
}

export function LinkIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.1M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1"
      />
    </svg>
  );
}

export function TrashIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-7 0v13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7" />
    </svg>
  );
}

export function CopyIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="9" y="9" width="11" height="11" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </svg>
  );
}

export function SearchIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function SortIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16m0 0-3-3m3 3 3-3M17 20V4m0 0 3 3m-3-3-3 3" />
    </svg>
  );
}

export function PinIcon({ className = "w-4 h-4", filled = false }: IconProps & { filled?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 17v5M8.5 3h7l.7 5.3c.1.9.7 1.7 1.5 2.1l.8.4c.5.2.5 1 0 1.2l-9 3.6c-.5.2-1-.4-.7-.9l.9-1.5c.4-.7.4-1.6 0-2.3L8.5 3Z" />
    </svg>
  );
}

export function EditIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.5 3.5 4 4L8 20H4v-4L16.5 3.5Z" />
    </svg>
  );
}

export function CloseIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function ListIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}

export function FileIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5a1 1 0 0 0 1 1h5M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
    </svg>
  );
}

export function PdfBadgeIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M14 3v5a1 1 0 0 0 1 1h5M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <text x="12" y="17" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="currentColor">PDF</text>
    </svg>
  );
}

export function PaperclipIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.4 11.05 12.5 20a4.95 4.95 0 0 1-7-7l9-8.95a3.5 3.5 0 0 1 5 5L10.5 18a2 2 0 0 1-3-3l7.6-7.55" />
    </svg>
  );
}

export function ShareIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.7 10.3 15.3 7M8.7 13.7l6.6 3.3M18 6a2 2 0 1 0 0-.1V6Zm0 12a2 2 0 1 0 0-.1V18ZM6 12a2 2 0 1 0 0-.1V12Z"
      />
    </svg>
  );
}

export function PlusIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function UploadIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0 4 4m-4-4-4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
    </svg>
  );
}
