# Homepage Design Override

> Overrides `MASTER.md` for the homepage only.
> Reference: workspace.ae homepage — copy this layout and aesthetic exactly.

## Structure (Top to Bottom)

| # | Section | Content | Height |
|---|---------|---------|--------|
| 1 | Sticky Header | Logo left, Nav, Search bar, Sign In, Cart | ~80px |
| 2 | Hero Banner | Full-width product photo, left-aligned headline + CTA | 715px desktop / 400px mobile |
| 3 | Category Nav | Horizontal icon+label row — all categories | ~120px |
| 4 | Featured Products | 4–5 col product grid with prices + Add to Cart | Auto |
| 5 | Promotional Banner | Full-width brand/collection highlight | ~300px |
| 6 | More Products | Second product grid section | Auto |
| 7 | Awards / Credentials | Trust signals: Red Dot, etc. | ~150px |
| 8 | Newsletter | Email input + subscribe | ~200px |
| 9 | Footer | 5 columns + bottom bar | Auto |

## Hero Banner

- **Background:** Full-width product photography, `background-attachment: fixed` parallax
- **Overlay:** Subtle dark overlay `bg-black/20` for text readability
- **Text position:** Left-aligned, 140px from top
- **Headline:** 45px desktop / 27px mobile, font-bold Raleway, tight line-height (0.95), white
- **Tagline:** 1 line below headline, white/90 opacity
- **CTA:** Ghost button — white border + white text, fills white on hover (text goes black)
- **Height:** 715px desktop minimum, 400px mobile

## Category Navigation Strip

Horizontal scrollable row of category icons + labels below hero:
- White background, bottom border
- Each item: category image/icon + label text
- 6–8 categories: Chairs, Desks, Workstations, Height Adjustable, Storage, Lounge, Acoustic, Accessories
- Hover: slight background highlight

```tsx
<section className="w-full bg-white border-b border-[rgba(0,0,0,0.21)] py-6">
  <div className="flex overflow-x-auto gap-4 px-8 no-scrollbar">
    {categories.map(cat => (
      <Link key={cat.slug} href={`/shop?category=${cat.slug}`}
        className="flex flex-col items-center gap-2 min-w-[80px] hover:text-[#0c0c0c]/70">
        <div className="w-16 h-16 bg-[#fafafa] rounded-sm overflow-hidden">
          <Image src={cat.image} alt={cat.name} width={64} height={64} className="object-cover" />
        </div>
        <span className="text-xs font-medium text-[#0c0c0c] text-center whitespace-nowrap">
          {cat.name}
        </span>
      </Link>
    ))}
  </div>
</section>
```

## Featured Products Grid

- **Title:** "Featured Products" or "Best Sellers" — left-aligned, H2, bold Raleway
- **Grid:** 4–5 cols desktop (gap-[15px]), 2–3 tablet, 1–2 mobile
- **Cards:** Show price, discount badge, color swatches, Add to Cart button
- **Prices:** VISIBLE on homepage (unlike old design — workspace.ae shows prices everywhere)
- **CTA at bottom:** "View All Products" black button

## Promotional Banner

Full-width section with brand/collection highlight:
- Product photography left (60%) + text right (40%)
- OR full-width image with text overlay
- Bold headline + description + CTA

## Trust Signals / Awards

- Award logos: Red Dot, German Innovation Award, etc.
- Short copy about quality/warranty
- Horizontal row, centered
