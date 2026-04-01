# Cart Page Design Override

> Overrides `MASTER.md` for the cart page.

## Structure

| # | Section | Content |
|---|---------|---------|
| 1 | Sticky Header | Same as global |
| 2 | Page Title | "Your Cart" / "سلة التسوق" |
| 3 | Cart Content | Two-column: items list + order summary |
| 4 | Empty State | If cart is empty: illustration + CTA to shop |
| 5 | Footer | Same as global |

## Cart Layout

### Desktop (lg+)
```
┌────────────────────────────────┬─────────────────┐
│  Cart Items (65%)              │  Order Summary   │
│  ┌──────────────────────────┐  │  (35%, sticky)   │
│  │ [img] Product Name       │  │                  │
│  │       SAR 1,234  Qty: 1  │  │  Subtotal: X     │
│  │       [Remove]           │  │  Shipping: calc   │
│  └──────────────────────────┘  │  ─────────────    │
│  ┌──────────────────────────┐  │  Total: SAR X     │
│  │ [img] Product Name       │  │                  │
│  │       SAR 2,345  Qty: 2  │  │  [Checkout →]    │
│  └──────────────────────────┘  │                  │
│                                │  Coupon: [____]   │
│  [Continue Shopping]           │  [Apply]          │
└────────────────────────────────┴─────────────────┘
```

### Mobile
- Full width, stacked: cart items list → order summary below

## Cart Item Row

```tsx
<div className="flex gap-4 py-6 border-b border-border">
  <Image src={item.image} alt={item.name} width={120} height={150}
    className="rounded-lg object-cover" />
  <div className="flex-1">
    <h3 className="text-h4">{item.name}</h3>
    <p className="text-small text-dark">{item.category}</p>
    <p className="text-body font-semibold mt-2">{formatPrice(item.price)}</p>
    <div className="flex items-center gap-4 mt-3">
      <QuantitySelector value={item.qty} onChange={updateQty} min={1} max={10} />
      <button className="text-small text-dark hover:text-primary underline">
        Remove
      </button>
    </div>
  </div>
</div>
```

## Order Summary (Sticky)

- **Background:** White card with shadow-md
- **Position:** `sticky top-24` on desktop
- **Contents:**
  - Subtotal
  - Shipping estimate (or "Calculated at checkout")
  - Coupon input + Apply button
  - Divider
  - Total (bold, H3 size)
  - Checkout button (gold, full width)
  - "Continue shopping" ghost link below

## Empty Cart

- **Illustration:** Simple line drawing or icon (cart outline)
- **Headline:** "Your cart is empty" / "سلة التسوق فارغة"
- **CTA:** "Explore our collection" button → /shop
- **No sad faces or emojis**

## Cart Drawer (Side Panel)

In addition to the full cart page, a slide-out cart drawer appears when adding items:

- **Trigger:** "Add to Cart" button on product pages
- **Position:** Sheet from right (LTR) / left (RTL)
- **Contents:** Mini cart items + subtotal + "View Cart" / "Checkout" buttons
- **Implementation:** shadcn/ui Sheet component
- **Dismiss:** User-initiated close only (X button or click outside). No auto-close timer (WCAG 2.2.1 timing compliance)
- **Accessibility:** Include `aria-live="polite"` region to announce item added
