import { NextRequest, NextResponse } from "next/server";
import { getCart } from "@/lib/store-api";
import { cookies } from "next/headers";

/** GET /api/cart — Fetch current WooCommerce cart */
export async function GET(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const cartToken = cookieStore.get("wc-cart-token")?.value;

    if (!cartToken) {
      return NextResponse.json({ items: [], totals: null, itemCount: 0 });
    }

    const result = await getCart(cartToken);
    const cart = result.data;

    const response = NextResponse.json({
      items: cart.items,
      totals: cart.totals,
      itemCount: cart.items_count,
      coupons: cart.coupons,
    });
    response.headers.set("Cache-Control", "no-store");

    if (result.cartToken) {
      response.cookies.set("wc-cart-token", result.cartToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("[GET /api/cart]", error);
    return NextResponse.json({ items: [], totals: null, itemCount: 0 });
  }
}
