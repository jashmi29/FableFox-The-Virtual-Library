import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-brass-200/50 bg-parchment-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forest-600 to-forest-800 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-brass-300" />
            </div>
            <span className="font-serif text-lg font-bold text-ink-900">
              Fable<span className="text-forest-700">Fox</span>
            </span>
          </div>
          <p className="text-sm text-ink-500 text-center">
            Book data from{' '}
            <a
              href="https://openlibrary.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest-700 hover:underline"
            >
              Open Library
            </a>
            . Your saved books stay on your device.
          </p>
          <p className="text-xs text-ink-400">© {new Date().getFullYear()} FableFox</p>
        </div>
      </div>
    </footer>
  );
}
