import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Extract client IP from proxy headers
  const xForwardedFor = request.headers.get("x-forwarded-for")
  const xRealIp = request.headers.get("x-real-ip")
  
  let ip = ""
  if (xForwardedFor) {
    ip = xForwardedFor.split(",")[0].trim()
  } else if (xRealIp) {
    ip = xRealIp
  } else {
    ip = (request as any).ip || ""
  }

  // If private/loopback IP (local dev), signal client to detect externally
  const isLocal =
    !ip ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.16.")

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
