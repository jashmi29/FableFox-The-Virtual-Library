import { createContext, useCallback, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Book, SavedBook } from '@/types';
import { bookKey } from '@/services/api';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface BooksContextValue {
  saved: SavedBook[];
  isSaved: (book: Book) => boolean;
  addBook: (book: Book) => void;
  removeBook: (book: Book) => void;
  removeByKey: (key: string) => void;
  clearAll: () => void;
}

const BooksContext = createContext<BooksContextValue | null>(null);

const STORAGE_KEY = 'fablefox:saved-books';

export function BooksProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useLocalStorage<SavedBook[]>(STORAGE_KEY, []);

  const isSaved = useCallback(
    (book: Book) => saved.some((b) => b.key === bookKey(book) || b.key === book.key),
    [saved],
  );

  const addBook = useCallback(
    (book: Book) => {
      const k = bookKey(book);
      setSaved((prev) => {
        if (prev.some((b) => b.key === k)) return prev;
        const entry: SavedBook = {
          key: k,
          title: book.title,
          author_name: book.author_name,
          first_publish_year: book.first_publish_year,
          cover_id: book.cover_id ?? book.cover_i,
          cover_i: book.cover_i ?? book.cover_id,
          subject: book.subject,
          savedAt: Date.now(),
        };
        return [entry, ...prev];
      });
    },
    [setSaved],
  );

  const removeBook = useCallback(
    (book: Book) => {
      const k = bookKey(book);
      setSaved((prev) => prev.filter((b) => b.key !== k));
    },
    [setSaved],
  );

  const removeByKey = useCallback(
    (key: string) => setSaved((prev) => prev.filter((b) => b.key !== key)),
    [setSaved],
  );

  const clearAll = useCallback(() => setSaved([]), [setSaved]);

  const value = useMemo(
    () => ({ saved, isSaved, addBook, removeBook, removeByKey, clearAll }),
    [saved, isSaved, addBook, removeBook, removeByKey, clearAll],
  );

  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
}

export function useBooks() {
  const ctx = useContext(BooksContext);
  if (!ctx) throw new Error('useBooks must be used within BooksProvider');
  return ctx;
}
