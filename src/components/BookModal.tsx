import { useEffect, useState } from 'react';
import { BookMarked, BookOpen, Calendar, Check, Hash, Plus, Star, User, X } from 'lucide-react';
import type { Book } from '@/types';
import { coverUrl } from '@/services/api';
import { useBooks } from '@/context/BooksContext';

interface BookModalProps {
  book: Book | null;
  onClose: () => void;
  onRead: (book: Book) => void;
}

export default function BookModal({ book, onClose, onRead }: BookModalProps) {
  const { isSaved, addBook, removeBook } = useBooks();
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (book) {
      setImgError(false);
      document.body.style.overflow = 'hidden';
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
      window.addEventListener('keydown', onKey);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', onKey);
      };
    }
  }, [book, onClose]);

  if (!book) return null;

  const saved = isSaved(book);
  const cover = coverUrl(book.cover_i ?? book.cover_id, 'L');
  const author = book.author_name?.[0] ?? 'Unknown author';
  const year = book.first_publish_year ?? book.publish_year?.[0];
  const rating = book.ratings_average ? book.ratings_average.toFixed(1) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-parchment-50 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in overflow-hidden border border-brass-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warm library gradient backdrop */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-brass-300/20 blur-3xl" />
          <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-forest-400/15 blur-3xl" />
          <div className="absolute -bottom-24 right-1/3 w-72 h-72 rounded-full bg-brass-200/30 blur-3xl" />
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-parchment-100/90 hover:bg-ink-100 text-ink-600 flex items-center justify-center shadow-md transition-all active:scale-90"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative grid sm:grid-cols-[200px_1fr] gap-6 p-6 sm:p-8">
          <div className="mx-auto sm:mx-0">
            <div className="aspect-[2/3] w-48 sm:w-full rounded-xl overflow-hidden shadow-card bg-ink-100 ring-1 ring-brass-200">
              {cover && !imgError ? (
                <img
                  src={cover}
                  alt={book.title}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-forest-50 to-ink-100">
                  <BookMarked className="w-12 h-12 text-forest-300 mb-2" />
                  <p className="text-sm font-serif text-ink-500">{book.title}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="ornament mb-3 w-fit">
              <span className="font-serif text-xs tracking-widest uppercase text-brass-600">From the Library</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-ink-900 leading-tight">
              {book.title}
            </h2>

            <div className="mt-3 space-y-2 text-sm text-ink-600">
              <p className="flex items-center gap-2">
                <User className="w-4 h-4 text-forest-500" />
                {author}
                {book.author_name && book.author_name.length > 1 && (
                  <span className="text-ink-400">+{book.author_name.length - 1} more</span>
                )}
              </p>
              {year && (
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-forest-500" />
                  First published {year}
                </p>
              )}
              {rating && (
                <p className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-brass-400 fill-brass-400" />
                  {rating} average rating
                </p>
              )}
              {book.edition_count && (
                <p className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-forest-500" />
                  {book.edition_count} editions
                </p>
              )}
              {book.number_of_pages_median && (
                <p className="flex items-center gap-2">
                  <BookMarked className="w-4 h-4 text-forest-500" />
                  {book.number_of_pages_median} pages
                </p>
              )}
            </div>

            {book.subject && book.subject.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-2">
                  Subjects
                </p>
                <div className="flex flex-wrap gap-2">
                  {book.subject.slice(0, 6).map((s) => (
                    <span key={s} className="chip bg-forest-50 text-forest-700 border border-forest-100">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => (saved ? removeBook(book) : addBook(book))}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 ${
                  saved
                    ? 'bg-forest-500/10 text-forest-700 hover:bg-forest-500/20'
                    : 'bg-forest-700 text-parchment-50 hover:bg-forest-800 shadow-soft'
                }`}
              >
                {saved ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {saved ? 'Saved to My Books' : 'Add to My Books'}
              </button>
              <button
                onClick={() => onRead(book)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-brass-500 to-brass-600 text-ink-50 hover:from-brass-600 hover:to-brass-700 shadow-gold transition-all duration-200 active:scale-95"
              >
                <BookOpen className="w-5 h-5" />
                Read
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
