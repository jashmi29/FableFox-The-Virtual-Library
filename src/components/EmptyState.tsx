import type { ReactNode } from 'react';
import { Search } from 'lucide-react';

export default function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon?: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-forest-50 flex items-center justify-center">
        {icon ?? <Search className="w-9 h-9 text-forest-300" />}
      </div>
      <div>
        <h3 className="text-xl font-serif font-semibold text-ink-800">{title}</h3>
        <p className="text-sm text-ink-500 mt-1.5 max-w-sm mx-auto">{message}</p>
      </div>
      {action}
    </div>
  );
}
