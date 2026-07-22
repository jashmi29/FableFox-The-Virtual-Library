import type { Book } from '@/types';
import BookCard from './BookCard';

interface BookGridProps {
  books: Book[];
  onOpen: (book: Book) => void;
}

export default function BookGrid({ books, onOpen }: BookGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
      {books.map((book) => (
        <BookCard key={book.key} book={book} onOpen={onOpen} />
      ))}
    </div>
  );
}
