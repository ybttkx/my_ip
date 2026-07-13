import { BaseIpProvider, ProviderReport } from "./base"
import { IpType } from "../types"

interface IpInfoResponse {
  error?: { message?: string }
  ip?: string
  country?: string
  region?: string
  city?: string
  loc?: string
  timezone?: string
  org?: string
  company?: { name?: string }
}

export class IpInfoIoProvider extends BaseIpProvider {
  name = "ipinfo-io"

  async fetchReport(ip: string, signal?: AbortSignal): Promise<ProviderReport> {
    const response = await fetch(`https://ipinfo.io/${ip}/json`, {
      next: { revalidate: 3600 } // Cache for 1 hour
      , signal
    } as RequestInit & { next: { revalidate: number } })

    if (!response.ok) {
      throw new Error(`ipinfo.io request failed with status ${response.status}`)
    }

    const data = (await response.json()) as IpInfoResponse
    if (data.error) {
      throw new Error(`ipinfo.io error: ${data.error.message || "Unknown error"}`)
    }

    // Parse coordinates (e.g., "37.3860,-122.0838" -> lat: 37.3860, lon: -122.0838)
    let lat = 0
    let lon = 0
    if (data.loc) {
      const parts = data.loc.split(",")
      if (parts.length === 2) {
        lat = parseFloat(parts[0])
        lon = parseFloat(parts[1])
      }
    }

    // Parse org (e.g., "AS15169 Google LLC" -> "AS15169" and "Google LLC")
    let asn = ""
    let asnOrg = ""
    if (data.org) {
      const match = data.org.match(/^(AS\d+)\s+(.*)$/)
      if (match) {
        asn = match[1]
        asnOrg = match[2]
      } else {
        asnOrg = data.org
      }
    }

    // Heuristics to determine if it is a hosting/IDC network
    const isHosting = this.detectHosting(data.company?.name || "", asnOrg)
    const type: IpType = isHosting ? "IDC" : "Unknown"

    return {
      providerName: this.name,
      ip: data.ip || ip,
      country: data.country, // ipinfo.io only returns 2-letter country code
      countryCode: data.country,
      region: data.region,
      regionName: data.region,
      city: data.city,
      lat,
      lon,
      timezone: data.timezone,
      asn,
      asnOrg: asnOrg || data.org,
      isp: asnOrg || data.org,
      hosting: isHosting,
      type,
      rawData: data
    }
  }

  private detectHosting(companyName: string, asnOrg: string): boolean {
    const cloudKeywords = [
      "amazon", "aws", "microsoft", "azure", "google cloud", "google llc",
      "digitalocean", "linode", "hetzner", "ovh", "vultr", "leaseweb",
      "fastly", "cloudflare", "akamai", "alibaba", "tencent", "oracle",
      "datacenter", "hosting", "server", "cloud", "dedicated", "vps"
    ]
    
    const target = `${companyName} ${asnOrg}`.toLowerCase()
    return cloudKeywords.some(keyword => target.includes(keyword))
  }
}
