import { useState } from 'react';
import { BookMarked, Check, Plus } from 'lucide-react';
import type { Book } from '@/types';
import { coverUrl } from '@/services/api';
import { useBooks } from '@/context/BooksContext';

interface BookCardProps {
  book: Book;
  onOpen: (book: Book) => void;
}

export default function BookCard({ book, onOpen }: BookCardProps) {
  const { isSaved, addBook, removeBook } = useBooks();
  const [imgError, setImgError] = useState(false);
  const saved = isSaved(book);
  const cover = coverUrl(book.cover_i ?? book.cover_id, 'M');
  const author = book.author_name?.[0] ?? 'Unknown author';
  const year = book.first_publish_year ?? book.publish_year?.[0];

  return (
    <div
      className="card group cursor-pointer hover:-translate-y-1 hover:shadow-glow animate-fade-up"
      onClick={() => onOpen(book)}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-ink-100">
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
            <BookMarked className="w-10 h-10 text-forest-300 mb-2" />
            <p className="text-xs font-serif text-ink-500 line-clamp-4">{book.title}</p>
          </div>
        )}
        {saved && (
          <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-forest-500 text-parchment-50 flex items-center justify-center shadow-md">
            <Check className="w-4 h-4" />
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4">
        <h3 className="font-serif font-semibold text-ink-800 text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
          {book.title}
        </h3>
        <p className="text-xs text-ink-500 mt-1 line-clamp-1">{author}</p>
        {year && <p className="text-xs text-ink-400 mt-0.5">{year}</p>}

        <button
          onClick={(e) => {
            e.stopPropagation();
            saved ? removeBook(book) : addBook(book);
          }}
          className={`mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 ${
            saved
              ? 'bg-forest-500/10 text-forest-700 hover:bg-forest-500/20'
              : 'bg-forest-700 text-parchment-50 hover:bg-forest-800 shadow-soft'
          }`}
        >
          {saved ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {saved ? 'In My Books' : 'Add to My Books'}
        </button>
      </div>
    </div>
  );
}
