import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// Sanity webhook triggers this to revalidate cached pages after content changes.
// Webhook secret must be set in SANITY_REVALIDATE_SECRET env variable.
export async function POST(request: Request) {
  const secret = request.headers.get("x-sanity-secret");

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  // Revalidate all localized pages that may have Sanity content
  revalidatePath("/en", "layout");
  revalidatePath("/ar", "layout");
  revalidatePath("/en/faq");
  revalidatePath("/ar/faq");
  revalidatePath("/en/showrooms");
  revalidatePath("/ar/showrooms");
  revalidatePath("/en/about");
  revalidatePath("/ar/about");
  revalidatePath("/en/blog");
  revalidatePath("/ar/blog");

  return NextResponse.json({ revalidated: true, ts: Date.now() });
}
