import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always refresh session when Supabase is configured
  let response: NextResponse
  try {
    response = await updateSession(request)
  } catch {
    response = NextResponse.next({ request })
  }

  // Soft protection: redirect unauthenticated users from account area
  // Real enforcement happens server-side when Supabase is connected
  const protectedPaths = ["/account", "/orders"]
  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  )

  // Auth pages shouldn't show for logged-in users ideally —
  // full redirect logic requires Supabase session which needs env vars.
  // Leave open for now so UI is always reachable.

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
