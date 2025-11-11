import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export interface MultiSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  noResultsText?: string;
  className?: string;
}

// A lightweight searchable multi-select inspired by shadcn/ui patterns.
export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Chọn...",
  noResultsText = "Không có kết quả",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = useCallback(
    (val: string) => {
      if (value.includes(val)) {
        onChange(value.filter((v) => v !== val));
      } else {
        onChange([...value, val]);
      }
    },
    [value, onChange]
  );

  const clearAll = useCallback(() => {
    onChange([]);
  }, [onChange]);

  return (
    <div ref={containerRef} className={`relative ${className || ""}`}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full min-h-10 rounded-md border bg-white text-left px-3 py-2 flex flex-wrap gap-1 items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        {value.length === 0 ? (
          <span className="text-muted-foreground">{placeholder}</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {value
              .map((v) => options.find((o) => o.value === v)?.label || v)
              .map((label, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-xs"
                >
                  {label}
                </span>
              ))}
          </div>
        )}
        <ChevronDown
          className={`ml-auto h-4 w-4 text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-md border bg-white shadow-lg overflow-hidden">
          <div className="p-2 border-b bg-white sticky top-0">
            <Input
              autoFocus
              placeholder="Tìm kiếm..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="max-h-56 overflow-y-auto scrollbar-gentle">
            {filtered.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground">
                {noResultsText}
              </div>
            ) : (
              filtered.map((opt) => {
                const checked = value.includes(opt.value);
                const handleToggle = () => {
                  if (!opt.disabled) {
                    toggle(opt.value);
                  }
                };

                return (
                  <div
                    key={opt.value}
                    className={`w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-50 cursor-pointer ${
                      checked ? "bg-blue-50" : ""
                    } ${opt.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={handleToggle}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={opt.disabled}
                      readOnly
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                    />
                    <span className="text-sm">{opt.label}</span>
                  </div>
                );
              })
            )}
          </div>
          <div className="p-2 border-t flex gap-2 justify-between bg-white">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearAll}
            >
              Xóa hết
            </Button>
            <Button type="button" size="sm" onClick={() => setOpen(false)}>
              Xong
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MultiSelect;
