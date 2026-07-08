import { AiAvailabilityResult, AiServiceStatus, AiStatus } from "./types"

interface DetectorInput {
  countryCode: string // e.g. "CN", "US"
  isHosting: boolean
  isProxy: boolean
}

export function detectAiAvailability(input: DetectorInput): AiAvailabilityResult {
  const { countryCode, isHosting, isProxy } = input
  
  // ChatGPT geoblock list
  const chatgptBlocked = ["CN", "HK", "MO", "RU", "IR", "KP", "SY", "VE", "CU"]
  // Claude geoblock list
  const claudeBlocked = ["CN", "RU", "IR", "KP", "SY", "CU"]
  // Gemini geoblock list
  const geminiBlocked = ["CN", "RU", "IR", "KP", "SY", "CU"]
  // Perplexity geoblock list
  const perplexityBlocked = ["CN", "RU", "IR", "KP", "SY"]
  // Grok geoblock list
  const grokBlocked = ["CN", "RU", "IR", "KP", "SY"]

  const checkStatus = (
    serviceName: string,
    blockedCountries: string[],
    isHostingStrict: boolean
  ): AiServiceStatus => {
    let status: AiStatus = "available"
    let reasonZh = "该 IP 所在的地理区域和网络类型符合该服务的正常访问规则。"
    let reasonEn = "This IP's geographic region and network type conform to normal access policies."

    // 1. Regional Geoblock
    if (blockedCountries.includes(countryCode)) {
      status = "blocked"
      reasonZh = `该服务在该 IP 所在的国家/地区 (${countryCode}) 官方不可用。`
      reasonEn = `This service is officially unavailable in this IP's country/region (${countryCode}).`
    }
    // 2. Hosting / IDC restrictions
    else if (isHosting) {
      status = isHostingStrict ? "blocked" : "restricted"
      if (status === "blocked") {
        reasonZh = "该服务完全屏蔽了云机房/托管 (Hosting/IDC) 网段以防范爬虫与滥用。"
        reasonEn = "This service completely blocks cloud hosting/IDC ranges to prevent scraping and abuse."
      } else {
        reasonZh = "该 IP 属于机房/云主机，可能会频繁触发人机安全滑块验证，或被速率限制。"
        reasonEn = "This IP belongs to a cloud server. Access may trigger CAPTCHAs, rate limits, or verification checks."
      }
    }
    // 3. Proxy/VPN security flag
    else if (isProxy) {
      status = "restricted"
      reasonZh = "检测到代理或 VPN 签名，可能会被系统临时拦截或需要额外的人机校验。"
      reasonEn = "Proxy/VPN signatures detected. May face temporary access blocks or require captcha checks."
    }

    return {
      name: serviceName,
      status,
      reasonZh,
      reasonEn
    }
  }

  // ChatGPT is moderately strict on hosting (shows CAPTCHAs / 403 Access Denied) -> restricted
  // Claude is extremely strict on hosting (direct 403 geofence) -> blocked
  // Gemini allows hosting IPs generally but flags proxies -> available/restricted
  // Perplexity blocks CN/RU and triggers CAPTCHAs on hosting -> restricted
  // Grok allows X regions but restricts cloud host nodes -> restricted

  return {
    chatgpt: checkStatus("ChatGPT", chatgptBlocked, false),
    claude: checkStatus("Claude", claudeBlocked, true), // strict hosting block
    gemini: checkStatus("Gemini", geminiBlocked, false),
    perplexity: checkStatus("Perplexity", perplexityBlocked, false),
    grok: checkStatus("Grok", grokBlocked, false)
  }
}
