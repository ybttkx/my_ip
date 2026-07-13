import { IpReport, IpType } from "../types"
import { BaseIpProvider, ProviderReport } from "./base"
import { IpApiProvider } from "./ip-api"
import { IpApiCoProvider } from "./ipapi-co"
import { IpInfoIoProvider } from "./ipinfo-io"
import { calculatePurityScore } from "../purity-scorer"
import { detectAiAvailability } from "../ai-detector"
import { mockReports } from "../mock-data"

export class IpManager {
  private providers: BaseIpProvider[] = [
    new IpApiProvider(),
    new IpInfoIoProvider(),
    new IpApiCoProvider()
  ]

  async queryIp(ip: string): Promise<IpReport> {
    // Always use mock data for demo IPs — guaranteed stable display
    if (mockReports[ip]) {
      return mockReports[ip]
    }

    // Concurrent queries with timeout protection (3s — generous for China networks)
    const timeoutMs = 3000
    const queryPromises = this.providers.map(async (provider) => {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), timeoutMs)
      try {
        return await provider.fetchReport(ip, controller.signal)
      } catch (error) {
        if (controller.signal.aborted) {
          throw new Error(`${provider.name} query timed out`)
        }
        throw error
      } finally {
        clearTimeout(timeout)
      }
    })

    const results = await Promise.allSettled(queryPromises)
    const successfulReports: ProviderReport[] = []

    results.forEach((res) => {
      if (res.status === "fulfilled") {
        successfulReports.push(res.value)
      } else {
        console.warn("Provider query failed:", res.reason?.message || res.reason)
      }
    })

    if (successfulReports.length === 0) {
      throw new Error("All IP providers failed to return data.")
    }

    // Merge and Aggregate Data
    // Prioritize providers: ip-api (0) > ipinfo-io (1) > ipapi-co (2)
    const getBestValue = <T>(extractor: (rep: ProviderReport) => T | undefined): T => {
      for (const rep of successfulReports) {
        const val = extractor(rep)
        if (val !== undefined && val !== null && val !== "") {
          return val
        }
      }
      throw new Error("Unable to extract required field from any active provider.")
    }

    const tryGetBestValue = <T>(extractor: (rep: ProviderReport) => T | undefined, fallback: T): T => {
      try {
        return getBestValue(extractor)
      } catch {
        return fallback
      }
    }

    const mergedIp = tryGetBestValue(r => r.ip, ip)
    const country = tryGetBestValue(r => r.country, "Unknown")
    const countryCode = tryGetBestValue(r => r.countryCode, "XX")
    const region = tryGetBestValue(r => r.region, "")
    const regionName = tryGetBestValue(r => r.regionName, "")
    const city = tryGetBestValue(r => r.city, "Unknown")
    const lat = tryGetBestValue(r => r.lat, 0)
    const lon = tryGetBestValue(r => r.lon, 0)
    const timezone = tryGetBestValue(r => r.timezone, "UTC")
    const asn = tryGetBestValue(r => r.asn, "Unknown")
    const asnOrg = tryGetBestValue(r => r.asnOrg, "Unknown")
    const isp = tryGetBestValue(r => r.isp, "Unknown")
    const org = tryGetBestValue(r => r.org, "")
    const reverseDns = tryGetBestValue(r => r.reverseDns, "")

    // Security check: any flag is a flag (一票否决/任何一方检出即认定)
    const hosting = successfulReports.some(r => r.hosting === true)
    const proxy = successfulReports.some(r => r.proxy === true)
    const vpn = successfulReports.some(r => r.vpn === true)
    const tor = successfulReports.some(r => r.tor === true)
    const relay = successfulReports.some(r => r.relay === true)

    // Deduce IP Type (Voting & Heuristic Analysis)
    const deducedType = this.deduceIpType(isp, asnOrg, hosting, mobileKeywordCheck)

    function mobileKeywordCheck(): boolean {
      const mobileKeywords = ["mobile", "cellular", "telecom mobile", "unicom mobile", "lte", "4g", "5g", "t-mobile", "verizon wireless", "vodafone", "orange", "att wireless"]
      const target = `${isp} ${asnOrg}`.toLowerCase()
      return mobileKeywords.some(kw => target.includes(kw))
    }

    // Run Scorer
    const purityScore = calculatePurityScore({
      proxy,
      vpn,
      tor,
      relay,
      hosting,
      isp,
      asnOrg,
      reverseDns
    })

    // Run AI detector
    const aiAvailability = detectAiAvailability({
      countryCode,
      isHosting: purityScore.details.isHosting,
      isProxy: purityScore.details.isProxy || purityScore.details.isVpn || purityScore.details.isTor
    })

    return {
      ip: mergedIp,
      country,
      countryCode,
      region,
      regionName,
      city,
      lat,
      lon,
      timezone,
      asn,
      asnOrg,
      isp,
      org,
      reverseDns,
      proxy,
      vpn,
      tor,
      relay,
      hosting,
      type: deducedType,
      purityScore,
      aiAvailability,
      queryTime: new Date().toISOString()
    }
  }

  private deduceIpType(isp: string, asnOrg: string, isHosting: boolean, isMobile: () => boolean): IpType {
    const text = `${isp} ${asnOrg}`.toLowerCase()

    if (isHosting) {
      return "IDC"
    }

    if (isMobile()) {
      return "Mobile"
    }

    if (text.includes("university") || text.includes("college") || text.includes("education") || text.includes("school") || text.includes("edu")) {
      return "Education"
    }

    // Typical domestic residential providers list
    const residentialKeywords = [
      "chinanet", "telecom", "unicom", "cncgroup", "cable", "broadband",
      "residential", "home", "comcast", "charter", "at&t", "bt-central",
      "deutsche telekom", "kpn", "residential", "consumer", "dynamic-ip"
    ]
    if (residentialKeywords.some(kw => text.includes(kw))) {
      return "Residential"
    }

    // Standard business names or fallback
    if (text.includes("inc.") || text.includes("co.") || text.includes("corporation") || text.includes("ltd.") || text.includes("bank") || text.includes("business")) {
      return "Business"
    }

    return "Unknown"
  }
}
