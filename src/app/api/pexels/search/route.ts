import { NextRequest, NextResponse } from "next/server"
import { searchPexels } from "@/lib/pexels"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const query = searchParams.get("q") || "flowers bouquet"
  const page = Number(searchParams.get("page") || "1")
  const perPage = Number(searchParams.get("per_page") || "15")
  const orientation = searchParams.get("orientation") as
    | "landscape"
    | "portrait"
    | "square"
    | null

  const result = await searchPexels(query, {
    page,
    perPage,
    orientation: orientation || undefined,
  })

  if ("error" in result) {
    return NextResponse.json(result, { status: 500 })
  }

  return NextResponse.json(result)
}
