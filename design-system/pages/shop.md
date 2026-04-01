# Shop / Category Page Design Override

> Overrides `MASTER.md` for shop listing pages.

## Structure

| # | Section | Content |
|---|---------|---------|
| 1 | Sticky Header | Same as global |
| 2 | Category Banner | Full-width image (1600x500) + category name overlay |
| 3 | Filter Bar | Sticky below header: category tabs, sort dropdown, grid toggle |
| 4 | Product Grid | Main product listing |
| 5 | Pagination | Load more button or numbered pages |
| 6 | Footer | Same as global |

## Category Banner

- **Dimensions:** 1600x500 (aspect 3.2:1), contained within max-w-7xl
- **Text:** Category name (H1) centered, white text with subtle dark overlay on image
- **Breadcrumb:** Above banner: Home > Shop > Category

## Filter & Sort Bar

- **Position:** Sticky below header (top: 64px when header is scrolled)
- **Background:** White with bottom border
- **Contents:**
  - Category filter tabs (horizontal scroll on mobile)
  - Sort dropdown: "Recommended", "Price: Low to High", "Price: High to Low", "Newest"
  - Grid toggle: 2-col / 3-col / 4-col (desktop only)
  - Results count: "24 products"

```tsx
<div className="sticky top-16 z-40 bg-white border-b border-border py-3">
  <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
    <CategoryTabs categories={categories} active={current} />
    <div className="flex items-center gap-4">
      <span className="text-small text-dark">{count} products</span>
      <SortDropdown value={sort} onChange={setSort} />
    </div>
  </div>
</div>
```

## Product Grid

- **Desktop:** 4 columns, gap-6
- **Tablet:** 3 columns
- **Mobile:** 2 columns, gap-4
- **Card contents:** Image (4:5), product name, category, price (SAR format)
- **Hover:** Image zoom 1.05, card shadow lift, translateY(-4px)
- **Price VISIBLE** on shop pages (unlike homepage)

## Pagination

- **Preferred:** "Load more" button (centered, ghost style)
- **Fallback:** Numbered pagination if total > 48 products
- **Per page:** 12 (mobile), 16 (tablet), 24 (desktop)

## No Sidebar Filter

Following Hay's approach: taxonomy IS the filter. Categories and subcategories provide navigation. No sidebar filter panel cluttering the grid. Sort dropdown handles ordering.

If future needs require filtering (color, material, price range), implement as a slide-out Sheet from the right (LTR) / left (RTL), triggered by a "Filter" button in the filter bar.
