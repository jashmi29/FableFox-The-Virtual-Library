import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, LayoutGrid } from 'lucide-react';
import type { Book } from '@/types';
import { fetchBySubject } from '@/services/api';
import { categories } from '@/data/categories';
import BookGrid from '@/components/BookGrid';
import BookModal from '@/components/BookModal';
import ReaderModal from '@/components/ReaderModal';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { BookGridSkeleton } from '@/components/Skeleton';

export default function Browse() {
  const [params, setParams] = useSearchParams();
  const subject = params.get('subject') ?? '';
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Book | null>(null);
  const [reading, setReading] = useState<Book | null>(null);

  const activeCategory = categories.find((c) => c.query === subject);

  const load = useCallback(async (s: string) => {
    if (!s) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBySubject(s, 24);
      setBooks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load books');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (subject) load(subject);
    else {
      setBooks([]);
      setLoading(false);
      setError(null);
    }
  }, [subject, load]);

  const selectCategory = (q: string) => setParams({ subject: q });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 mb-2">
        <Compass className="w-6 h-6 text-brass-500" />
        <h1 className="font-serif text-3xl font-bold text-ink-900">Browse</h1>
      </div>
      <p className="text-ink-500 mb-8">Explore curated collections by subject and genre.</p>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => {
          const active = cat.query === subject;
          return (
            <button
              key={cat.id}
              onClick={() => selectCategory(cat.query)}
              className={`chip border ${
                active
                  ? 'bg-forest-700 text-parchment-50 border-forest-700 shadow-soft'
                  : 'bg-parchment-50 text-ink-700 border-ink-200 hover:border-brass-300 hover:text-forest-700'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          );
        })}
      </div>

      {!subject && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => selectCategory(cat.query)}
              className="group relative overflow-hidden rounded-2xl p-6 text-left bg-parchment-50 border border-ink-200 shadow-card hover:shadow-glow hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-3xl mb-2 block">{cat.emoji}</span>
              <span className="font-serif text-lg font-semibold text-ink-800 block">{cat.label}</span>
              <span className="text-xs text-ink-400 mt-1 inline-flex items-center gap-1">
                Explore <LayoutGrid className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-brass-200/40 blur-xl group-hover:scale-150 transition-transform duration-500" />
            </button>
          ))}
        </div>
      )}

      {subject && (
        <div>
          <h2 className="font-serif text-2xl font-bold text-ink-900 mb-6">
            {activeCategory?.emoji} {activeCategory?.label ?? 'Books'}
          </h2>
          {loading && <BookGridSkeleton count={12} />}
          {!loading && error && <ErrorState message={error} onRetry={() => load(subject)} />}
          {!loading && !error && books.length === 0 && (
            <EmptyState title="No books in this category" message="Try selecting a different subject to explore more books." />
          )}
          {!loading && !error && books.length > 0 && (
            <BookGrid books={books} onOpen={setSelected} />
          )}
        </div>
      )}

      <BookModal book={selected} onClose={() => setSelected(null)} onRead={(b) => {
        setSelected(null);
        setReading(b);
      }} />
      <ReaderModal book={reading} onClose={() => setReading(null)} />
    </div>
  );
}
