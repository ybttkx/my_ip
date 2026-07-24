export interface IpReport {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  lat: number;
  lon: number;
  timezone: string;
  asn: string;
  asnOrg: string;
  isp: string;
  org?: string;
  reverseDns?: string;
  
  // Security flags
  proxy?: boolean;
  vpn?: boolean;
  tor?: boolean;
  relay?: boolean;
  hosting?: boolean;
  
  // Computed info
  type: IpType;
  purityScore: PurityScoreResult;
  aiAvailability: AiAvailabilityResult;
  
  // Raw source debugging or metadata
  queryTime?: string;
}

export type IpType = 'Residential' | 'IDC' | 'Hosting' | 'Mobile' | 'Education' | 'Business' | 'Unknown';

export interface PurityScoreResult {
  score: number; // 0 to 100
  stars: number; // 1 to 5
  summaryZh: string;
  summaryEn: string;
  details: {
    isHosting: boolean;
    isProxy: boolean;
    isVpn: boolean;
    isTor: boolean;
    isRelay: boolean;
  };
}

export type AiStatus = 'available' | 'restricted' | 'blocked'; // ✅ 可用 | ⚠️ 可能受限 | ❌ 不可用

export interface AiServiceStatus {
  name: string;
  status: AiStatus;
  reasonZh: string;
  reasonEn: string;
}

export interface AiAvailabilityResult {
  chatgpt: AiServiceStatus;
  claude: AiServiceStatus;
  gemini: AiServiceStatus;
  perplexity: AiServiceStatus;
  grok: AiServiceStatus;
}

export interface SiteInfo {
  url: string;
  ip?: string;
  cname?: string;
  supportsHttp1_1: boolean;
  tlsVersion?: string;
  cipher?: string;
  cert?: {
    subject: string;
    issuer: string;
    validFrom: string;
    validTo: string;
    daysRemaining: number;
    serialNumber: string;
    fingerprint: string;
  };
  supportsHttp2: boolean;
  supportsHttp3: boolean;
  supportsHsts: boolean;
  hstsDetail?: {
    maxAge: number;
    includeSubDomains: boolean;
    preload: boolean;
  };
  headers?: Record<string, string>;
  server?: string;
  statusCode?: number;
  redirectLocation?: string;
  timings?: {
    dns: number;
    tcp: number;
    tls: number;
    ttfb: number;
    total: number;
  };
  title?: string;
  description?: string;
  icon?: string;
  ipInfo?: {
    ip: string;
    country?: string;
    region?: string;
    city?: string;
    isp?: string;
  };
  error?: string;
}
