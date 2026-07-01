export function BibleReaderSkeleton() {
  return (
    <div className="px-8 pt-10 pb-6 animate-pulse">
      <div className="h-3 w-12 bg-parchment-dark rounded-full mb-3" />
      <div className="h-10 w-48 bg-parchment-dark rounded-lg mb-2" />
      <div className="h-5 w-24 bg-parchment-dark rounded-lg mb-6" />
      <div className="w-12 h-0.5 bg-parchment-dark rounded-full mb-8" />
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className="flex gap-2 mb-3">
          <div className="h-3 w-3 bg-parchment-dark rounded mt-1 shrink-0" />
          <div
            className="h-3 bg-parchment-dark rounded-full"
            // style={{ width: `${60 + Math.random() * 35}%` }}
          />
        </div>
      ))}
    </div>
  );
}
