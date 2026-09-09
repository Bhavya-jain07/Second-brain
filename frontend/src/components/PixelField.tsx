import { useState } from "react";

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  minLength?: number;
  labelExtra?: React.ReactNode;
}

export function PixelField({ label, value, onChange, placeholder, hint, required, minLength }: FieldProps) {
  return (
    <div className="mb-4">
      <label className="block font-pixel text-[9px] text-[#b494ff] mb-2 before:content-['>_']">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className="w-full px-3 py-2.5 bg-[#120f24]/60 border-2 border-[rgba(255,214,150,0.3)] text-[#f5e9df] text-xl outline-none focus:border-[#ffd696] placeholder:text-[#8a7368] font-retro"
      />
      {hint && <p className="text-xs text-[#8a7368] mt-1.5 font-retro">{hint}</p>}
    </div>
  );
}

export function PixelPasswordField({ label, value, onChange, placeholder, hint, required, minLength, labelExtra }: FieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="block font-pixel text-[9px] text-[#b494ff] before:content-['>_']">{label}</label>
        {labelExtra}
      </div>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          className="w-full px-3 py-2.5 pr-10 bg-[#120f24]/60 border-2 border-[rgba(255,214,150,0.3)] text-[#f5e9df] text-xl outline-none focus:border-[#ffd696] placeholder:text-[#8a7368] font-retro"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#c9a98f] hover:text-[#ffd696] transition"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a15.5 15.5 0 0 1-3.1 4M6.4 6.4A15.7 15.7 0 0 0 2 12s3.5 7 10 7c1.1 0 2.1-.15 3-.44" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {hint && <p className="text-xs text-[#8a7368] mt-1.5 font-retro">{hint}</p>}
    </div>
  );
}
