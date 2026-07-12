import { NextRequest, NextResponse } from "next/server"
import { getClientIpFromHeaders, isIpAddress, isPrivateOrReservedIp } from "@/lib/ip-utils"

export async function GET(request: NextRequest) {
  const ip = getClientIpFromHeaders(request.headers) || (request as any).ip || ""

  // If private/loopback/reserved IP (local dev or internal proxy), signal client to detect externally.
  const isLocal = !ip || !isIpAddress(ip) || isPrivateOrReservedIp(ip)

  const response = NextResponse.json(
    { ip: isLocal ? null : ip, local: isLocal },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
      },
    }
  )
  return response
}

export const dynamic = "force-dynamic"
