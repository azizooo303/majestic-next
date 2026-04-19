export default function Loading() {
  return (
    <main id="main-content" className="min-h-[60vh] bg-white">
      {/* Hero skeleton */}
      <div className="border-b border-[#D4D4D4] py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="h-3 w-32 bg-[#f0f0f0] animate-pulse rounded-sm mb-4" />
          <div className="h-10 w-64 bg-[#f0f0f0] animate-pulse rounded-sm" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="py-16 md:py-24">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 space-y-6">
          <div className="h-4 w-full max-w-2xl bg-[#f0f0f0] animate-pulse rounded-sm" />
          <div className="h-4 w-full max-w-xl bg-[#f0f0f0] animate-pulse rounded-sm" />
          <div className="h-4 w-full max-w-lg bg-[#f0f0f0] animate-pulse rounded-sm" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[16/9] bg-[#f0f0f0] animate-pulse rounded-sm" />
                <div className="h-4 w-3/4 bg-[#f0f0f0] animate-pulse rounded-sm" />
                <div className="h-3 w-1/2 bg-[#f0f0f0] animate-pulse rounded-sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
