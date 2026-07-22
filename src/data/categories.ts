import type { Category } from '@/types';

export const categories: Category[] = [
  { id: 'fiction', label: 'Fiction', query: 'fiction', emoji: '📖', gradient: 'from-forest-600 to-forest-800' },
  { id: 'fantasy', label: 'Fantasy', query: 'fantasy', emoji: '🐉', gradient: 'from-forest-500 to-ink-700' },
  { id: 'mystery', label: 'Mystery & Thriller', query: 'mystery_and_detective_stories', emoji: '🔍', gradient: 'from-ink-700 to-ink-900' },
  { id: 'romance', label: 'Romance', query: 'romance', emoji: '❤️', gradient: 'from-brass-600 to-brass-800' },
  { id: 'scifi', label: 'Science Fiction', query: 'science_fiction', emoji: '🚀', gradient: 'from-forest-700 to-brass-700' },
  { id: 'biography', label: 'Biography', query: 'biography', emoji: '✍️', gradient: 'from-brass-500 to-brass-700' },
  { id: 'history', label: 'History', query: 'history', emoji: '🏛️', gradient: 'from-ink-600 to-brass-700' },
  { id: 'children', label: "Children's Books", query: 'childrens_stories', emoji: '🧸', gradient: 'from-forest-400 to-forest-600' },
  { id: 'poetry', label: 'Poetry', query: 'poetry', emoji: '🪶', gradient: 'from-brass-400 to-brass-600' },
  { id: 'cookbook', label: 'Cooking', query: 'cooking', emoji: '🍳', gradient: 'from-brass-600 to-ink-700' },
  { id: 'travel', label: 'Travel', query: 'travel', emoji: '🧭', gradient: 'from-forest-500 to-brass-500' },
  { id: 'philosophy', label: 'Philosophy', query: 'philosophy', emoji: '💭', gradient: 'from-ink-700 to-forest-800' },
];
