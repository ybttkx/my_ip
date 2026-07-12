const ipv4Segment = "(25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)"
const ipv4Regex = new RegExp(`^(${ipv4Segment}\\.){3}${ipv4Segment}$`)
const ipv6Regex =
  /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|::(ffff(:0{1,4})?:)?((25[0-5]|(2[0-4]|1?\d)?\d)\.){3}(25[0-5]|(2[0-4]|1?\d)?\d)|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1?\d)?\d)\.){3}(25[0-5]|(2[0-4]|1?\d)?\d))$/

export function isIpAddress(value: string): boolean {
  const ip = value.trim()
  return ipv4Regex.test(ip) || ipv6Regex.test(ip)
}

function parseIpv4(ip: string): number[] | null {
  if (!ipv4Regex.test(ip)) {
    return null
  }
  return ip.split(".").map((part) => Number(part))
}

function isInIpv4Cidr(parts: number[], base: number[], mask: number): boolean {
  const ipValue = parts.reduce((value, part) => (value << 8) + part, 0) >>> 0
  const baseValue = base.reduce((value, part) => (value << 8) + part, 0) >>> 0
  const maskValue = mask === 0 ? 0 : (0xffffffff << (32 - mask)) >>> 0
  return (ipValue & maskValue) === (baseValue & maskValue)
}

function extractMappedIpv4(ip: string): string | null {
  const match = ip.toLowerCase().match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/)
  return match?.[1] && ipv4Regex.test(match[1]) ? match[1] : null
}

export function isPrivateOrReservedIp(value: string): boolean {
  const ip = value.trim()
  const mappedIpv4 = extractMappedIpv4(ip)
  const ipv4 = parseIpv4(mappedIpv4 || ip)

  if (ipv4) {
    const reservedRanges: Array<[number[], number]> = [
      [[0, 0, 0, 0], 8],
      [[10, 0, 0, 0], 8],
      [[100, 64, 0, 0], 10],
      [[127, 0, 0, 0], 8],
      [[169, 254, 0, 0], 16],
      [[172, 16, 0, 0], 12],
      [[192, 0, 0, 0], 24],
      [[192, 0, 2, 0], 24],
      [[192, 168, 0, 0], 16],
      [[198, 18, 0, 0], 15],
      [[198, 51, 100, 0], 24],
      [[203, 0, 113, 0], 24],
      [[224, 0, 0, 0], 4],
      [[240, 0, 0, 0], 4],
      [[255, 255, 255, 255], 32],
    ]
    return reservedRanges.some(([base, mask]) => isInIpv4Cidr(ipv4, base, mask))
  }

  const lower = ip.toLowerCase()
  return (
    lower === "::" ||
    lower === "::1" ||
    lower.startsWith("fc") ||
    lower.startsWith("fd") ||
    lower.startsWith("fe80:") ||
    lower.startsWith("ff")
  )
}

export function getClientIpFromHeaders(headers: Headers): string {
  const cfConnectingIp = headers.get("cf-connecting-ip")
  if (cfConnectingIp) {
    return cfConnectingIp.trim()
  }

  const xForwardedFor = headers.get("x-forwarded-for")
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim()
  }

  return headers.get("x-real-ip")?.trim() || ""
}
