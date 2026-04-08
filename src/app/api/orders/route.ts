import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { wcFetch } from "@/lib/woocommerce";

// ── Validation schema ──────────────────────────────────────────────────────

const BillingSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(1).max(30),
  address_1: z.string().min(1).max(200),
  address_2: z.string().max(200).optional().default(""),
  city: z.string().min(1).max(100),
  state: z.string().max(100).optional().default(""),
  country: z.string().length(2),
});

const LineItemSchema = z.object({
  product_id: z.number().int().positive(),
  quantity: z.number().int().min(1),
});

const CreateOrderSchema = z.object({
  billing: BillingSchema,
  line_items: z.array(LineItemSchema).min(1),
  payment_method: z.string().min(1).max(50),
  customer_note: z.string().max(500).optional().default(""),
});

// ── WC order response (subset we care about) ───────────────────────────────

interface WCOrderResponse {
  id: number;
  number: string;
  status: string;
  total: string;
}

// ── POST /api/orders ───────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = CreateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { billing, line_items, payment_method, customer_note } = parsed.data;

    // Derive a human-readable payment method title from the method slug
    const paymentMethodTitles: Record<string, string> = {
      moyasar_credit: "Credit / Debit Card",
      moyasar_applepay: "Apple Pay",
      moyasar_stcpay: "STC Pay",
      tabby: "Tabby — Pay in 4",
      tamara: "Tamara — Pay in 3",
      cod: "Cash on Delivery",
    };
    const payment_method_title =
      paymentMethodTitles[payment_method] ?? payment_method;

    const order = await wcFetch<WCOrderResponse>({
      endpoint: "orders",
      method: "POST",
      body: {
        billing,
        shipping: billing, // mirror billing → shipping
        line_items,
        payment_method,
        payment_method_title,
        customer_note,
        set_paid: false,
      },
    });

    const response = NextResponse.json(
      {
        id: order.id,
        number: order.number,
        status: order.status,
        total: order.total,
      },
      { status: 201 }
    );
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    console.error("[POST /api/orders]", error);
    // Surface WC validation errors (4xx) vs unexpected server errors
    const message = error instanceof Error ? error.message : "Unknown error";
    const isClientError = message.includes("WC API 4");
    return NextResponse.json(
      { error: isClientError ? "Order could not be placed. Check your details." : "Failed to create order" },
      { status: isClientError ? 422 : 500 }
    );
  }
}
