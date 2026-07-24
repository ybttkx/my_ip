import { BaseIpProvider, ProviderReport } from "./base"
import { IpType } from "../types"

interface IpApiResponse {
  status?: string
  message?: string
  country?: string
  countryCode?: string
  region?: string
  regionName?: string
  city?: string
  lat?: number
  lon?: number
  timezone?: string
  isp?: string
  org?: string
  as?: string
  query?: string
  proxy?: boolean
  hosting?: boolean
}

export class IpApiProvider extends BaseIpProvider {
  name = "ip-api"

  async fetchReport(ip: string, signal?: AbortSignal): Promise<ProviderReport> {
    const fields = "status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp,org,as,query,proxy,hosting"
    const response = await fetch(`https://ip-api.com/json/${ip}?fields=${fields}`, {
      next: { revalidate: 600 } // cache 10 min per IP
      , signal
    } as RequestInit & { next: { revalidate: number } })

    if (!response.ok) {
      throw new Error(`ip-api request failed with status ${response.status}`)
    }

    const data = (await response.json()) as IpApiResponse
    if (data.status !== "success") {
      throw new Error(`ip-api error: ${data.message || "Unknown error"}`)
    }

    // Parse ASN (e.g. "AS15169 Google LLC" -> "AS15169" and "Google LLC")
    let asn = ""
    let asnOrg = ""
    if (data.as) {
      const match = data.as.match(/^(AS\d+)\s+(.*)$/)
      if (match) {
        asn = match[1]
        asnOrg = match[2]
      } else {
        asn = data.as
      }
    }

    // Use API-provided flags if available, supplement with heuristics
    const isHosting = data.hosting === true || this.detectHosting(data.isp || "", data.org || "", asnOrg)
    const isProxy = data.proxy === true

    const type: IpType = isHosting ? "IDC" : "Unknown"

    return {
      providerName: this.name,
      ip: data.query || ip,
      country: data.country,
      countryCode: data.countryCode,
      region: data.region,
      regionName: data.regionName,
      city: data.city,
      lat: data.lat,
      lon: data.lon,
      timezone: data.timezone,
      asn,
      asnOrg: asnOrg || data.org || data.isp,
      isp: data.isp,
      org: data.org,
      proxy: isProxy,
      hosting: isHosting,
      type,
      rawData: data
    }
  }

  private detectHosting(isp: string, org: string, asnOrg: string): boolean {
    const cloudKeywords = [
      "amazon", "aws", "microsoft", "azure", "google cloud", "google llc",
      "digitalocean", "linode", "hetzner", "ovh", "vultr", "leaseweb",
      "fastly", "cloudflare", "akamai", "alibaba", "tencent", "oracle",
      "datacenter", "hosting", "server", "cloud", "dedicated", "vps", "telepoint"
    ]
    
    const target = `${isp} ${org} ${asnOrg}`.toLowerCase()
    return cloudKeywords.some(keyword => target.includes(keyword))
  }
}
