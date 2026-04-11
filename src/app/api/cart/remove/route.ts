import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { removeFromCart } from "@/lib/store-api";
import { cookies } from "next/headers";

const RemoveSchema = z.object({
  itemKey: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = RemoveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const cartToken = cookieStore.get("wc-cart-token")?.value;
    if (!cartToken) {
      return NextResponse.json({ error: "No cart session" }, { status: 400 });
    }

    const result = await removeFromCart(parsed.data.itemKey, cartToken);

    const response = NextResponse.json({ success: true, cart: result.data });
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
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
