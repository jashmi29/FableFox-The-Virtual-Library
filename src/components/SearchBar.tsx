import { Search, X } from 'lucide-react';
import type { FormEvent } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search by title, author, or keyword…',
  autoFocus,
}: SearchBarProps) {
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <form onSubmit={submit} className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="input-search"
        aria-label="Search books"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 flex items-center justify-center transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}
