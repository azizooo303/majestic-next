export default function ShopLoading() {
  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb skeleton */}
      <div className="border-b border-[rgba(0,0,0,0.08)] py-6">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="h-3 w-48 bg-[#f0f0f0] animate-pulse rounded-sm" />
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar skeleton */}
          <aside className="w-full lg:w-[240px] flex-shrink-0 space-y-6">
            <div className="h-5 w-24 bg-[#f0f0f0] animate-pulse rounded-sm" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 w-32 bg-[#f0f0f0] animate-pulse rounded-sm" />
            ))}
          </aside>

          {/* Product grid skeleton */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div className="h-4 w-32 bg-[#f0f0f0] animate-pulse rounded-sm" />
              <div className="h-8 w-20 bg-[#f0f0f0] animate-pulse rounded-sm" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-square bg-[#f0f0f0] animate-pulse rounded-sm" />
                  <div className="h-3 w-3/4 bg-[#f0f0f0] animate-pulse rounded-sm" />
                  <div className="h-3 w-1/2 bg-[#f0f0f0] animate-pulse rounded-sm" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
