import { BaseIpProvider, ProviderReport } from "./base"
import { IpType } from "../types"

export class IpApiCoProvider extends BaseIpProvider {
  name = "ipapi-co"

  async fetchReport(ip: string): Promise<ProviderReport> {
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    } as RequestInit & { next: { revalidate: number } })

    if (!response.ok) {
      throw new Error(`ipapi.co request failed with status ${response.status}`)
    }

    const data = await response.json()
    if (data.error) {
      throw new Error(`ipapi.co error: ${data.reason || "Unknown error"}`)
    }

    // Heuristics to determine if it is a hosting/IDC network
    const isHosting = this.detectHosting(data.org || "")
    const type: IpType = isHosting ? "IDC" : "Unknown"

    return {
      providerName: this.name,
      ip: data.ip,
      country: data.country_name,
      countryCode: data.country_code,
      region: data.region_code,
      regionName: data.region,
      city: data.city,
      lat: data.latitude,
      lon: data.longitude,
      timezone: data.timezone,
      asn: data.asn,
      asnOrg: data.org,
      isp: data.org, // ipapi.co typically populates org as ISP
      hosting: isHosting,
      type,
      rawData: data
    }
  }

  private detectHosting(org: string): boolean {
    const cloudKeywords = [
      "amazon", "aws", "microsoft", "azure", "google cloud", "google llc",
      "digitalocean", "linode", "hetzner", "ovh", "vultr", "leaseweb",
      "fastly", "cloudflare", "akamai", "alibaba", "tencent", "oracle",
      "datacenter", "hosting", "server", "cloud", "dedicated", "vps", "faelix"
    ]
    
    const target = org.toLowerCase()
    return cloudKeywords.some(keyword => target.includes(keyword))
  }
}
