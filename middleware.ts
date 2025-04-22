import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if we're in a production environment and if the required env vars are set
  if (process.env.NODE_ENV === "production") {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("Missing STRIPE_SECRET_KEY environment variable")
    }

    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.error("Missing NEXT_PUBLIC_BASE_URL environment variable")
    }

    if (!process.env.MONGODB_URI) {
      console.error("Missing MONGODB_URI environment variable")
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/"],
}
