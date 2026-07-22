export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  publish_year?: number[];
  cover_id?: number;
  cover_i?: number;
  isbn?: string[];
  subject?: string[];
  number_of_pages_median?: number;
  ratings_average?: number;
  language?: string[];
  edition_count?: number;
}

export interface SavedBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_id?: number;
  cover_i?: number;
  subject?: string[];
  savedAt: number;
}

export interface SearchResponse {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: Book[];
}

export interface Category {
  id: string;
  label: string;
  query: string;
  emoji: string;
  gradient: string;
}
