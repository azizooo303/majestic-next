import { NextRequest, NextResponse } from "next/server";
import { wcFetch } from "@/lib/woocommerce";

// ── Step definitions ───────────────────────────────────────────────────────

interface OrderStep {
  key: string;
  label: string;
  done: boolean;
  active: boolean;
}

const STEPS: { key: string; label: string }[] = [
  { key: "placed", label: "Order Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

// WC status → step index (1-based; 0 = cancelled/failed)
const STATUS_STEP: Record<string, number> = {
  pending: 1,
  processing: 2,
  "on-hold": 2,
  completed: 5,
  cancelled: 0,
  refunded: 0,
  failed: 0,
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending Payment",
  processing: "Processing",
  "on-hold": "On Hold",
  completed: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
  failed: "Payment Failed",
};

function buildSteps(wcStatus: string): OrderStep[] {
  const activeStep = STATUS_STEP[wcStatus] ?? 1;

  // Cancelled / failed: all steps off
  if (activeStep === 0) {
    return STEPS.map((s) => ({ ...s, done: false, active: false }));
  }

  return STEPS.map((s, i) => {
    const stepNumber = i + 1;
    return {
      ...s,
      done: stepNumber < activeStep,
      active: stepNumber === activeStep,
    };
  });
}

// ── WC order shape (subset) ────────────────────────────────────────────────

interface WCOrderSummary {
  id: number;
  number: string;
  status: string;
  date_created: string;
  billing: {
    email: string;
  };
}

// ── GET /api/orders/track?number=&email= ──────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const orderNumber = searchParams.get("number")?.trim();
  const email = searchParams.get("email")?.trim();

  if (!orderNumber || !email) {
    return NextResponse.json(
      { error: "Both 'number' and 'email' query params are required" },
      { status: 400 }
    );
  }

  try {
    const orders = await wcFetch<WCOrderSummary[]>({
      endpoint: "orders",
      params: { search: orderNumber, per_page: 1 },
    });

    if (!orders.length) {
      return NextResponse.json({ found: false });
    }

    const order = orders[0];

    // Verify ownership via email (case-insensitive)
    if (order.billing.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ found: false });
    }

    const statusLabel = STATUS_LABELS[order.status] ?? order.status;
    const steps = buildSteps(order.status);

    const response = NextResponse.json({
      found: true,
      orderNumber: order.number,
      status: order.status,
      statusLabel,
      date_created: order.date_created,
      steps,
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    console.error("[GET /api/orders/track]", error);
    return NextResponse.json({ error: "Failed to look up order" }, { status: 500 });
  }
}
