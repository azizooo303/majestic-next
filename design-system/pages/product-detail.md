# Product Detail Page Design Override

> Overrides `MASTER.md` for individual product pages.

## Structure

| # | Section | Content |
|---|---------|---------|
| 1 | Sticky Header | Same as global |
| 2 | Breadcrumb | Home > Shop > Category > Product Name |
| 3 | Product Hero | Image gallery (left) + Product info (right) |
| 4 | Product Tabs | Description, Specifications, Delivery |
| 5 | Related Products | 4-product carousel |
| 6 | Footer | Same as global |

## Product Hero (Two-Column)

### Desktop Layout (lg+)
- **Left (60%):** Image gallery
- **Right (40%):** Product info, sticky on scroll

### Mobile Layout
- **Full width:** Image carousel (swipe), then product info below

### Image Gallery

```
Desktop:
┌─────────────────────────┬──────────────────┐
│                         │  Product Name     │
│   Main Image (1:1)      │  Category         │
│   1000x1000             │  Price: SAR 1,234 │
│                         │                   │
│                         │  [Add to Cart]    │
├────┬────┬────┬────┬─────│  [Add to Wishlist]│
│ th │ th │ th │ th │ ... │                   │
└────┴────┴────┴────┴─────┴──────────────────┘
```

- **Main image:** 1:1 aspect ratio, 1000x1000, with zoom on hover (2x scale in lightbox)
- **Thumbnails:** Horizontal row below main image, 4-5 visible, scroll for more
- **Mobile:** Full-width swipe carousel with dot indicators
- **Image count:** Show all product images from WooCommerce gallery

### Product Info (Right Column)

```tsx
<div className="lg:sticky lg:top-24 space-y-6">
  <Breadcrumb />
  <h1 className="text-h1">{product.name}</h1>
  <p className="text-body text-dark">{product.short_description}</p>
  <p className="text-h2 font-semibold">{formatPrice(product.price, locale)}</p>
  
  {/* Variant selector if applicable */}
  {product.variations && <VariantSelector variants={product.variations} />}
  
  {/* Quantity */}
  <QuantitySelector value={qty} onChange={setQty} />
  
  {/* CTA */}
  <Button variant="gold" size="lg" className="w-full">
    Add to Cart {/* EN */}
    أضف إلى السلة {/* AR */}
  </Button>
  
  {/* Secondary actions */}
  <Button variant="ghost">Add to Wishlist</Button>
  
  {/* Trust signals */}
  <TrustSignals items={[
    "Authentic product guarantee",
    "Delivery across Saudi Arabia",
    "Warranty included"
  ]} />
</div>
```

## Product Tabs

Three tabs below the hero section:

| Tab | Content |
|-----|---------|
| Description | Full product description from WooCommerce |
| Specifications | Dimensions, materials, weight, SKU — table format |
| Delivery | Shipping info, return policy, warranty |

- **Default active:** Description
- **Implementation:** shadcn/ui Tabs component
- **No "Reviews" tab** — following premium brand pattern (no star ratings)

## Related Products

- **Title:** "You may also like" (EN) / "قد يعجبك أيضًا" (AR)
- **Layout:** Horizontal scroll carousel, 4 visible on desktop, 2 on mobile
- **Cards:** Same as shop product card (image, name, category, price)
- **Source:** WooCommerce related/upsell products, or same category fallback

## BNPL Widget

Below the price, show installment info:
- **Tabby:** "Split into 4 payments of SAR X" with Tabby logo
- **Tamara:** "Split into 3 payments of SAR X" with Tamara logo
- Render only if product price qualifies (check min/max thresholds)
