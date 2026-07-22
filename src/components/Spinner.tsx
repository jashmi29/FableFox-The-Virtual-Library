export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin-slow" />
      {label && <p className="text-sm text-slate-500 font-medium">{label}</p>}
    </div>
  );
}
