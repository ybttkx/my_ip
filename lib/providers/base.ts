import { IpType } from "../types"

export interface ProviderReport {
  providerName: string;
  ip: string;
  country?: string;
  countryCode?: string;
  region?: string;
  regionName?: string;
  city?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  asn?: string;
  asnOrg?: string;
  isp?: string;
  org?: string;
  reverseDns?: string;
  
  // Threat & Security flags
  proxy?: boolean;
  vpn?: boolean;
  tor?: boolean;
  relay?: boolean;
  hosting?: boolean;
  
  // Type candidate deduced by this provider
  type?: IpType;
  
  rawData?: any;
}

export abstract class BaseIpProvider {
  abstract name: string;
  abstract fetchReport(ip: string): Promise<ProviderReport>;
}
