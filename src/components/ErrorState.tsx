import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-error-500/10 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-error-500" />
      </div>
      <div>
        <h3 className="text-lg font-serif font-semibold text-ink-800">Something went wrong</h3>
        <p className="text-sm text-ink-500 mt-1 max-w-md">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      )}
    </div>
  );
}
