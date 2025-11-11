import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export interface SingleSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface SingleSelectProps {
  options: SingleSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  noResultsText?: string;
  className?: string;
  disabled?: boolean;
}

// A lightweight searchable single select inspired by shadcn/ui patterns.
export function SingleSelect({
  options,
  value,
  onChange,
  placeholder = "Chọn...",
  noResultsText = "Không có kết quả",
  className,
  disabled = false,
}: SingleSelectProps) {
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

  const select = useCallback(
    (val: string) => {
      onChange(val);
      setOpen(false);
    },
    [onChange]
  );

  const clear = useCallback(() => {
    onChange("");
  }, [onChange]);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div ref={containerRef} className={`relative ${className || ""}`}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((s) => !s)}
        disabled={disabled}
        className={`w-full min-h-10 rounded-md border text-left px-3 py-2 flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
          disabled 
            ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200" 
            : "bg-white hover:bg-gray-50"
        }`}
      >
        {!selectedOption ? (
          <span className="text-muted-foreground">{placeholder}</span>
        ) : (
          <span className="text-sm">{selectedOption.label}</span>
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
                const selected = value === opt.value;
                const handleSelect = () => {
                  if (!opt.disabled) {
                    select(opt.value);
                  }
                };

                return (
                  <div
                    key={opt.value}
                    className={`w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-50 cursor-pointer ${
                      selected ? "bg-blue-50" : ""
                    } ${opt.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={handleSelect}
                  >
                    <input
                      type="radio"
                      checked={selected}
                      disabled={opt.disabled}
                      readOnly
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                    />
                    <span className="text-sm">{opt.label}</span>
                  </div>
                );
              })
            )}
          </div>
          <div className="p-2 border-t flex gap-2 justify-between bg-white">
            <Button type="button" variant="outline" size="sm" onClick={clear}>
              Xóa
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

export default SingleSelect;
