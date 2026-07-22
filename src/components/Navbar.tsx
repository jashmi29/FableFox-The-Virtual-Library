import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, Library, LayoutGrid, Heart } from 'lucide-react';
import { useBooks } from '@/context/BooksContext';

const links = [
  { to: '/', label: 'Home', icon: Library },
  { to: '/browse', label: 'Browse', icon: LayoutGrid },
  { to: '/my-books', label: 'My Books', icon: Heart },
];

export default function Navbar() {
  const { saved } = useBooks();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-parchment-50/85 backdrop-blur-lg border-b border-brass-200/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-forest-600 to-forest-800 flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 text-brass-300" />
          </div>
          <span className="font-serif text-xl font-bold text-ink-900">
            Fable<span className="text-forest-700">Fox</span>
          </span>
        </NavLink>

        <div className="flex items-center gap-1 sm:gap-2">
          {links.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <NavLink
                key={to}
                to={to}
                className={`relative inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-forest-50 text-forest-700'
                    : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
                {to === '/my-books' && saved.length > 0 && (
                  <span className="absolute -top-1 -right-1 sm:static sm:ml-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brass-500 text-ink-50 text-[10px] font-bold flex items-center justify-center">
                    {saved.length}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
