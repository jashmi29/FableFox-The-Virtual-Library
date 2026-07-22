import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BooksProvider } from '@/context/BooksContext';
import Home from '@/pages/Home';
import Browse from '@/pages/Browse';
import MyBooks from '@/pages/MyBooks';

function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center">
      <h1 className="font-serif text-6xl font-bold text-brand-600">404</h1>
      <p className="text-slate-500 mt-2">Page not found.</p>
    </div>
  );
}

export default function App() {
  return (
    <BooksProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/my-books" element={<MyBooks />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </BooksProvider>
  );
}
