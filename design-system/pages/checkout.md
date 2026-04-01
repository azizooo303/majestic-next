# Checkout Page Design Override

> Overrides `MASTER.md` for the checkout page.

## Structure

| # | Section | Content |
|---|---------|---------|
| 1 | Simplified Header | Logo + "Secure Checkout" + back to cart link |
| 2 | Checkout Steps | Contact → Shipping → Payment |
| 3 | Checkout Content | Two-column: form (left) + order summary (right) |
| 4 | Footer | Minimal: trust badges + legal links only |

## Simplified Header

- **NOT the full navigation** — checkout gets a minimal header
- Logo (centered or left), "Secure Checkout" text, "Back to cart" link, EN/AR language toggle
- No mega-menu, no search — but language toggle MUST remain (bilingual users may need to switch mid-checkout)

## Checkout Layout

### Desktop (lg+)
```
┌─────────────────────────────┬──────────────────┐
│  Checkout Form (60%)         │  Order Summary    │
│                              │  (40%, sticky)    │
│  Step 1: Contact Info        │                   │
│  ├ Email                     │  [Product thumb]  │
│  ├ Phone                     │  Item 1: SAR X    │
│  └ Guest / Sign In toggle    │  Item 2: SAR X    │
│                              │  ──────────────   │
│  Step 2: Shipping Address    │  Subtotal: SAR X  │
│  ├ Full Name                 │  Shipping: SAR X  │
│  ├ Address Line 1/2          │  Total: SAR X     │
│  ├ City                      │                   │
│  ├ Region (dropdown)         │  Coupon applied:  │
│  └ Postal Code               │  -SAR X           │
│                              │                   │
│  Step 3: Payment Method      │                   │
│  ├ [Moyasar card form]       │                   │
│  ├ [Apple Pay button]        │                   │
│  ├ [STC Pay]                 │                   │
│  ├ [Tabby - 4 installments]  │                   │
│  └ [Tamara - 3 installments] │                   │
│                              │                   │
│  [Complete Order]            │                   │
└─────────────────────────────┴──────────────────┘
```

### Mobile
- Stacked: collapsible order summary at top → form below

## Form Design

- **All inputs:** Full width within form column
- **Labels:** Above inputs, text-small font-medium
- **Validation:** Inline errors below input (`text-error` text, `border-error` border, `bg-error-light` field background)
- **Required fields:** Asterisk after label
- **Implementation:** react-hook-form + zod validation + shadcn/ui form components

### Saudi-Specific Fields

| Field | Notes |
|-------|-------|
| Phone | Saudi format: +966 5X XXX XXXX, validate with regex |
| Region | Dropdown: Riyadh, Makkah, Eastern Province, etc. (13 regions) |
| Postal Code | 5-digit Saudi format |
| Address | Single address line (Saudi addresses are less structured) |

## Payment Methods

Display in this order:

| Method | Provider | Type | Display |
|--------|----------|------|---------|
| Credit/Debit Card | Moyasar | mada, Visa, MC | Embedded card form |
| Apple Pay | Moyasar | Wallet | Apple Pay button (only on Safari/iOS) |
| STC Pay | Moyasar | Mobile wallet | STC Pay branded button |
| Tabby | Tabby | BNPL | "4 interest-free payments of SAR X" |
| Tamara | Tamara | BNPL | "3 interest-free payments of SAR X" |

### Moyasar Card Form

- Embedded iframe from Moyasar SDK
- Supports mada (Saudi debit) — detect BIN range and show mada logo
- Card number, expiry, CVV fields
- Sandbox mode during development

### BNPL Section

- Tabby and Tamara shown as selectable payment options
- When selected, show installment breakdown
- Redirect to Tabby/Tamara checkout on "Complete Order"
- Return URL for success/failure handling

## Order Summary (Sticky)

- Same as cart page summary but read-only (no quantity changes)
- Collapsible on mobile (default collapsed, show "View order summary" toggle)
- Product thumbnails smaller (60x75px)

## Trust Signals

Below the payment form:
- Lock icon + "256-bit SSL encryption"
- Truck icon + "Complimentary delivery on qualifying orders"
- Return icon + "Easy returns within 14 days"
- Shield icon + "Authentic products guaranteed"

## Guest Checkout

- **Default:** Guest checkout (no account required)
- **Optional:** "Create an account" checkbox at contact step
- **Sign in:** Link to sign in for returning customers (preserves cart)

## Success Page

After successful payment:
- Order confirmation number
- "Thank you for your order" / "شكرًا لطلبك"
- Order summary
- Estimated delivery date
- "Continue shopping" CTA
- Email confirmation sent message
