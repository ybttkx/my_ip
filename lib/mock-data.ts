import { IpReport, IpType } from "./types"

export const mockReports: Record<string, IpReport> = {
  // Scenario 1: Clean Residential IP (e.g., China Telecom Residential)
  "113.88.99.123": {
    ip: "113.88.99.123",
    country: "中国",
    countryCode: "CN",
    region: "GD",
    regionName: "广东省",
    city: "深圳市",
    lat: 22.5431,
    lon: 114.0579,
    timezone: "Asia/Shanghai",
    asn: "AS4134",
    asnOrg: "Chinanet",
    isp: "中国电信 (China Telecom)",
    reverseDns: "113.88.99.123.broad.sz.gd.dynamic.163.net",
    proxy: false,
    vpn: false,
    tor: false,
    relay: false,
    hosting: false,
    type: "Residential",
    purityScore: {
      score: 98,
      stars: 5,
      summaryZh: "该 IP 属于住宅宽带，纯净度极佳，适合日常访问大部分网站。",
      summaryEn: "This IP belongs to residential broadband, with excellent purity, suitable for general web access.",
      details: {
        isHosting: false,
        isProxy: false,
        isVpn: false,
        isTor: false,
        isRelay: false
      }
    },
    aiAvailability: {
      chatgpt: {
        name: "ChatGPT",
        status: "blocked",
        reasonZh: "OpenAI 官方服务在该 IP 所在的国家/地区 (CN) 不可用。",
        reasonEn: "OpenAI services are not available in this IP's country/region (CN)."
      },
      claude: {
        name: "Claude",
        status: "blocked",
        reasonZh: "Anthropic 官方服务在该 IP 所在的国家/地区 (CN) 不可用。",
        reasonEn: "Anthropic services are not available in this IP's country/region (CN)."
      },
      gemini: {
        name: "Gemini",
        status: "blocked",
        reasonZh: "Google Gemini 官方服务在该 IP 所在的国家/地区 (CN) 不可用。",
        reasonEn: "Google Gemini is not available in this IP's country/region (CN)."
      },
      perplexity: {
        name: "Perplexity",
        status: "blocked",
        reasonZh: "Perplexity 官方服务在该 IP 所在的国家/地区 (CN) 不可用。",
        reasonEn: "Perplexity is not available in this IP's country/region (CN)."
      },
      grok: {
        name: "Grok",
        status: "blocked",
        reasonZh: "Grok (X Premium) 服务在该 IP 所在的国家/地区 (CN) 不可用。",
        reasonEn: "Grok is not available in this IP's country/region (CN)."
      }
    },
    queryTime: new Date().toISOString()
  },

  // Scenario 2: US Cloud Server / Hosting IP (e.g., AWS EC2 Virginia)
  "3.80.20.45": {
    ip: "3.80.20.45",
    country: "美国",
    countryCode: "US",
    region: "VA",
    regionName: "弗吉尼亚州",
    city: "阿什本",
    lat: 39.0438,
    lon: -77.4874,
    timezone: "America/New_York",
    asn: "AS14618",
    asnOrg: "Amazon.com, Inc.",
    isp: "Amazon Technologies Inc. (AWS)",
    reverseDns: "ec2-3-80-20-45.compute-1.amazonaws.com",
    proxy: false,
    vpn: false,
    tor: false,
    relay: false,
    hosting: true,
    type: "Hosting",
    purityScore: {
      score: 55,
      stars: 3,
      summaryZh: "该 IP 属于云服务器托管网段，纯净度一般，访问主流网站可能会触发人机验证。",
      summaryEn: "This IP belongs to a hosting facility. Average purity; accessing major sites might trigger CAPTCHAs.",
      details: {
        isHosting: true,
        isProxy: false,
        isVpn: false,
        isTor: false,
        isRelay: false
      }
    },
    aiAvailability: {
      chatgpt: {
        name: "ChatGPT",
        status: "restricted",
        reasonZh: "IP 属于云机房网段，访问可能会触发 OpenAI 的验证滑块或被限制速率。",
        reasonEn: "IP is in a cloud hosting range. Access might trigger OpenAI CAPTCHAs or be rate-limited."
      },
      claude: {
        name: "Claude",
        status: "restricted",
        reasonZh: "IP 属于云机房网段，访问可能会触发 Anthropic 的验证滑块或被限制速率。",
        reasonEn: "IP is in a cloud hosting range. Access might trigger Anthropic CAPTCHAs or be rate-limited."
      },
      gemini: {
        name: "Gemini",
        status: "available",
        reasonZh: "该 IP 在 Google Gemini 服务支持区域内，可正常访问。",
        reasonEn: "This IP is within Google Gemini's supported region and can access it normally."
      },
      perplexity: {
        name: "Perplexity",
        status: "available",
        reasonZh: "该 IP 可正常访问 Perplexity AI 服务。",
        reasonEn: "This IP can access Perplexity AI service normally."
      },
      grok: {
        name: "Grok",
        status: "available",
        reasonZh: "该 IP 区域支持 Grok，但机房 IP 可能会触发额外安全策略。",
        reasonEn: "Grok is supported in this region, though hosting IPs might trigger additional firewalls."
      }
    },
    queryTime: new Date().toISOString()
  },

  // Scenario 3: High Risk Proxy/Tor Node (e.g., German Tor Exit Node)
  "185.220.101.5": {
    ip: "185.220.101.5",
    country: "德国",
    countryCode: "DE",
    region: "BY",
    regionName: "巴伐利亚州",
    city: "慕尼黑",
    lat: 48.1351,
    lon: 11.582,
    timezone: "Europe/Berlin",
    asn: "AS206342",
    asnOrg: "Faelix Limited",
    isp: "Faelix Transit",
    reverseDns: "tor-exit-node.faelix.net",
    proxy: true,
    vpn: false,
    tor: true,
    relay: true,
    hosting: true,
    type: "IDC",
    purityScore: {
      score: 10,
      stars: 1,
      summaryZh: "该 IP 是已知的 Tor 出口节点及公开代理，纯净度极低，面临高安全防御拦截风险。",
      summaryEn: "This IP is a known Tor exit node and proxy. Very high risk; likely to be blocked by firewalls.",
      details: {
        isHosting: true,
        isProxy: true,
        isVpn: false,
        isTor: true,
        isRelay: true
      }
    },
    aiAvailability: {
      chatgpt: {
        name: "ChatGPT",
        status: "blocked",
        reasonZh: "OpenAI 防火墙完全屏蔽了公开 Tor 出口节点与匿名代理。",
        reasonEn: "OpenAI firewall completely blocks public Tor exit nodes and anonymous proxies."
      },
      claude: {
        name: "Claude",
        status: "blocked",
        reasonZh: "Anthropic 防火墙完全屏蔽了公开 Tor 出口节点与匿名代理。",
        reasonEn: "Anthropic firewall completely blocks public Tor exit nodes and anonymous proxies."
      },
      gemini: {
        name: "Gemini",
        status: "blocked",
        reasonZh: "Google 安全网关已将该 IP 判定为恶意匿名网关并屏蔽访问。",
        reasonEn: "Google security gateway flagged this IP as a high-risk anonymous gateway and blocked access."
      },
      perplexity: {
        name: "Perplexity",
        status: "restricted",
        reasonZh: "该 IP 可能会触发 Cloudflare 验证码，无法直接访问 API。",
        reasonEn: "This IP will likely trigger Cloudflare verification checks, hindering direct access."
      },
      grok: {
        name: "Grok",
        status: "blocked",
        reasonZh: "xAI 盾牌已拦截此公开代理或 Tor 出口地址。",
        reasonEn: "xAI security systems have blocked this public proxy or Tor exit address."
      }
    },
    queryTime: new Date().toISOString()
  }
}

export function getMockReport(query: string): IpReport {
  // If the query is an IP in our mock list, return it
  if (mockReports[query]) {
    return mockReports[query]
  }

  // Detect loopback, private, and reserved IPs
  const isLoopback = query === "127.0.0.1" || query === "::1" || query.toLowerCase() === "localhost"
  const isPrivate =
    query.startsWith("10.") ||
    query.startsWith("192.168.") ||
    (query.startsWith("172.") && (() => {
      const parts = query.split(".")
      if (parts.length >= 2) {
        const second = parseInt(parts[1], 10)
        return second >= 16 && second <= 31
      }
      return false
    })())

  if (isLoopback || isPrivate) {
    const label = isLoopback ? "本地回环地址 (Loopback)" : "局域网私有地址 (Private IP)"
    return {
      ip: query,
      country: "保留地址",
      countryCode: "XX",
      region: "Local",
      regionName: "本地局域网",
      city: "局域网/回环",
      lat: 0,
      lon: 0,
      timezone: "UTC",
      asn: "N/A",
      asnOrg: "IANA Reserved",
      isp: label,
      reverseDns: "localhost",
      proxy: false,
      vpn: false,
      tor: false,
      relay: false,
      hosting: false,
      type: "Unknown",
      purityScore: {
        score: 0,
        stars: 1,
        summaryZh: "此 IP 属于局域网或本地回环保留网段，无法在公网上进行纯净度与安全分析。",
        summaryEn: "This IP is a local loopback or private network address and cannot be audited on the public Internet.",
        details: {
          isHosting: false,
          isProxy: false,
          isVpn: false,
          isTor: false,
          isRelay: false
        }
      },
      aiAvailability: {
        chatgpt: { name: "ChatGPT", status: "blocked", reasonZh: "本地/局域网 IP 无法连接外部 AI 服务端。", reasonEn: "Local/Private IP cannot connect to AI service endpoints." },
        claude: { name: "Claude", status: "blocked", reasonZh: "本地/局域网 IP 无法连接外部 AI 服务端。", reasonEn: "Local/Private IP cannot connect to AI service endpoints." },
        gemini: { name: "Gemini", status: "blocked", reasonZh: "本地/局域网 IP 无法连接外部 AI 服务端。", reasonEn: "Local/Private IP cannot connect to AI service endpoints." },
        perplexity: { name: "Perplexity", status: "blocked", reasonZh: "本地/局域网 IP 无法连接外部 AI 服务端。", reasonEn: "Local/Private IP cannot connect to AI service endpoints." },
        grok: { name: "Grok", status: "blocked", reasonZh: "本地/局域网 IP 无法连接外部 AI 服务端。", reasonEn: "Local/Private IP cannot connect to AI service endpoints." }
      },
      queryTime: new Date().toISOString()
    }
  }

  // Fallback to generating a mock report based on query length/content
  // E.g., if it starts with a letter, treat it as a domain resolution mock
  const isDomain = /[a-zA-Z]/.test(query)
  const ip = isDomain ? "8.8.8.8" : query

  return {
    ip,
    country: "新加坡",
    countryCode: "SG",
    region: "SG",
    regionName: "新加坡",
    city: "新加坡",
    lat: 1.3521,
    lon: 103.8198,
    timezone: "Asia/Singapore",
    asn: "AS15169",
    asnOrg: "Google LLC",
    isp: "Google LLC",
    reverseDns: "dns.google",
    proxy: false,
    vpn: false,
    tor: false,
    relay: false,
    hosting: true,
    type: "IDC",
    purityScore: {
      score: 75,
      stars: 4,
      summaryZh: "该 IP 属于 Google 公共服务节点，无公开欺诈或代理风险，纯净度良好。",
      summaryEn: "This IP belongs to a Google public service node, with no fraud/proxy flags, good purity.",
      details: {
        isHosting: true,
        isProxy: false,
        isVpn: false,
        isTor: false,
        isRelay: false
      }
    },
    aiAvailability: {
      chatgpt: {
        name: "ChatGPT",
        status: "available",
        reasonZh: "新加坡属于 OpenAI 官方支持访问区域，且此 IP 属于大型受信 service 商段。",
        reasonEn: "Singapore is a supported region for OpenAI, and this IP is in a reputable range."
      },
      claude: {
        name: "Claude",
        status: "available",
        reasonZh: "新加坡属于 Anthropic 官方支持访问区域。",
        reasonEn: "Singapore is a supported region for Anthropic."
      },
      gemini: {
        name: "Gemini",
        status: "available",
        reasonZh: "该 IP 在 Google Gemini 服务支持区域内，可高速访问。",
        reasonEn: "This IP is within Google Gemini's supported region with high-speed access."
      },
      perplexity: {
        name: "Perplexity",
        status: "available",
        reasonZh: "该 IP 可正常访问 Perplexity AI 服务。",
        reasonEn: "This IP can access Perplexity AI service normally."
      },
      grok: {
        name: "Grok",
        status: "available",
        reasonZh: "该 IP 区域可访问 Grok 模块。",
        reasonEn: "Grok is fully accessible in this IP's geographic region."
      }
    },
    queryTime: new Date().toISOString()
  }
}
