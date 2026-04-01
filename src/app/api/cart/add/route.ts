import { NextRequest, NextResponse } from "next/server";
import { addToCart } from "@/lib/store-api";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity } = await request.json();

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: "productId and quantity are required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const cartToken = cookieStore.get("wc-cart-token")?.value;

    const result = await addToCart(productId, quantity, cartToken);

    const response = NextResponse.json({ success: true, cart: result.data });

    // Persist cart token for session continuity
    if (result.cartToken) {
      response.cookies.set("wc-cart-token", result.cartToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
    }

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
