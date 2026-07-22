import type { Book, SearchResponse } from '@/types';

const BASE = 'https://openlibrary.org';

export function coverUrl(coverId?: number, size: 'S' | 'M' | 'L' = 'M'): string {
  if (!coverId) return '';
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

export function bookKey(book: Book): string {
  return book.key.replace('/works/', '');
}

export function openLibraryUrl(book: Book): string {
  const key = book.key.startsWith('/works/') ? book.key : `/works/${book.key}`;
  return `https://openlibrary.org${key}`;
}

export interface BookDetails {
  description?: string;
  excerpts?: { excerpt: string; comment?: string }[];
  links?: { url: string; title?: string }[];
}

export async function fetchBookDetails(book: Book): Promise<BookDetails> {
  const key = book.key.startsWith('/works/') ? book.key : `/works/${book.key}`;
  const url = `https://openlibrary.org${key}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load details (${res.status})`);
  const data = await res.json();
  let description: string | undefined;
  if (typeof data.description === 'string') description = data.description;
  else if (data.description?.value) description = data.description.value;
  return {
    description,
    excerpts: data.excerpts,
    links: data.links,
  };
}

export interface ReadableEdition {
  ocaid?: string;
  format?: string;
  title?: string;
}

export async function fetchReadableEdition(book: Book): Promise<ReadableEdition | null> {
  const key = book.key.startsWith('/works/') ? book.key : `/works/${book.key}`;
  const url = `https://openlibrary.org${key}/editions.json?limit=20`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const entries: any[] = data.entries || [];
  const readable = entries.find((e) => e.ocaid && (e.formats || []).some((f: string) => f.includes('pdf') || f.includes('epub') || f.includes('text')));
  if (readable) return { ocaid: readable.ocaid, format: 'archive', title: readable.title };
  const withOcaid = entries.find((e) => e.ocaid);
  if (withOcaid) return { ocaid: withOcaid.ocaid, format: 'archive', title: withOcaid.title };
  return null;
}

export async function searchBooks(query: string, limit = 24): Promise<Book[]> {
  const q = query.trim();
  if (!q) return [];
  const url = `${BASE}/search.json?q=${encodeURIComponent(q)}&limit=${limit}&fields=key,title,author_name,first_publish_year,publish_year,cover_i,cover_id,isbn,subject,number_of_pages_median,ratings_average,language,edition_count`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Search failed (${res.status})`);
  const data: SearchResponse = await res.json();
  return data.docs;
}

export async function fetchBySubject(subject: string, limit = 24): Promise<Book[]> {
  const url = `${BASE}/subjects/${encodeURIComponent(subject)}.json?limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Browse failed (${res.status})`);
  const data = await res.json();
  return (data.works || []).map((w: any) => ({
    key: w.key,
    title: w.title,
    author_name: w.authors ? [w.authors.map((a: any) => a.name).join(', ')] : [],
    first_publish_year: undefined,
    cover_id: w.cover_id,
    cover_i: w.cover_id,
    subject: [subject],
  })) as Book[];
}

export async function fetchTrending(limit = 12): Promise<Book[]> {
  // Open Library trending picks via a popular subject search
  const url = `${BASE}/search.json?q=subject:bestsellers&sort=rating&limit=${limit}&fields=key,title,author_name,first_publish_year,cover_i,subject,ratings_average`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Trending failed (${res.status})`);
  const data: SearchResponse = await res.json();
  return data.docs;
}
