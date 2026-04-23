export default function SkeletonCard() {
  return (
    <div className="vspr-card browse-listing-card h-full flex flex-col">
      <div className="browse-listing-image-container skeleton-shimmer" />
      <div className="flex flex-1 flex-col gap-3 browse-listing-info">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-white/[0.06]" />
          <div className="h-3 w-16 rounded bg-white/[0.06]" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-4 w-[85%] rounded bg-white/[0.06]" />
          <div className="h-4 w-[55%] rounded bg-white/[0.06]" />
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-2 browse-listing-footer">
          <div className="h-6 w-16 rounded bg-white/[0.06]" />
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-white/[0.06]" />
            <div className="h-3 w-12 rounded bg-white/[0.06]" />
          </div>
        </div>
      </div>
    </div>
  );
}
