import { isIpAddress } from "./ip-utils"

interface DnsJsonAnswer {
  data: string
  type: number
}

interface DnsJsonResponse {
  Answer?: DnsJsonAnswer[]
}

export function normalizeDomain(input: string): string | null {
  const trimmed = input.trim().replace(/\.$/, "")
  if (!trimmed || /[\s/?#:]/.test(trimmed)) {
    return null
  }

  try {
    const hostname = new URL(`https://${trimmed}`).hostname.toLowerCase()
    const labels = hostname.split(".")
    const hasValidLabels = labels.length >= 2 && labels.every((label) =>
      label.length > 0 &&
      label.length <= 63 &&
      /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label)
    )

    return hasValidLabels && hostname.length <= 253 ? hostname : null
  } catch {
    return null
  }
}

async function resolveDnsRecord(domain: string, type: "A" | "AAAA"): Promise<string[]> {
  const response = await fetch(
    `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`,
    {
      headers: { accept: "application/dns-json" },
    }
  )

  if (!response.ok) {
    throw new Error(`DNS ${type} query failed with ${response.status}`)
  }

  const data = (await response.json()) as DnsJsonResponse
  return (data.Answer || [])
    .filter((answer) => (type === "A" ? answer.type === 1 : answer.type === 28))
    .map((answer) => answer.data)
    .filter(isIpAddress)
}

export async function resolveDomain(domain: string): Promise<string | null> {
  const [ipv4Result, ipv6Result] = await Promise.allSettled([
    resolveDnsRecord(domain, "A"),
    resolveDnsRecord(domain, "AAAA"),
  ])

  const ipv4Addresses = ipv4Result.status === "fulfilled" ? ipv4Result.value : []
  const ipv6Addresses = ipv6Result.status === "fulfilled" ? ipv6Result.value : []
  return ipv4Addresses[0] || ipv6Addresses[0] || null
}
