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
