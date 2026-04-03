import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

const REVALIDATION_SECRET = process.env["REVALIDATION_SECRET"] ?? "dev-secret";

export async function POST(request: NextRequest) {
  // Validate secret
  const authHeader = request.headers.get("x-revalidation-secret");
  if (authHeader !== REVALIDATION_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid revalidation secret" },
      { status: 401 },
    );
  }

  let body: { tag?: string } = {};
  try {
    body = (await request.json()) as { tag?: string };
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const tag = body.tag ?? "products";
  const allowedTags = ["products", "offers", "categories"] as const;
  type AllowedTag = (typeof allowedTags)[number];

  if (!allowedTags.includes(tag as AllowedTag)) {
    return NextResponse.json(
      {
        error: `Invalid tag. Allowed: ${allowedTags.join(", ")}`,
      },
      { status: 400 },
    );
  }

  try {
    revalidateTag(tag);
    return NextResponse.json({
      revalidated: true,
      tag,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to revalidate", detail: String(error) },
      { status: 500 },
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Revalidation endpoint is active",
  });
}
