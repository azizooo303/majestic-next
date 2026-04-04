import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { addToCart } from "@/lib/store-api";
import { cookies } from "next/headers";

const AddToCartSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(100),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = AddToCartSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { productId, quantity } = parsed.data;

    const cookieStore = await cookies();
    const cartToken = cookieStore.get("wc-cart-token")?.value;

    const result = await addToCart(productId, quantity, cartToken);

    const response = NextResponse.json({ success: true, cart: result.data });
    response.headers.set("Cache-Control", "no-store");

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
