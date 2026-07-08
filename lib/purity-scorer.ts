import { PurityScoreResult } from "./types"

interface ScorerInput {
  proxy: boolean
  vpn: boolean
  tor: boolean
  relay: boolean
  hosting: boolean
  isp: string
  asnOrg: string
  reverseDns?: string
}

export function calculatePurityScore(input: ScorerInput): PurityScoreResult {
  const { proxy, vpn, tor, relay, hosting, isp, asnOrg, reverseDns } = input
  
  let score = 100
  let isHosting = hosting
  let isProxy = proxy
  let isVpn = vpn
  let isTor = tor
  let isRelay = relay

  // Heuristic safety checks (if data sources didn't explicitly flag but ISP/reverseDNS contains clues)
  const textContext = `${isp} ${asnOrg} ${reverseDns || ""}`.toLowerCase()
  
  if (textContext.includes("tor-exit") || textContext.includes("tor.exit")) {
    isTor = true
    isProxy = true
  }
  if (textContext.includes("vpn") || textContext.includes("nordvpn") || textContext.includes("expressvpn") || textContext.includes("surfshark") || textContext.includes("mullvad")) {
    isVpn = true
  }
  if (textContext.includes("proxy") || textContext.includes("socks") || textContext.includes("http-proxy")) {
    isProxy = true
  }
  if (textContext.includes("relay") || textContext.includes("icloud-relay")) {
    isRelay = true
  }
  if (textContext.includes("hosting") || textContext.includes("datacenter") || textContext.includes("vps") || textContext.includes("server") || textContext.includes("cloud")) {
    isHosting = true
  }

  // Scoring Penalty Deductions
  if (isTor) {
    score -= 85
  } else if (isProxy) {
    score -= 75
  } else if (isVpn) {
    score -= 65
  } else if (isRelay) {
    score -= 50
  } else if (isHosting) {
    score -= 40
  }

  // Ensure score stays in 10-100 range
  score = Math.max(10, score)

  // Calculate Stars
  let stars = 1
  if (score >= 90) stars = 5
  else if (score >= 70) stars = 4
  else if (score >= 50) stars = 3
  else if (score >= 30) stars = 2

  // Generate Chinese and English summaries
  let summaryZh = ""
  let summaryEn = ""

  if (isTor) {
    summaryZh = "该 IP 被标记为 Tor 匿名出口节点，网络纯净度极低。面临非常高的高防拦截风险，通常无法直接访问主流金融与 AI 平台。"
    summaryEn = "This IP is flagged as an active Tor exit node. Purity is extremely low; most financial, social, and AI platforms will block this range."
  } else if (isProxy || isVpn) {
    summaryZh = "检测到该 IP 正在使用公开代理或 VPN 节点，纯净度较低。访问敏感网络服务时可能会频繁触发人机安全滑块验证。"
    summaryEn = "VPN or proxy signatures detected on this IP. Purity is low; accessing secure web services may trigger CAPTCHAs or temporary blocks."
  } else if (isRelay) {
    summaryZh = "该 IP 属于中转中继网络（如 iCloud 专网代理）。虽然被判定为安全段，但部分高防网站仍会对中转网段采取人机拦截规则。"
    summaryEn = "This IP is registered under a relay network (e.g. iCloud Private Relay). While secure, some firewalls still apply stricter CAPTCHA rules."
  } else if (isHosting) {
    summaryZh = "该 IP 属于机房托管或云服务网段（IDC）。由于并非真实家庭宽带，访问主流 AI 服务及敏感平台可能会面临速率限制或防刷校验。"
    summaryEn = "This IP is registered under a hosting/cloud provider range (IDC). Because it is not residential, access to AI or sensitive platforms may face captcha screens."
  } else {
    summaryZh = "该 IP 属于原生的家庭住宅宽带或运营商移动蜂窝网络，安全评级极佳。没有任何不良或代理标记，极度纯净，适合畅享所有网络服务。"
    summaryEn = "This IP belongs to residential broadband or mobile cellular, with excellent security. No proxy or hosting tags; highly clean and suitable for all web services."
  }

  return {
    score,
    stars,
    summaryZh,
    summaryEn,
    details: {
      isHosting,
      isProxy,
      isVpn,
      isTor,
      isRelay
    }
  }
}
