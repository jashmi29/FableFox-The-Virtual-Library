import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Compass, Sparkles, TrendingUp } from 'lucide-react';
import type { Book } from '@/types';
import { fetchTrending, searchBooks } from '@/services/api';
import { useBooks } from '@/context/BooksContext';
import SearchBar from '@/components/SearchBar';
import BookGrid from '@/components/BookGrid';
import BookModal from '@/components/BookModal';
import ReaderModal from '@/components/ReaderModal';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { BookGridSkeleton } from '@/components/Skeleton';
import { categories } from '@/data/categories';

export default function Home() {
  const navigate = useNavigate();
  const { saved } = useBooks();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Book | null>(null);
  const [reading, setReading] = useState<Book | null>(null);

  const [trending, setTrending] = useState<Book[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setTrendingLoading(true);
        const books = await fetchTrending(12);
        if (active) setTrending(books);
      } catch (e) {
        if (active) setTrendingError(e instanceof Error ? e.message : 'Failed to load trending books');
      } finally {
        if (active) setTrendingLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setSearching(true);
    setError(null);
    setSearched(true);
    try {
      const books = await searchBooks(q, 30);
      setResults(books);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Search failed');
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  return (
    <div>
      {/* Hero — classic library aesthetic */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest-900 via-forest-800 to-ink-900 text-parchment-50">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brass-400/30 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-forest-400/30 blur-3xl" />
        </div>
        {/* Subtle bookshelf lines */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent 0, transparent 38px, rgba(208,154,54,0.5) 38px, rgba(208,154,54,0.5) 40px)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="ornament mb-6 justify-center w-full">
            <span className="font-serif text-sm tracking-[0.25em] uppercase text-brass-300">Est. FableFox Library</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight max-w-3xl mx-auto animate-fade-up">
            Find your next favorite book
          </h1>
          <p className="mt-5 text-lg text-parchment-200 max-w-xl mx-auto animate-fade-up">
            Wander the stacks of a timeless library. Search millions of titles, discover trending reads, and curate your personal collection.
          </p>
          <div className="mt-8 max-w-2xl mx-auto animate-fade-up">
            <SearchBar value={query} onChange={setQuery} onSubmit={runSearch} autoFocus />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-parchment-200">
            <span className="opacity-70">Popular:</span>
            {['Harry Potter', 'Dune', 'Atomic Habits', 'Pride and Prejudice'].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setQuery(s);
                  runSearch(s);
                }}
                className="px-3 py-1 rounded-full bg-brass-500/15 hover:bg-brass-500/25 transition-colors border border-brass-400/20"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search results */}
        {searching && (
          <>
            <h2 className="font-serif text-2xl font-bold text-ink-900 mb-1">
              Searching for "{query}"
            </h2>
            <BookGridSkeleton count={12} />
          </>
        )}

        {!searching && error && <ErrorState message={error} onRetry={() => runSearch(query)} />}

        {!searching && !error && searched && results.length === 0 && (
          <EmptyState
            title="No books found"
            message={`We couldn't find any books matching "${query}". Try a different title or keyword.`}
          />
        )}

        {!searching && !error && searched && results.length > 0 && (
          <section className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-ink-900">
                Results for "{query}"
              </h2>
              <span className="text-sm text-ink-500">{results.length} books</span>
            </div>
            <BookGrid books={results} onOpen={setSelected} />
          </section>
        )}

        {/* Default landing */}
        {!searched && (
          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-brass-500" />
                <h2 className="font-serif text-2xl font-bold text-ink-900">Trending Reads</h2>
              </div>
              {trendingLoading && <BookGridSkeleton count={12} />}
              {trendingError && !trendingLoading && <ErrorState message={trendingError} />}
              {!trendingLoading && !trendingError && trending.length > 0 && (
                <BookGrid books={trending} onOpen={setSelected} />
              )}
            </section>

            <section>
              <div className="flex items-center gap-2 mb-6">
                <Compass className="w-6 h-6 text-brass-500" />
                <h2 className="font-serif text-2xl font-bold text-ink-900">Browse by Category</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => navigate(`/browse?subject=${cat.query}`)}
                    className="group relative overflow-hidden rounded-2xl p-5 text-left bg-parchment-50 border border-ink-200 shadow-card hover:shadow-glow hover:-translate-y-1 transition-all duration-300"
                  >
                    <span className="text-3xl mb-2 block">{cat.emoji}</span>
                    <span className="font-serif text-lg font-semibold text-ink-800 block">{cat.label}</span>
                    <span className="text-xs text-ink-400 mt-1 inline-flex items-center gap-1">
                      Explore <BookOpen className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-brass-200/40 blur-xl group-hover:scale-150 transition-transform duration-500" />
                  </button>
                ))}
              </div>
            </section>

            {saved.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="w-6 h-6 text-brass-500" />
                  <h2 className="font-serif text-2xl font-bold text-ink-900">Continue Reading</h2>
                </div>
                <BookGrid books={saved.slice(0, 6)} onOpen={setSelected} />
              </section>
            )}
          </div>
        )}
      </main>

      <BookModal book={selected} onClose={() => setSelected(null)} onRead={(b) => {
        setSelected(null);
        setReading(b);
      }} />
      <ReaderModal book={reading} onClose={() => setReading(null)} />
    </div>
  );
}
