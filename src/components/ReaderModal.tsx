import { useEffect, useState } from 'react';
import { BookOpen, ExternalLink, Loader2, X } from 'lucide-react';
import type { Book } from '@/types';
import { fetchBookDetails, fetchReadableEdition, openLibraryUrl, type BookDetails, type ReadableEdition } from '@/services/api';

interface ReaderModalProps {
  book: Book | null;
  onClose: () => void;
}

export default function ReaderModal({ book, onClose }: ReaderModalProps) {
  const [details, setDetails] = useState<BookDetails | null>(null);
  const [edition, setEdition] = useState<ReadableEdition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!book) return;
    let active = true;
    setLoading(true);
    setError(null);
    setDetails(null);
    setEdition(null);
    (async () => {
      try {
        const [d, e] = await Promise.all([
          fetchBookDetails(book).catch(() => null),
          fetchReadableEdition(book).catch(() => null),
        ]);
        if (!active) return;
        setDetails(d);
        setEdition(e);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Failed to load preview');
      } finally {
        if (active) setLoading(false);
      }
    })();
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      active = false;
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [book, onClose]);

  if (!book) return null;

  const author = book.author_name?.[0] ?? 'Unknown author';
  const year = book.first_publish_year ?? book.publish_year?.[0];
  const excerpt = details?.excerpts?.[0]?.excerpt;
  const description = details?.description;
  const archiveUrl = edition?.ocaid
    ? `https://archive.org/details/${edition.ocaid}`
    : openLibraryUrl(book);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative paper-texture rounded-2xl shadow-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto animate-scale-in border border-brass-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header band */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-forest-800 to-forest-700 text-parchment-50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brass-300" />
            <span className="font-serif text-lg font-semibold">Reading Preview</span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-forest-600/50 hover:bg-forest-600 text-parchment-100 flex items-center justify-center transition-all active:scale-90"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <div className="ornament mb-4 justify-center w-full">
            <span className="font-serif text-sm tracking-widest uppercase text-brass-600">FableFox Reader</span>
          </div>

          <h2 className="font-serif text-2xl font-bold text-ink-900 leading-tight text-center">
            {book.title}
          </h2>
          <p className="text-center text-ink-500 mt-1.5 text-sm">
            by {author}
            {year && <span className="text-ink-400"> · {year}</span>}
          </p>

          <div className="ornament my-6 justify-center w-full">
            <span className="text-brass-500 text-lg">❦</span>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <Loader2 className="w-8 h-8 text-forest-500 animate-spin-slow" />
              <p className="text-sm text-ink-500 font-medium">Opening the book…</p>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-10">
              <p className="text-sm text-error-600">{error}</p>
              <p className="text-xs text-ink-400 mt-2">
                You can still read this book directly on Open Library.
              </p>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-5">
              {description && (
                <div>
                  <h3 className="font-serif text-sm font-semibold text-brass-700 uppercase tracking-wide mb-2">
                    About this book
                  </h3>
                  <p className="text-ink-700 leading-relaxed text-[15px] whitespace-pre-line">
                    {description.length > 600
                      ? description.slice(0, 600) + '…'
                      : description}
                  </p>
                </div>
              )}

              {excerpt && (
                <div className="border-l-4 border-brass-400 pl-4 py-2 bg-brass-50/50 rounded-r-lg">
                  <h3 className="font-serif text-sm font-semibold text-brass-700 uppercase tracking-wide mb-2">
                    Excerpt
                  </h3>
                  <p className="text-ink-700 leading-relaxed text-[15px] italic whitespace-pre-line">
                    {excerpt.length > 800 ? excerpt.slice(0, 800) + '…' : excerpt}
                  </p>
                </div>
              )}

              {!description && !excerpt && (
                <p className="text-center text-ink-400 text-sm py-6">
                  No preview text available for this title.
                </p>
              )}
            </div>
          )}

          {/* Read full book */}
          <div className="mt-8 pt-6 border-t border-ink-200/60">
            <p className="text-center text-xs text-ink-400 mb-3">
              {edition?.ocaid
                ? 'A readable edition is available. Continue to the full book on Open Library / Internet Archive.'
                : 'Read the full book on Open Library.'}
            </p>
            <a
              href={archiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold w-full"
            >
              <BookOpen className="w-5 h-5" />
              Read full book
              <ExternalLink className="w-4 h-4 opacity-80" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
