export function BookCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-[2/3] skeleton" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="h-3 w-1/2 skeleton rounded" />
        <div className="h-8 w-full skeleton rounded-lg mt-2" />
      </div>
    </div>
  );
}

export function BookGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}
