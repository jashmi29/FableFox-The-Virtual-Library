import { useMemo, useState } from 'react';
import { Heart, Library, Trash2, X } from 'lucide-react';
import type { Book, SavedBook } from '@/types';
import { coverUrl } from '@/services/api';
import { useBooks } from '@/context/BooksContext';
import BookModal from '@/components/BookModal';
import ReaderModal from '@/components/ReaderModal';
import EmptyState from '@/components/EmptyState';

function SavedCard({ book, onOpen, onRemove }: { book: SavedBook; onOpen: (b: Book) => void; onRemove: () => void }) {
  const [imgError, setImgError] = useState(false);
  const cover = coverUrl(book.cover_i ?? book.cover_id, 'M');
  const asBook: Book = {
    key: book.key,
    title: book.title,
    author_name: book.author_name,
    first_publish_year: book.first_publish_year,
    cover_i: book.cover_i ?? book.cover_id,
    cover_id: book.cover_id ?? book.cover_i,
    subject: book.subject,
  };

  return (
    <div className="card group overflow-hidden hover:-translate-y-1 hover:shadow-glow transition-all duration-300 animate-fade-up">
      <div className="relative aspect-[2/3] overflow-hidden bg-ink-100 cursor-pointer" onClick={() => onOpen(asBook)}>
        {cover && !imgError ? (
          <img
            src={cover}
            alt={book.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-forest-50 to-ink-100">
            <Heart className="w-10 h-10 text-forest-300 mb-2" />
            <p className="text-xs font-serif text-ink-500 line-clamp-4">{book.title}</p>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-serif font-semibold text-ink-800 text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
          {book.title}
        </h3>
        <p className="text-xs text-ink-500 mt-1 line-clamp-1">
          {book.author_name?.[0] ?? 'Unknown author'}
        </p>
        {book.first_publish_year && (
          <p className="text-xs text-ink-400 mt-0.5">{book.first_publish_year}</p>
        )}
        <button
          onClick={onRemove}
          className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-error-500/10 text-error-600 hover:bg-error-500 hover:text-parchment-50 transition-all duration-200 active:scale-95"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Remove
        </button>
      </div>
    </div>
  );
}

export default function MyBooks() {
  const { saved, removeByKey, clearAll } = useBooks();
  const [selected, setSelected] = useState<Book | null>(null);
  const [reading, setReading] = useState<Book | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const sorted = useMemo(() => [...saved].sort((a, b) => b.savedAt - a.savedAt), [saved]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-6 h-6 text-brass-500" />
            <h1 className="font-serif text-3xl font-bold text-ink-900">My Books</h1>
          </div>
          <p className="text-ink-500">
            {saved.length === 0
              ? 'Your personal collection — saved on this device.'
              : `${saved.length} ${saved.length === 1 ? 'book' : 'books'} saved on this device.`}
          </p>
        </div>
        {saved.length > 0 && (
          <button
            onClick={() => setConfirmClear(true)}
            className="btn-outline text-error-600 border-error-200 hover:bg-error-50 hover:border-error-300"
          >
            <Trash2 className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      {saved.length === 0 ? (
        <EmptyState
          icon={<Library className="w-9 h-9 text-forest-300" />}
          title="Your library is empty"
          message="Search for books and tap 'Add to My Books' to build your personal collection. Your saved books will appear here and stay on your device."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {sorted.map((book) => (
            <SavedCard
              key={book.key}
              book={book}
              onOpen={setSelected}
              onRemove={() => removeByKey(book.key)}
            />
          ))}
        </div>
      )}

      <BookModal book={selected} onClose={() => setSelected(null)} onRead={(b) => {
        setSelected(null);
        setReading(b);
      }} />
      <ReaderModal book={reading} onClose={() => setReading(null)} />

      {confirmClear && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/70 backdrop-blur-md animate-fade-in"
          onClick={() => setConfirmClear(false)}
        >
          <div
            className="bg-parchment-50 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scale-in border border-brass-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-full bg-error-500/10 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-error-500" />
              </div>
              <button onClick={() => setConfirmClear(false)} className="text-ink-400 hover:text-ink-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <h3 className="font-serif text-xl font-bold text-ink-900 mt-4">Clear all books?</h3>
            <p className="text-sm text-ink-500 mt-1">
              This will remove all {saved.length} books from your collection. This action can't be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setConfirmClear(false)} className="btn-outline flex-1">
                Cancel
              </button>
              <button
                onClick={() => {
                  clearAll();
                  setConfirmClear(false);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-error-600 text-parchment-50 font-medium hover:bg-error-500 transition-colors active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
